#!/bin/bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/server.key \
  -out ssl/server.crt \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
echo "Certificates generated successfully!"
echo "SSL Key: ssl/server.key"
echo "SSL Cert: ssl/server.crt"
