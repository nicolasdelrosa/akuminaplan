const fs = require("fs");
const path = require("path");

function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex <= 0) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const rootDir = path.resolve(__dirname, "..");
loadDotEnv(path.join(rootDir, ".env"));

const config = {
  rootDir,
  workspaceRoot: path.resolve(rootDir, ".."),
  host: process.env.BRIDGE_HOST || "0.0.0.0",
  port: Number(process.env.BRIDGE_PORT || 8787),
  token: process.env.BRIDGE_TOKEN || "",
  requestTtlMs: Number(process.env.BRIDGE_REQUEST_TTL_MS || 120000),
  logDir: path.resolve(rootDir, process.env.BRIDGE_LOG_DIR || "runtime-logs"),
  allowedClientIps: parseCsv(process.env.BRIDGE_ALLOWED_CLIENT_IPS || ""),
  requireTailscale: toBoolean(process.env.BRIDGE_REQUIRE_TAILSCALE || "false"),
  maxActiveConnections: Number(process.env.BRIDGE_MAX_ACTIVE_CONNECTIONS || 5),
  maxPayloadBytes: Number(process.env.BRIDGE_MAX_PAYLOAD_BYTES || 65536),
  maxPromptChars: Number(process.env.BRIDGE_MAX_PROMPT_CHARS || 4000)
};

if (!config.token) {
  throw new Error("Missing BRIDGE_TOKEN. Set it in mobile-command-bridge/.env");
}

module.exports = {
  config
};

function parseCsv(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBoolean(value) {
  return String(value).toLowerCase() === "true";
}
