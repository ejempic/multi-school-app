#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABEL="ph.eskuwela.local-cloudflare"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_FILE="$PLIST_DIR/$LABEL.plist"
LOG_DIR="$ROOT_DIR/home-server/logs"

mkdir -p "$PLIST_DIR" "$LOG_DIR"
chmod +x "$ROOT_DIR/home-server/start-cloudflare-local.sh"
chmod +x "$ROOT_DIR/home-server/stop-cloudflare-local.sh"

cat > "$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$ROOT_DIR/home-server/start-cloudflare-local.sh</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <dict>
    <key>SuccessfulExit</key>
    <false/>
  </dict>
  <key>StandardOutPath</key>
  <string>$LOG_DIR/launch-agent.out.log</string>
  <key>StandardErrorPath</key>
  <string>$LOG_DIR/launch-agent.err.log</string>
  <key>WorkingDirectory</key>
  <string>$ROOT_DIR</string>
</dict>
</plist>
EOF

launchctl unload "$PLIST_FILE" >/dev/null 2>&1 || true
launchctl load "$PLIST_FILE"

echo "Installed $LABEL"
echo "It will run when you log in and start the Docker app plus Cloudflare Tunnel."
