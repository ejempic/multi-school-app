## Home server setup for `eskuwela.ph`

This project can be served from a home machine and published through Cloudflare Tunnel.

### Recommended architecture

- Cloudflare manages DNS and edge SSL for `eskuwela.ph`
- `cloudflared` runs on your home server and makes an outbound tunnel to Cloudflare
- The app itself runs locally on port `8090`
- Cloudflare Tunnel forwards public hostnames to `http://eskuwela-web:8080` inside Docker

This avoids opening inbound ports on your router and keeps your home IP hidden.

### One-time Cloudflare setup

Run the setup script:

```bash
node home-server/configure-cloudflare.mjs
```

It configures the existing `homeserver` Cloudflare Tunnel, writes `home-server/.env`,
and creates or updates these DNS records:

```txt
eskuwela.ph
www.eskuwela.ph
saa.eskuwela.ph
gtwfsl.eskuwela.ph
admin.eskuwela.ph
```

Each hostname routes through the tunnel to `http://eskuwela-web:8080`.

If Wrangler's OAuth token cannot write DNS records, create a Cloudflare API token
with `Zone:DNS:Edit` for `eskuwela.ph`, then rerun:

```bash
CLOUDFLARE_API_TOKEN=your-token node home-server/configure-cloudflare.mjs
```

### Start manually

From the repo root:

```bash
home-server/start-cloudflare-local.sh
```

This builds the Vite app, serves the `dist` output through Caddy, and exposes it locally on:

```txt
http://localhost:8090
```

### Start automatically when you open the laptop

Install the macOS LaunchAgent:

```bash
home-server/install-macos-launch-agent.sh
```

The LaunchAgent runs when you log in. Docker Desktop must also be set to start at login.

Logs are written to:

```txt
home-server/logs/launch-agent.out.log
home-server/logs/launch-agent.err.log
```

### Stop

```bash
home-server/stop-cloudflare-local.sh
```

### Notes

- The current app is frontend-only, so this setup serves the SPA correctly but does not yet provide a backend database or auth service.
- If you later add an API, you can either:
  - serve it from another local port and map a subdomain like `api.eskuwela.ph`, or
  - reverse-proxy both frontend and backend behind Caddy.
