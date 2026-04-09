const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");
const { WebSocketServer } = require("ws");

const { config } = require("./config");
const { ALLOWED_VSCODE_COMMANDS, resolvePromptTarget, resolveTask } = require("./allowlist");
const { ProcessRegistry } = require("./processRegistry");

const processRegistry = new ProcessRegistry();
const recentNonces = new Map();
const activeSockets = new Set();
const promptArtifactDir = path.join(config.logDir, "prompt-artifacts");
const copilotReplyTimeoutMs = 120000;
const copilotReplyPollIntervalMs = 2500;
const assistantChunkSize = 120;
const assistantChunkDelayMs = 80;

ensureLogDir();
ensureDirectory(promptArtifactDir);
const eventLogPath = path.join(config.logDir, "bridge-events.jsonl");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    const body = JSON.stringify({ status: "ok", timestamp: Date.now() });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(body);
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

const wsServer = new WebSocketServer({
  server,
  path: "/ws",
  maxPayload: config.maxPayloadBytes
});

wsServer.on("connection", (socket, request) => {
  if (activeSockets.size >= config.maxActiveConnections) {
    socket.send(JSON.stringify({ type: "error", code: "server_busy", message: "Too many active connections" }));
    socket.close(1013, "Too many active connections");
    return;
  }

  const auth = authenticateSocket(request);
  if (!auth.ok) {
    socket.send(JSON.stringify({ type: "error", code: auth.code, message: auth.message }));
    socket.close(1008, auth.message);
    return;
  }

  activeSockets.add(socket);

  send(socket, {
    type: "ready",
    serverTime: Date.now(),
    version: "0.1.0"
  });

  socket.on("close", () => {
    activeSockets.delete(socket);
  });

  socket.on("message", async (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString("utf8"));
    } catch {
      send(socket, { type: "error", code: "bad_json", message: "Invalid JSON payload" });
      return;
    }

    await handleMessage(socket, message);
  });
});

server.listen(config.port, config.host, () => {
  console.log(`Mobile command bridge listening on ws://${config.host}:${config.port}/ws`);
  if (config.insecureNoAuth) {
    console.log("Insecure mode enabled: token authentication is disabled");
  } else {
    console.log("Use BRIDGE_TOKEN from .env in the x-bridge-token header");
  }
  console.log(`Active connection limit: ${config.maxActiveConnections}`);
  if (config.requireTailscale) {
    console.log("Tailscale-only mode is enabled");
  }
  if (config.allowedClientIps.length > 0) {
    console.log(`Allowed client IPs: ${config.allowedClientIps.join(", ")}`);
  }
});

async function handleMessage(socket, message) {
  if (!message || typeof message !== "object") {
    send(socket, { type: "error", code: "bad_payload", message: "Message must be an object" });
    return;
  }

  if (message.type === "execute") {
    await executeCommand(socket, message);
    return;
  }

  if (message.type === "cancel") {
    cancelCommand(socket, message);
    return;
  }

  send(socket, { type: "error", code: "unsupported_type", message: "Unsupported message type" });
}

async function executeCommand(socket, message) {
  const { requestId, action, timestamp, nonce } = message;

  if (!requestId || !action) {
    send(socket, {
      type: "error",
      code: "validation_failed",
      message: "requestId and action are required"
    });
    return;
  }

  const replayCheck = validateReplay(timestamp, nonce);
  if (!replayCheck.ok) {
    send(socket, { type: "error", requestId, code: replayCheck.code, message: replayCheck.message });
    return;
  }

  if (processRegistry.has(requestId)) {
    send(socket, {
      type: "error",
      requestId,
      code: "request_in_progress",
      message: "A command with this requestId is already running"
    });
    return;
  }

  try {
    if (action === "task.run") {
      await runAllowlistedTask(socket, message);
      return;
    }

    if (action === "vscode.command") {
      await runAllowlistedCodeCommand(socket, message);
      return;
    }

    if (action === "prompt.write") {
      runPromptWrite(socket, message);
      return;
    }

    if (action === "prompt.dispatch") {
      await runPromptDispatch(socket, message);
      return;
    }

    send(socket, {
      type: "error",
      requestId,
      code: "action_blocked",
      message: "Action is not allowed"
    });
  } catch (error) {
    const text = error instanceof Error ? error.message : "Unexpected error";
    send(socket, { type: "error", requestId, code: "execute_failed", message: text });
    writeEvent({ level: "error", requestId, action, message: text });
  }
}

