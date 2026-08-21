#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VITE_LOG="/tmp/eskuwela-vite.log"

npm run dev:setup

node_modules/.bin/vite --host 127.0.0.1 --port 5173 > "$VITE_LOG" 2>&1 &
VITE_PID=$!

cleanup() {
  if kill -0 "$VITE_PID" >/dev/null 2>&1; then
    kill "$VITE_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

sleep 3

if ! kill -0 "$VITE_PID" >/dev/null 2>&1; then
  echo "Vite failed to start. Check $VITE_LOG"
  sed -n '1,200p' "$VITE_LOG"
  exit 1
fi

echo "Vite is running on https://127.0.0.1:5173"
echo "Starting local HTTPS proxy on https://eskuwela.ph"
echo "If prompted, enter your macOS password to bind port 443."

sudo node "$ROOT_DIR/scripts/local-https-proxy.mjs" \
  --host 127.0.0.1 \
  --port 443 \
  --target-host 127.0.0.1 \
  --target-port 5173
