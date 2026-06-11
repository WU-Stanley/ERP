#!/usr/bin/env bash
# =============================================================================
# ERP Deployment Script
# Manages Docker + Nginx deployment for the ERP application
# =============================================================================
set -euo pipefail

# ---- Configuration ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# Resolve backend root: try multiple possible names/locations (case-sensitive filesystems)
if [ -d "$PROJECT_ROOT/../ERP-BACKEND" ]; then
    BACKEND_ROOT="$(cd "$PROJECT_ROOT/../ERP-BACKEND" && pwd)"
elif [ -d "$PROJECT_ROOT/../ERP-Backend" ]; then
    BACKEND_ROOT="$(cd "$PROJECT_ROOT/../ERP-Backend" && pwd)"
else
    log_error "Backend directory not found. Expected a sibling directory of 'ERP' named ERP-BACKEND or ERP-Backend."
    log_error "Searched in:"
    log_error "  $PROJECT_ROOT/../ERP-BACKEND"
    log_error "  $PROJECT_ROOT/../ERP-Backend"
    exit 1
fi

COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
COMPOSE_PROJECT_NAME="erp"
DOCKER_NETWORK="erp-network"
LOG_DIR="$SCRIPT_DIR/logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ---- Helper Functions ----
log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    cat <<EOF
Usage: $(basename "$0") <command> [options]

Commands:
  deploy          Build and start all services (default)
  deploy-frontend Only build and start the frontend (Nginx)
  deploy-backend  Only build and start the backend
  stop            Stop all services
  restart         Restart all services
  clean           Stop and remove containers, networks, volumes
  logs            Show live logs for all services
  logs-frontend   Show live logs for frontend only
  logs-backend    Show live logs for backend only
  status          Show status of all containers
  rebuild         Force rebuild all images and deploy
  health          Check health of all services
  env-setup       Create .env file from template
  help            Show this help message

Examples:
  $(basename "$0") deploy
  $(basename "$0") deploy --frontend-only
  $(basename "$0") clean
  $(basename "$0") logs -f
EOF
}

# Global: docker command prefix (may be "sudo docker" if user not in docker group)
DOCKER_CMD="docker"