function cancelCommand(socket, message) {
  const { requestId } = message;
  if (!requestId) {
    send(socket, { type: "error", code: "validation_failed", message: "requestId is required" });
    return;
  }

  const cancelled = processRegistry.kill(requestId);
  send(socket, {
    type: "cancelled",
    requestId,
    cancelled
  });
}

async function runAllowlistedTask(socket, message) {
  const { requestId, target } = message;
  const task = resolveTask(target, config.workspaceRoot);
  if (!task) {
    send(socket, {
      type: "error",
      requestId,
      code: "target_blocked",
      message: `Task target is not allowlisted: ${target}`
    });
    return;
  }

  spawnAndStream(socket, {
    requestId,
    action: "task.run",
    command: task.command,
    args: task.args,
    cwd: task.cwd,
    meta: { target }
  });
}

async function runAllowlistedCodeCommand(socket, message) {
  const { requestId, target } = message;
  if (!ALLOWED_VSCODE_COMMANDS.has(target)) {
    send(socket, {
      type: "error",
      requestId,
      code: "target_blocked",
      message: `VS Code command is not allowlisted: ${target}`
    });
    return;
  }

  const codeCli = resolveCodeCliCommand();

  spawnAndStream(socket, {
    requestId,
    action: "vscode.command",
    command: codeCli,
    args: ["--command", target],
    cwd: config.workspaceRoot,
    shell: process.platform === "win32",
    meta: { target }
  });
}

function resolveCodeCliCommand() {
  if (process.platform === "win32") {
    return "code.cmd";
  }

  return "code";
}

function runPromptWrite(socket, message) {
  const { requestId, target, promptText } = message;
  const prompt = createPromptArtifact(requestId, target, promptText);
  if (!prompt.ok) {
    send(socket, {
      type: "error",
      requestId,
      code: prompt.code,
      message: prompt.message
    });
    return;
  }

  send(socket, {
    type: "started",
    requestId,
    action: "prompt.write",
    timestamp: Date.now(),
    meta: {
      target: prompt.target,
      agent: prompt.agent,
      promptPath: prompt.path
    }
  });

  send(socket, {
    type: "complete",
    requestId,
    exitCode: 0,
    signal: null,
    timestamp: Date.now(),
    meta: {
      promptPath: prompt.path
    }
  });

  writeEvent({
    level: "info",
    requestId,
    action: "prompt.write",
    event: "complete",
    promptPath: prompt.path,
    target: prompt.target,
    agent: prompt.agent
  });
}

async function runPromptDispatch(socket, message) {
  const { requestId } = message;
  const prompt = createPromptArtifact(requestId, message.target, message.promptText);
  if (!prompt.ok) {
    send(socket, {
      type: "error",
      requestId,
      code: prompt.code,
      message: prompt.message
    });
    return;
  }

  const dispatcherScriptAhk = path.resolve(
    config.workspaceRoot,
    "tools",
    "browser-request-automation",
    "send-to-copilot.ahk"
  );
  const dispatcherScriptPs1 = path.resolve(
    config.workspaceRoot,
    "tools",
    "browser-request-automation",
    "send-to-copilot.ps1"
  );

  let dispatcherScript = null;
  let dispatcherCommand = null;
  let dispatcherArgs = null;

  // Try AutoHotkey first if available
  const autoHotkeyCommand = resolveAutoHotkeyCommand();
  if (autoHotkeyCommand && fs.existsSync(dispatcherScriptAhk)) {
    dispatcherScript = dispatcherScriptAhk;
    dispatcherCommand = autoHotkeyCommand;
    dispatcherArgs = [dispatcherScriptAhk, prompt.path];
  }
  // Fall back to PowerShell
  else if (fs.existsSync(dispatcherScriptPs1)) {
    dispatcherScript = dispatcherScriptPs1;
    dispatcherCommand = "pwsh.exe";
    dispatcherArgs = ["-NoProfile", "-Command", `& '${dispatcherScriptPs1}' -PromptArtifactPath '${prompt.path}'`];
  }

  if (!dispatcherScript) {
    send(socket, {
      type: "error",
      requestId,
      code: "dispatcher_missing",
      message: "No dispatcher script found (neither AutoHotkey nor PowerShell version available)"
    });
    return;
  }

  spawnAndStream(socket, {
    requestId,
    action: "prompt.dispatch",
    command: dispatcherCommand,
    args: dispatcherArgs,
    cwd: config.workspaceRoot,
    shell: false,
    meta: {
      target: prompt.target,
      agent: prompt.agent,
      promptPath: prompt.path
    },
    onComplete: ({ code }) => {
      if (code === 0) {
        watchForCopilotReply(socket, {
          requestId,
          promptBody: prompt.promptBody,
          dispatchedAt: Date.now()
        });
      }
    }
  });
}

