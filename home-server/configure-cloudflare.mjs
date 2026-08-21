import fs from "fs";
import os from "os";
import path from "path";

const accountId = "d72b9879d049d30de0f5df219abc4696";
const tunnelId = "c320c975-676c-41cf-a56f-1c1a88d4ddaa";
const zoneName = "eskuwela.ph";
const hostnames = [
  "eskuwela.ph",
  "www.eskuwela.ph",
  "saa.eskuwela.ph",
  "gtwfsl.eskuwela.ph",
  "admin.eskuwela.ph",
];
const tunnelTarget = `${tunnelId}.cfargotunnel.com`;
const service = "http://eskuwela-web:8080";

const rootDir = path.resolve(import.meta.dirname, "..");
const envPath = path.join(rootDir, "home-server", ".env");
const wranglerConfigPath = path.join(
  os.homedir(),
  "Library",
  "Preferences",
  ".wrangler",
  "config",
  "default.toml"
);

function getWranglerOAuthToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN;
  }

  const config = fs.readFileSync(wranglerConfigPath, "utf8");
  const match = config.match(/^oauth_token\s*=\s*"([^"]+)"/m);
  if (!match) {
    throw new Error(
      `Could not find oauth_token in ${wranglerConfigPath}. Run: npx wrangler login, or set CLOUDFLARE_API_TOKEN.`
    );
  }
  return match[1];
}

async function cloudflare(method, apiPath, body) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${getWranglerOAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    const errors = payload.errors?.map((error) => error.message).join("; ") || response.statusText;
    throw new Error(`${method} ${apiPath} failed: ${errors}`);
  }
  return payload.result;
}

async function configureTunnel() {
  await cloudflare("PUT", `/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`, {
    config: {
      ingress: [
        ...hostnames.map((hostname) => ({
          hostname,
          service,
          originRequest: {},
        })),
        {
          service: "http_status:404",
        },
      ],
    },
  });
}

async function getTunnelToken() {
  return cloudflare("GET", `/accounts/${accountId}/cfd_tunnel/${tunnelId}/token`);
}

function writeEnv(tunnelToken) {
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const portMatch = existing.match(/^ESKUWELA_WEB_PORT=(.+)$/m);
  const port = portMatch?.[1] || "8090";
  fs.writeFileSync(envPath, `CLOUDFLARED_TOKEN=${tunnelToken}\nESKUWELA_WEB_PORT=${port}\n`);
}

async function getZoneId() {
  const params = new URLSearchParams({ name: zoneName });
  const zones = await cloudflare("GET", `/zones?${params}`);
  const zone = zones.find((candidate) => candidate.name === zoneName);
  if (!zone) {
    throw new Error(`Could not find Cloudflare zone ${zoneName}.`);
  }
  return zone.id;
}

async function upsertDnsRecord(zoneId, hostname) {
  const params = new URLSearchParams({
    name: hostname,
    type: "CNAME",
  });
  const existing = await cloudflare("GET", `/zones/${zoneId}/dns_records?${params}`);
  const body = {
    type: "CNAME",
    name: hostname,
    content: tunnelTarget,
    proxied: true,
    ttl: 1,
  };

  if (existing.length > 0) {
    await cloudflare("PUT", `/zones/${zoneId}/dns_records/${existing[0].id}`, body);
    return "updated";
  }

  await cloudflare("POST", `/zones/${zoneId}/dns_records`, body);
  return "created";
}

async function main() {
  console.log(`Configuring tunnel ${tunnelId} for ${zoneName}...`);
  await configureTunnel();
  console.log("Tunnel ingress configured.");

  const tunnelToken = await getTunnelToken();
  writeEnv(tunnelToken);
  console.log(`Wrote Cloudflare tunnel token to ${envPath}.`);

  const zoneId = await getZoneId();
  for (const hostname of hostnames) {
    const action = await upsertDnsRecord(zoneId, hostname);
    console.log(`${action}: ${hostname} -> ${tunnelTarget}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
