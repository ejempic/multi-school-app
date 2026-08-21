
#!/usr/bin/env sh
set -eu

HOSTS_FILE="/etc/hosts"

if grep -q "eskuwela.ph" "$HOSTS_FILE" && grep -q "eskuwela.dev" "$HOSTS_FILE"; then
  exit 0
fi

if ! grep -q "eskuwela.ph" "$HOSTS_FILE"; then
  printf '\n127.0.0.1 eskuwela.ph\n127.0.0.1 www.eskuwela.ph\n127.0.0.1 saa.eskuwela.ph\n127.0.0.1 gtwfsl.eskuwela.ph\n127.0.0.1 admin.eskuwela.ph\n' >> "$HOSTS_FILE"
fi

if ! grep -q "eskuwela.dev" "$HOSTS_FILE"; then
  printf '\n127.0.0.1 eskuwela.dev\n127.0.0.1 www.eskuwela.dev\n127.0.0.1 saa.eskuwela.dev\n127.0.0.1 gtwfsl.eskuwela.dev\n127.0.0.1 admin.eskuwela.dev\n' >> "$HOSTS_FILE"
fi