function createPromptArtifact(requestId, target, promptText) {
  const resolvedTarget = resolvePromptTarget(target);
  if (!resolvedTarget) {
    return {
      ok: false,
      code: "target_blocked",
      message: `Prompt target is not allowlisted: ${target || "(empty)"}`
    };
  }

  if (typeof promptText !== "string") {
    return {
      ok: false,
      code: "prompt_required",
      message: "promptText is required for prompt actions"
    };
  }

  const cleanedPromptText = sanitizePromptText(promptText);
  if (!cleanedPromptText) {
    return {
      ok: false,
      code: "prompt_required",
      message: "promptText must contain non-whitespace content"
    };
  }

  if (cleanedPromptText.length > config.maxPromptChars) {
    return {
      ok: false,
      code: "prompt_too_long",
      message: `promptText exceeds max length of ${config.maxPromptChars} characters`
    };
  }

  const promptBody = `@${resolvedTarget.agentName} ${cleanedPromptText}`;
  const filePath = path.join(promptArtifactDir, `${requestId}.prompt.txt`);
  fs.writeFileSync(filePath, promptBody, "utf8");

  return {
    ok: true,
    path: filePath,
    promptBody,
    target: resolvedTarget.key,
    agent: resolvedTarget.agentName
  };
}

function sanitizePromptText(input) {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function resolveAutoHotkeyCommand() {
  const candidates = [
    "AutoHotkey64.exe",
    "AutoHotkey.exe",
    "C:\\Program Files\\AutoHotkey\\v2\\AutoHotkey64.exe",
    "C:\\Program Files\\AutoHotkey\\v2\\AutoHotkey.exe"
  ];

  for (const candidate of candidates) {
    if (candidate.includes("\\")) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
      continue;
    }

    const commandPath = findCommandInPath(candidate);
    if (commandPath) {
      return commandPath;
    }
  }

  return null;
}

