# ERP Deployment Guide

## Quick Start

```bash
cd deploy

# Full deployment (frontend + backend)
./deploy.sh deploy

# Frontend only (backend already running)
./deploy.sh deploy-frontend

# Backend only
./deploy.sh deploy-backend

# Check health
./deploy.sh health

# View logs
./deploy.sh logs

# Stop all services
./deploy.sh stop

# Clean up everything
./deploy.sh clean
```

## Commands

| Command | Description |
|---------|-------------|
| `deploy` | Build and start all services |
| `deploy-frontend` | Build and start frontend (Nginx) only |
| `deploy-backend` | Build and start backend only |
| `stop` | Stop all services |
| `restart` | Stop and restart all services |
| `rebuild` | Force rebuild images and deploy |
| `clean` | Remove containers, networks, volumes |
| `logs` | Show live logs for all services |
| `logs-frontend` | Show frontend logs |
| `logs-backend` | Show backend logs |
| `status` | Show container status |
| `health` | Run health checks |
| `env-setup` | Create `.env` template |
| `help` | Show help |

## Architecture

```
Browser
  │
  ▼
Nginx (port 80)
  ├── / → Angular SPA (static files)
  └── /api/* → proxies to backend:8080/api/*
  │
  ▼
.NET Backend (port 8080)
```

## Files

```
deploy/
├── deploy.sh              # Main deployment script
├── docker-compose.yml     # Service orchestration
├── Dockerfile.nginx       # Multi-stage Angular build
├── nginx/
│   └── nginx.conf         # Reverse proxy config
├── logs/                  # Application logs
└── README.md              # This file
```
