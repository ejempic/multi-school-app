import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const certDir = path.join(rootDir, ".certs");
const caKeyFile = path.join(certDir, "eskuwela-ca.key");
const caCertFile = path.join(certDir, "eskuwela-ca.crt");
const keyFile = path.join(certDir, "eskuwela-dev.key");
const certFile = path.join(certDir, "eskuwela-dev.crt");
const csrFile = path.join(certDir, "eskuwela-dev.csr");
const caSerialFile = path.join(certDir, "eskuwela-ca.srl");
const caConfig = path.join(certDir, "eskuwela-ca.cnf");
const serverConfig = path.join(certDir, "eskuwela-dev.cnf");

const caConfigContents = `[req]
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
`;

const serverConfigContents = `[req]
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
IP.1 = 127.0.0.1
DNS.4 = eskuwela.ph
DNS.5 = *.eskuwela.ph
`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.stdio || "pipe",
    windowsHide: true,
  });

  if (result.status !== 0) {
    const details = result.stderr?.toString().trim() || result.stdout?.toString().trim();
    throw new Error(`${command} ${args.join(" ")} failed${details ? `\n${details}` : ""}`);
  }

  return result;
}

function commandExists(command, args = ["--version"]) {
  const result = spawnSync(command, args, {
    stdio: "ignore",
    windowsHide: true,
  });

  return result.status === 0;
}

function bestEffortTrustCa() {
  if (process.platform === "darwin" && commandExists("security", ["-h"])) {
    const keychain = path.join(os.homedir(), "Library/Keychains/login.keychain-db");
    spawnSync(
      "security",
      ["add-trusted-cert", "-d", "-r", "trustRoot", "-k", keychain, caCertFile],
      { stdio: "ignore", windowsHide: true }
    );
    return;
  }

  if (process.platform === "win32" && commandExists("certutil", ["-?"])) {
    spawnSync("certutil", ["-user", "-addstore", "Root", caCertFile], {
      stdio: "ignore",
      windowsHide: true,
    });
  }
}

if (!commandExists("openssl", ["version"])) {
  console.warn("OpenSSL was not found. Starting Vite without a local HTTPS certificate.");
  console.warn("Install OpenSSL and rerun npm run dev:setup if you need https://eskuwela.ph locally.");
  process.exit(0);
}

fs.mkdirSync(certDir, { recursive: true });
fs.writeFileSync(caConfig, caConfigContents);
fs.writeFileSync(serverConfig, serverConfigContents);

if (!fs.existsSync(caKeyFile) || !fs.existsSync(caCertFile)) {
  run("openssl", [
    "req",
    "-x509",
    "-nodes",
    "-days",
    "3650",
    "-newkey",
    "rsa:4096",
    "-keyout",
    caKeyFile,
    "-out",
    caCertFile,
    "-config",
    caConfig,
  ]);
}

run("openssl", [
  "req",
  "-nodes",
  "-newkey",
  "rsa:2048",
  "-keyout",
  keyFile,
  "-out",
  csrFile,
  "-config",
  serverConfig,
]);

const serialArgs = fs.existsSync(caSerialFile) ? [] : ["-CAcreateserial"];

run("openssl", [
  "x509",
  "-req",
  "-days",
  "825",
  "-in",
  csrFile,
  "-CA",
  caCertFile,
  "-CAkey",
  caKeyFile,
  ...serialArgs,
  "-out",
  certFile,
  "-extensions",
  "v3_req",
  "-extfile",
  serverConfig,
]);

bestEffortTrustCa();

console.log("Created local HTTPS certificate:");
console.log(`  ${caCertFile}`);
console.log(`  ${certFile}`);
console.log(`  ${keyFile}`);
console.log("");
console.log("Next:");
console.log("  1. Make these hostnames resolve to 127.0.0.1 if you want tenant domains:");
console.log("     eskuwela.ph www.eskuwela.ph saa.eskuwela.ph gtwfsl.eskuwela.ph admin.eskuwela.ph");
console.log("     eskuwela.dev www.eskuwela.dev saa.eskuwela.dev gtwfsl.eskuwela.dev admin.eskuwela.dev");
console.log("  2. Run: npm run dev:https");
