.PHONY: help dev live stop logs build cf-config launch-agent

help:
	@echo "Eskuwela commands:"
	@echo "  make dev          Start local HTTPS Vite dev server"
	@echo "  make live         Build/start Docker app and Cloudflare Tunnel"
	@echo "  make stop         Stop Docker app and Cloudflare Tunnel"
	@echo "  make logs         Follow Docker logs"
	@echo "  make build        Run production build locally"
	@echo "  make cf-config    Configure Cloudflare tunnel/DNS from CLI"
	@echo "  make launch-agent Install macOS auto-start LaunchAgent"

dev:
	npm run dev:https

live:
	home-server/start-cloudflare-local.sh

stop:
	home-server/stop-cloudflare-local.sh

logs:
	docker compose --env-file home-server/.env -f home-server/docker-compose.yml logs -f

build:
	npm run build

cf-config:
	node home-server/configure-cloudflare.mjs

launch-agent:
	home-server/install-macos-launch-agent.sh