# ---- Prerequisite Checks ----
check_prerequisites() {
    local missing=0

    if ! command -v docker &>/dev/null; then
        log_error "docker is not installed. Please install Docker first."
        missing=1
    elif ! docker info &>/dev/null; then
        # docker info may fail if user is not in the docker group;
        # check if the daemon is actually running as a fallback
        if systemctl is-active --quiet docker 2>/dev/null || service docker status &>/dev/null; then
            # Docker daemon is running but user lacks socket access; use sudo
            if sudo docker info &>/dev/null; then
                log_warn "User not in 'docker' group. Using 'sudo docker' for this session."
                DOCKER_CMD="sudo docker"
            else
                log_error "Docker daemon is running but 'sudo docker info' also failed."
                log_error "Ensure user '$(whoami)' has sudo access to docker."
                exit 1
            fi
        else
            log_error "Docker is not running. Please start Docker."
            missing=1
        fi
    fi

    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Determine compose command (also with sudo if needed)
compose_cmd() {
    if $DOCKER_CMD compose version &>/dev/null 2>&1; then
        echo "$DOCKER_CMD compose"
    elif sudo $DOCKER_CMD compose version &>/dev/null 2>&1; then
        echo "sudo $DOCKER_CMD compose"
    else
        echo "docker-compose"
    fi
}

# ---- Commands ----

cmd_deploy() {
    local frontend_only="${1:-false}"

    log_info "=== ERP Deployment ==="
    mkdir -p "$LOG_DIR"

    # Ensure Docker network exists
    if ! $DOCKER_CMD network inspect "$DOCKER_NETWORK" &>/dev/null 2>&1; then
        log_info "Creating Docker network: $DOCKER_NETWORK"
        $DOCKER_CMD network create "$DOCKER_NETWORK" 2>/dev/null || true
    fi

    if [ "$frontend_only" = "true" ]; then
        log_info "Deploying frontend only..."
        log_info "Building frontend image..."
        $DOCKER_CMD build \
            -f "$SCRIPT_DIR/Dockerfile.nginx" \
            -t erp-frontend:latest \
            "$PROJECT_ROOT" 2>&1 | tail -5
        log_ok "Frontend image built"

        # Stop existing frontend container if running
        if $DOCKER_CMD ps -q -f name=erp-frontend | grep -q .; then
            log_info "Stopping existing frontend container..."
            $DOCKER_CMD stop erp-frontend 2>/dev/null || true
            $DOCKER_CMD rm erp-frontend 2>/dev/null || true
        fi

        # Check if backend is available
        if $DOCKER_CMD ps -q -f name=erp-backend | grep -q .; then
            log_info "Backend container detected, connecting frontend..."
            $DOCKER_CMD network connect "$DOCKER_NETWORK" erp-backend 2>/dev/null || true
        fi

        log_info "Starting frontend container..."
        $DOCKER_CMD run -d \
            --name erp-frontend \
            --network "$DOCKER_NETWORK" \
            -p 80:80 \
            --restart unless-stopped \
            erp-frontend:latest 2>&1
        log_ok "Frontend deployed at http://localhost"
    else
        log_info "Building backend image..."
        $DOCKER_CMD build \
            -f "$BACKEND_ROOT/Dockerfile" \
            -t erp-backend:latest \
            "$BACKEND_ROOT" 2>&1 | tail -5
        log_ok "Backend image built"

        log_info "Building frontend image..."
        $DOCKER_CMD build \
            -f "$SCRIPT_DIR/Dockerfile.nginx" \
            -t erp-frontend:latest \
            "$PROJECT_ROOT" 2>&1 | tail -5
        log_ok "Frontend image built"

        log_info "Starting services with docker compose..."
        $(compose_cmd) -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT_NAME" up -d 2>&1
        log_ok "All services deployed"
    fi

    log_info "Waiting for services to become healthy..."
    sleep 10
    cmd_health
}

cmd_deploy_frontend() { cmd_deploy "true"; }

cmd_deploy_backend() {
    log_info "=== Deploying Backend Only ==="

    log_info "Building backend image..."
    $DOCKER_CMD build \
        -f "$BACKEND_ROOT/Dockerfile" \
        -t erp-backend:latest \
        "$BACKEND_ROOT" 2>&1 | tail -5

    # Start backend if not running
    if ! $DOCKER_CMD ps -q -f name=erp-backend | grep -q .; then
        log_info "Starting backend container..."
        $DOCKER_CMD run -d \
            --name erp-backend \
            --network "$DOCKER_NETWORK" \
            -p 8080:8080 \
            -v "$LOG_DIR":/app/logs \
            --restart unless-stopped \
            erp-backend:latest 2>&1
        log_ok "Backend deployed at http://localhost:8080"
    else
        log_warn "Backend container already running. Use 'restart' to restart it."
    fi
}

cmd_stop() {
    log_info "Stopping all services..."
    $(compose_cmd) -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT_NAME" down 2>/dev/null || true
    $DOCKER_CMD stop erp-frontend 2>/dev/null || true
    $DOCKER_CMD stop erp-backend 2>/dev/null || true
    log_ok "All services stopped"
}

cmd_restart() {
    log_info "Restarting all services..."
    cmd_stop
    sleep 3
    cmd_deploy
}

cmd_clean() {
    log_warn "This will remove containers, networks, and volumes!"
    read -p "Are you sure? (y/N) " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Cleaning up..."
        $(compose_cmd) -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT_NAME" down -v 2>/dev/null || true
        $DOCKER_CMD rm -f erp-frontend 2>/dev/null || true
        $DOCKER_CMD rm -f erp-backend 2>/dev/null || true
        $DOCKER_CMD network rm "$DOCKER_NETWORK" 2>/dev/null || true
        log_ok "Cleanup complete"
    else
        log_info "Cancelled"
    fi
}

cmd_logs() {
    $(compose_cmd) -f "$COMPOSE_FILE" -p "$COMPOSE_PROJECT_NAME" logs -f 2>&1
}

cmd_logs_frontend() {
    $DOCKER_CMD logs -f erp-frontend 2>&1
}

cmd_logs_backend() {
    $DOCKER_CMD logs -f erp-backend 2>&1
}

cmd_status() {
    log_info "=== Container Status ==="
    $DOCKER_CMD ps --filter "name=erp-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true

    log_info "=== Docker Network ==="
    $DOCKER_CMD network inspect "$DOCKER_NETWORK" --format '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null || log_warn "Network not found"
}

cmd_rebuild() {
    log_info "=== Full Rebuild & Deploy ==="
    $DOCKER_CMD rmi erp-frontend:latest erp-backend:latest 2>/dev/null || true
    cmd_deploy
}

cmd_health() {
    log_info "=== Health Checks ==="

    # Frontend health
    if $DOCKER_CMD ps -q -f name=erp-frontend | grep -q .; then
        local frontend_status
        frontend_status=$($DOCKER_CMD inspect --format='{{.State.Health.Status}}' erp-frontend 2>/dev/null || echo "unknown")
        echo -e "  Frontend:  ${GREEN}${frontend_status}${NC}"
    else
        echo -e "  Frontend:  ${RED}not running${NC}"
    fi

    # Backend health
    if $DOCKER_CMD ps -q -f name=erp-backend | grep -q .; then
        local backend_status
        backend_status=$($DOCKER_CMD inspect --format='{{.State.Health.Status}}' erp-backend 2>/dev/null || true)
        if [ -z "$backend_status" ]; then
            backend_status="no health check configured"
        fi
        echo -e "  Backend:   ${GREEN}${backend_status}${NC}"

        # Backend reachable from frontend container (direct port, not through Nginx)
        local api_response
        api_response=$($DOCKER_CMD exec erp-frontend wget -qO- --tries=1 --timeout=5 http://erp-backend:8080/health 2>&1 || true)
        if [[ "$api_response" == *"401"* ]] || [[ "$api_response" == *"healthy"* ]] || [[ "$api_response" == *"unauthorized"* ]]; then
            echo -e "  API:       ${GREEN}reachable (auth required)${NC}"
        elif echo "$api_response" | grep -qi "unreachable\|cannot\|error"; then
            echo -e "  API:       ${RED}unreachable${NC}"
        else
            echo -e "  API:       ${GREEN}reachable${NC}"
        fi
    else
        echo -e "  Backend:   ${RED}not running${NC}"
    fi
}

cmd_env_setup() {
    local env_file="$SCRIPT_DIR/.env"
    if [ -f "$env_file" ]; then
        log_warn ".env file already exists at $env_file"
        read -p "Overwrite? (y/N) " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            log_info "Cancelled"
            return
        fi
    fi

    cat > "$env_file" <<'EOF'
# ERP Deployment Environment Variables
# Edit these values before running deploy.sh

# Backend connection string
DB_CONNECTION_STRING=Server=mssql,1433;Database=WUIAMDb;User=sa;Password=CHANGE_ME;TrustServerCertificate=True;Encrypt=False;

# ASP.NET Environment
ASPNETCORE_ENVIRONMENT=Production

# JWT
JWT_KEY=CHANGE_ME_TO_A_LONG_RANDOM_SECRET
JWT_ISSUER=WUIAM
JWT_AUDIENCE=WUIAM

# Microsoft SSO
MICROSOFT_TENANT_ID=c9a98a3d-152f-4eb3-b93f-9b26fdd08495
MICROSOFT_CLIENT_ID=70af7756-8489-4407-8265-15907d28fa81
MICROSOFT_DEV_CLIENT_ID=a695dca1-f7eb-40ea-8890-cf2bf5f68ad7
MICROSOFT_PROD_CLIENT_ID=70af7756-8489-4407-8265-15907d28fa81
MICROSOFT_REDIRECT_URI=https://erp.uat.wigweuniversity.edu.ng/auth/microsoft-callback

# Brevo email
BREVO_API_KEY=CHANGE_ME
BREVO_MCP_KEY=
BREVO_SENDER_EMAIL=teamit@wigweuniversity.edu.ng
BREVO_SENDER_NAME=Wigwe University Admissions
BREVO_API_URL=https://api.brevo.com/v3

# Backend port mapping
BACKEND_HOST_PORT=8080

# Frontend port mapping
FRONTEND_HOST_PORT=80

# Docker network name
DOCKER_NETWORK=erp-network

# Docker compose project name
COMPOSE_PROJECT_NAME=erp
EOF

    log_ok ".env file created at $env_file"
    log_info "Edit $env_file with your values before deploying"
}

# ---- Main ----
main() {
    local command="${1:-deploy}"
    shift 2>/dev/null || true

    case "$command" in
        deploy)
            # Check for --frontend-only flag
            for arg in "$@"; do
                if [ "$arg" = "--frontend-only" ]; then
                    check_prerequisites
                    cmd_deploy_frontend
                    exit 0
                fi
            done
            check_prerequisites
            cmd_deploy
            ;;
        deploy-frontend)   check_prerequisites; cmd_deploy_frontend ;;
        deploy-backend)    check_prerequisites; cmd_deploy_backend ;;
        stop)              cmd_stop ;;
        restart)           cmd_restart ;;
        clean)             cmd_clean ;;
        logs)              cmd_logs ;;
        logs-frontend)     cmd_logs_frontend ;;
        logs-backend)      cmd_logs_backend ;;
        status)            cmd_status ;;
        rebuild)           check_prerequisites; cmd_rebuild ;;
        health)            cmd_health ;;
        env-setup)         cmd_env_setup ;;
        help|--help|-h)    usage ;;
        *)
            log_error "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

main "$@"
