## Local tenant domains

For local development, you can use school-style hostnames such as:

- `eskuwela.ph`
- `saa.eskuwela.ph`
- `gtwfsl.eskuwela.ph`
- `eskuwela.dev`
- `saa.eskuwela.dev`
- `gtwfsl.eskuwela.dev`

What you need locally:

1. Make the hostnames resolve to `127.0.0.1`.
2. Run the Vite dev server with host support enabled.
3. If you use `.dev`, serve over HTTPS because browsers require it for that TLD.

The app is already configured to accept `.eskuwela.dev` in Vite and to treat the apex domain as the public homepage.

Local setup commands:

```bash
npm run dev:setup
npm run dev:https
```

Valet-style local setup:

```bash
sh /Users/earl/eskuwela/multi-school-app/scripts/install-local-hosts.sh
npm run dev:valet
```

If you prefer to update `/etc/hosts` manually, add these lines:

```txt
127.0.0.1 eskuwela.ph
127.0.0.1 www.eskuwela.ph
127.0.0.1 saa.eskuwela.ph
127.0.0.1 gtwfsl.eskuwela.ph
127.0.0.1 admin.eskuwela.ph
127.0.0.1 eskuwela.dev
127.0.0.1 www.eskuwela.dev
127.0.0.1 saa.eskuwela.dev
127.0.0.1 gtwfsl.eskuwela.dev
127.0.0.1 admin.eskuwela.dev
```

The helper script creates a self-signed certificate under `.certs/`. If you want the browser to trust it without warnings, run the hosts installer script with admin approval:

```bash
sh scripts/install-local-hosts.sh
```

If you do not want to set up local DNS/HTTPS yet, you can still preview tenants with:

- `http://localhost:5173/?tenant=saa`
- `http://localhost:5173/?tenant=gtwfsl`