function findCommandInPath(commandName) {
  const pathValue = process.env.PATH || "";
  const parts = pathValue.split(path.delimiter).filter(Boolean);

  for (const part of parts) {
    const candidate = path.join(part, commandName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function spawnAndStream(socket, options) {
  const { requestId, action, command, args, cwd, shell = false, meta, onComplete } = options;

  send(socket, {
    type: "started",
    requestId,
    action,
    command,
    args,
    cwd,
    timestamp: Date.now(),
    meta
  });

  writeEvent({
    level: "info",
    requestId,
    action,
    event: "started",
    command,
    args,
    cwd,
    meta
  });

  const child = spawn(command, args, {
    cwd,
    shell,
    stdio: ["ignore", "pipe", "pipe"]
  });

  processRegistry.set(requestId, child);

  child.stdout.on("data", (chunk) => {
    const text = chunk.toString("utf8");
    send(socket, { type: "stream", requestId, stream: "stdout", chunk: text });
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString("utf8");
    send(socket, { type: "stream", requestId, stream: "stderr", chunk: text });
  });

  child.on("close", (code, signal) => {
    processRegistry.delete(requestId);
    send(socket, {
      type: "complete",
      requestId,
      exitCode: code,
      signal: signal || null,
      timestamp: Date.now()
    });

    writeEvent({
      level: "info",
      requestId,
      action,
      event: "complete",
      exitCode: code,
      signal: signal || null
    });

    if (typeof onComplete === "function") {
      onComplete({ code, signal: signal || null });
    }
  });

  child.on("error", (error) => {
    processRegistry.delete(requestId);
    const message = error instanceof Error ? error.message : "Process failed";
    send(socket, {
      type: "error",
      requestId,
      code: "process_error",
      message
    });

    writeEvent({
      level: "error",
      requestId,
      action,
      event: "process_error",
      message
    });
  });
}

function watchForCopilotReply(socket, options) {
  const { requestId, promptBody, dispatchedAt } = options;
  const watchStartedAt = Date.now();

  send(socket, {
    type: "assistant_reply_waiting",
    requestId,
    message: "Waiting for Copilot response...",
    timestamp: Date.now()
  });

  const poll = () => {
    if (socket.readyState !== socket.OPEN) {
      return;
    }

    const found = findCopilotReply({ promptBody, minTimestamp: dispatchedAt - 10000 });
    if (found) {
      streamAssistantReply(socket, {
        requestId,
        text: found.text,
        meta: {
          sid: found.sid,
          userTs: found.userTs,
          replyTs: found.replyTs
        }
      });
      return;
    }

    if (Date.now() - watchStartedAt >= copilotReplyTimeoutMs) {
      send(socket, {
        type: "assistant_reply_timeout",
        requestId,
        message: "No Copilot response found within timeout window",
        timestamp: Date.now()
      });
      return;
    }

    setTimeout(poll, copilotReplyPollIntervalMs);
  };

  setTimeout(poll, copilotReplyPollIntervalMs);
}

function streamAssistantReply(socket, options) {
  const { requestId, text, meta } = options;
  const normalized = String(text || "");

  if (!normalized.trim()) {
    send(socket, {
      type: "assistant_reply_timeout",
      requestId,
      message: "Assistant response was empty",
      timestamp: Date.now()
    });
    return;
  }

  const chunks = [];
  for (let i = 0; i < normalized.length; i += assistantChunkSize) {
    chunks.push(normalized.slice(i, i + assistantChunkSize));
  }

  let index = 0;
  const pump = () => {
    if (socket.readyState !== socket.OPEN) {
      return;
    }

    if (index >= chunks.length) {
      send(socket, {
        type: "assistant_reply_done",
        requestId,
        timestamp: Date.now(),
        meta
      });
      return;
    }

    const chunk = chunks[index];
    index += 1;

    send(socket, {
      type: "assistant_reply_chunk",
      requestId,
      chunk,
      index,
      total: chunks.length,
      timestamp: Date.now(),
      meta
    });

    if (index >= chunks.length) {
      send(socket, {
        type: "assistant_reply",
        requestId,
        text: normalized,
        timestamp: Date.now(),
        meta
      });
      send(socket, {
        type: "assistant_reply_done",
        requestId,
        timestamp: Date.now(),
        meta
      });
      return;
    }

    setTimeout(pump, assistantChunkDelayMs);
  };

  pump();
}

function findCopilotReply(options) {
  const { promptBody, minTimestamp } = options;
  const logFiles = discoverCopilotMainLogs();
  for (const filePath of logFiles) {
    const result = scanCopilotMainLog(filePath, promptBody, minTimestamp);
    if (result) {
      return result;
    }
  }

  return null;
}

function discoverCopilotMainLogs() {
  const appData = process.env.APPDATA;
  if (!appData) {
    return [];
  }

  const root = path.join(appData, "Code", "User", "workspaceStorage");
  if (!fs.existsSync(root)) {
    return [];
  }

  const mainLogFiles = [];
  const workspaceEntries = safeReadDir(root, { withFileTypes: true });
  for (const entry of workspaceEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const mainLogPath = path.join(
      root,
      entry.name,
      "GitHub.copilot-chat",
      "debug-logs"
    );

    if (!fs.existsSync(mainLogPath)) {
      continue;
    }

    const sessions = safeReadDir(mainLogPath, { withFileTypes: true });
    for (const sessionEntry of sessions) {
      if (!sessionEntry.isDirectory()) {
        continue;
      }

      const filePath = path.join(mainLogPath, sessionEntry.name, "main.jsonl");
      if (!fs.existsSync(filePath)) {
        continue;
      }

      let mtimeMs = 0;
      try {
        mtimeMs = fs.statSync(filePath).mtimeMs;
      } catch {
        mtimeMs = 0;
      }

      mainLogFiles.push({ filePath, mtimeMs });
    }
  }

  return mainLogFiles
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 8)
    .map((item) => item.filePath);
}

function scanCopilotMainLog(filePath, promptBody, minTimestamp) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }

  if (!raw.trim()) {
    return null;
  }

  const lines = raw.split(/\r?\n/).filter(Boolean);
  const events = [];
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === "object") {
        events.push(parsed);
      }
    } catch {
      // ignore bad line
    }
  }

  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event = events[i];
    if (event.type !== "user_message") {
      continue;
    }

    const content = event.attrs && typeof event.attrs.content === "string" ? event.attrs.content.trim() : "";
    if (content !== promptBody) {
      continue;
    }

    const userTs = Number(event.ts || 0);
    if (!Number.isFinite(userTs) || userTs < minTimestamp) {
      continue;
    }

    const userSpanId = event.spanId;
    if (!userSpanId) {
      continue;
    }

    for (let j = i + 1; j < events.length; j += 1) {
      const nextEvent = events[j];
      if (nextEvent.type !== "agent_response") {
        continue;
      }

      if (nextEvent.parentSpanId !== userSpanId) {
        continue;
      }

      const responseRaw = nextEvent.attrs && typeof nextEvent.attrs.response === "string"
        ? nextEvent.attrs.response
        : "";
      const text = extractAssistantText(responseRaw);
      if (!text) {
        continue;
      }

      return {
        text,
        sid: nextEvent.sid || null,
        userTs,
        replyTs: Number(nextEvent.ts || 0)
      };
    }
  }

  return null;
}

