#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/home-server/.env"

if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="$ROOT_DIR/home-server/.env.example"
fi

cd "$ROOT_DIR"
docker compose --env-file "$ENV_FILE" -f home-server/docker-compose.yml down
