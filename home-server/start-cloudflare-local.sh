#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/home-server/.env"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install and start Docker Desktop first."
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  echo "Create it from home-server/.env.example and set CLOUDFLARED_TOKEN."
  exit 1
fi

cd "$ROOT_DIR"
docker compose --env-file "$ENV_FILE" -f home-server/docker-compose.yml up --build -d