function extractAssistantText(responseRaw) {
  if (!responseRaw) {
    return "";
  }

  try {
    const parsed = JSON.parse(responseRaw);
    if (!Array.isArray(parsed)) {
      return String(responseRaw).trim();
    }

    const chunks = [];
    for (const msg of parsed) {
      if (!msg || !Array.isArray(msg.parts)) {
        continue;
      }

      for (const part of msg.parts) {
        if (part && part.type === "text" && typeof part.content === "string") {
          chunks.push(part.content.trim());
        }
      }
    }

    return chunks.filter(Boolean).join("\n\n").trim();
  } catch {
    return String(responseRaw).trim();
  }
}

function safeReadDir(directoryPath, options) {
  try {
    return fs.readdirSync(directoryPath, options);
  } catch {
    return [];
  }
}

function authenticateSocket(request) {
  const remoteAddress = normalizeRemoteAddress(request.socket.remoteAddress || "");

  if (config.requireTailscale && !isTailscaleAddress(remoteAddress)) {
    return {
      ok: false,
      code: "network_restricted",
      message: "Connection blocked: Tailscale address required"
    };
  }

  if (config.allowedClientIps.length > 0 && !config.allowedClientIps.includes(remoteAddress)) {
    return {
      ok: false,
      code: "ip_not_allowed",
      message: `Connection blocked for IP: ${remoteAddress}`
    };
  }

  if (!config.insecureNoAuth) {
    const token = request.headers["x-bridge-token"];
    if (!token || token !== config.token) {
      return {
        ok: false,
        code: "unauthorized",
        message: "Missing or invalid x-bridge-token"
      };
    }
  }

  return { ok: true };
}

function normalizeRemoteAddress(address) {
  if (!address) {
    return "";
  }

  if (address.startsWith("::ffff:")) {
    return address.slice(7);
  }

  return address;
}

function isTailscaleAddress(address) {
  if (!address) {
    return false;
  }

  if (address === "127.0.0.1" || address === "::1") {
    return true;
  }

  if (address.startsWith("100.")) {
    return true;
  }

  if (address.toLowerCase().startsWith("fd7a:115c:a1e0:")) {
    return true;
  }

  return false;
}

function validateReplay(timestamp, nonce) {
  if (!Number.isFinite(timestamp)) {
    return { ok: false, code: "timestamp_required", message: "timestamp must be a number" };
  }

  if (!nonce || typeof nonce !== "string" || nonce.length < 8) {
    return { ok: false, code: "nonce_required", message: "nonce must be a string of length >= 8" };
  }

  const ageMs = Math.abs(Date.now() - timestamp);
  if (ageMs > config.requestTtlMs) {
    return {
      ok: false,
      code: "request_expired",
      message: `Request timestamp is outside TTL window: ${config.requestTtlMs}ms`
    };
  }

  if (recentNonces.has(nonce)) {
    return { ok: false, code: "replay_detected", message: "Nonce already used" };
  }

  recentNonces.set(nonce, Date.now());
  cleanupExpiredNonces();

  return { ok: true };
}

function cleanupExpiredNonces() {
  const cutoff = Date.now() - config.requestTtlMs;
  for (const [nonce, createdAt] of recentNonces.entries()) {
    if (createdAt < cutoff) {
      recentNonces.delete(nonce);
    }
  }
}

function send(socket, payload) {
  if (socket.readyState !== socket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(payload));
}

function ensureLogDir() {
  if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir, { recursive: true });
  }
}

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function writeEvent(event) {
  const line = JSON.stringify({ timestamp: Date.now(), ...event });
  fs.appendFile(eventLogPath, `${line}\n`, () => {
    // best effort logging
  });
}
