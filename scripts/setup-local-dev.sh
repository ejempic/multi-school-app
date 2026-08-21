#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="$ROOT_DIR/.certs"
CA_KEY_FILE="$CERT_DIR/eskuwela-ca.key"
CA_CERT_FILE="$CERT_DIR/eskuwela-ca.crt"
KEY_FILE="$CERT_DIR/eskuwela-dev.key"
CERT_FILE="$CERT_DIR/eskuwela-dev.crt"
CA_CONFIG="$CERT_DIR/eskuwela-ca.cnf"
SERVER_CONFIG="$CERT_DIR/eskuwela-dev.cnf"

mkdir -p "$CERT_DIR"

cat > "$CA_CONFIG" <<'EOF'
[req]
default_bits = 4096
prompt = no
default_md = sha256
distinguished_name = req_distinguished_name
x509_extensions = v3_ca

[req_distinguished_name]
C = PH
ST = Albay
L = Legazpi
O = Eskuwela Local CA
CN = Eskuwela Local CA

[v3_ca]
basicConstraints = critical,CA:TRUE
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
EOF

cat > "$SERVER_CONFIG" <<'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
C = PH
ST = Albay
L = Legazpi
O = Eskuwela
CN = eskuwela.ph

[v3_req]
subjectAltName = @alt_names
basicConstraints = critical,CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = eskuwela.dev
DNS.2 = *.eskuwela.dev
DNS.3 = localhost
DNS.4 = 127.0.0.1
DNS.5 = eskuwela.ph
DNS.6 = *.eskuwela.ph
EOF

if [ ! -f "$CA_KEY_FILE" ] || [ ! -f "$CA_CERT_FILE" ]; then
  openssl req -x509 -nodes -days 3650 \
    -newkey rsa:4096 \
    -keyout "$CA_KEY_FILE" \
    -out "$CA_CERT_FILE" \
    -config "$CA_CONFIG" \
    >/dev/null 2>&1
fi

openssl req -nodes -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CERT_DIR/eskuwela-dev.csr" \
  -config "$SERVER_CONFIG" \
  >/dev/null 2>&1

openssl x509 -req -days 825 \
  -in "$CERT_DIR/eskuwela-dev.csr" \
  -CA "$CA_CERT_FILE" \
  -CAkey "$CA_KEY_FILE" \
  -CAcreateserial \
  -out "$CERT_FILE" \
  -extensions v3_req \
  -extfile "$SERVER_CONFIG" \
  >/dev/null 2>&1

security add-trusted-cert -d -r trustRoot -k "$HOME/Library/Keychains/login.keychain-db" "$CA_CERT_FILE" >/dev/null 2>&1 || true

echo "Created local HTTPS certificate:"
echo "  $CA_CERT_FILE"
echo "  $CERT_FILE"
echo "  $KEY_FILE"
echo ""
echo "Next:"
echo "  1. Add these hostnames to /etc/hosts so they resolve to 127.0.0.1:"
echo "     127.0.0.1 eskuwela.ph"
echo "     127.0.0.1 www.eskuwela.ph"
echo "     127.0.0.1 saa.eskuwela.ph"
echo "     127.0.0.1 gtwfsl.eskuwela.ph"
echo "     127.0.0.1 admin.eskuwela.ph"
echo "     127.0.0.1 eskuwela.dev"
echo "     127.0.0.1 www.eskuwela.dev"
echo "     127.0.0.1 saa.eskuwela.dev"
echo "     127.0.0.1 gtwfsl.eskuwela.dev"
echo "     127.0.0.1 admin.eskuwela.dev"
echo "  2. Run: npm run dev:https"
echo ""
echo "The CA is trusted in your login keychain. Restart Chrome if it was already open."
