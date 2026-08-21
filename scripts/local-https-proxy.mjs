import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
};

const host = getArg("host", "127.0.0.1");
const port = Number(getArg("port", "443"));
const targetHost = getArg("target-host", "127.0.0.1");
const targetPort = Number(getArg("target-port", "5173"));
const certDir = path.resolve(__dirname, "../.certs");
const caCertPath = path.join(certDir, "eskuwela-ca.crt");
const keyPath = path.join(certDir, "eskuwela-dev.key");
const certPath = path.join(certDir, "eskuwela-dev.crt");

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error("Missing local HTTPS certificate. Run: npm run dev:setup");
  process.exit(1);
}

const proxy = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  (req, res) => {
    const upstream = https.request(
      {
        hostname: targetHost,
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: req.headers.host || `eskuwela.ph`,
        },
        ca: fs.existsSync(caCertPath) ? fs.readFileSync(caCertPath) : undefined,
      },
      (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
        upstreamRes.pipe(res);
      }
    );

    upstream.on("error", (error) => {
      console.error("Proxy request failed:", error.message);
      if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "text/plain" });
      }
      res.end("Bad gateway");
    });

    req.pipe(upstream);
  }
);

proxy.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

proxy.listen(port, host, () => {
  console.log(`Local HTTPS proxy listening on https://eskuwela.ph${port === 443 ? "" : `:${port}`}`);
  console.log(`Forwarding to https://${targetHost}:${targetPort}`);
});
