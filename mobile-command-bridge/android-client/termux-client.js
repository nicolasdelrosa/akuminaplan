#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { WebSocket } = require("ws");
const readline = require("readline");
const crypto = require("crypto");

const HISTORY_FILE = path.resolve(__dirname, "command-history.json");
const MAX_HISTORY_ITEMS = 100;

const PRESET_TASKS = {
  prepare: ["task.run", "browser.request.prepare"],
  watch: ["task.run", "browser.request.watch"],
  complete: ["task.run", "browser.request.complete"]
};

const PRESET_VSCODE = {
  chat: ["vscode.command", "workbench.action.chat.open"],
  ask: ["vscode.command", "workbench.action.chat.openAsk"],
  copilot: ["vscode.command", "github.copilot.chat.open"]
};

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    host: "127.0.0.1",
    port: 8787,
    token: "",
    onceAction: "",
    onceTarget: "",
    oncePrompt: ""
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--host") {
      out.host = args[i + 1];
      i += 1;
      continue;
    }

    if (arg === "--port") {
      out.port = Number(args[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--token") {
      out.token = args[i + 1];
      i += 1;
      continue;
    }

    if (arg === "--once") {
      out.onceAction = args[i + 1] || "";
      out.onceTarget = args[i + 2] || "";
      i += 2;
      continue;
    }

    if (arg === "--once-prompt") {
      out.oncePrompt = args[i + 1] || "";
      i += 1;
      continue;
    }
  }

  if (!out.token) {
    console.error("Missing --token. Example: node termux-client.js --host 192.168.1.42 --token <BRIDGE_TOKEN>");
    process.exit(1);
  }

  return out;
}

function generateRequestId() {
  return `req-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
}

function generateNonce() {
  return `nonce-${crypto.randomBytes(8).toString("hex")}`;
}

function printHelp() {
  console.log("\nCommands:");
  console.log("  help                              Show this help");
  console.log("  run <prepare|watch|complete>      Run task preset");
  console.log("  vc <chat|ask|copilot>             Run VS Code command preset");
  console.log("  exec <action> <target>            Run custom allowlisted action/target");
  console.log("  agent <name> <text...>            Dispatch prompt to agent (AutoHotkey path)");
  console.log("  draft <name> <text...>            Write prompt artifact without dispatch");
  console.log("  history [count]                   Show recent execute command history");
  console.log("  retry <index>                     Retry a history entry by index from history output");
  console.log("  last                              Retry most recent history entry");
  console.log("  cancel [requestId]                Cancel last request or specific requestId");
  console.log("  exit                              Quit");
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => isHistoryEntry(item));
  } catch {
    return [];
  }
}

function saveHistory(history) {
  const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), "utf8");
}

function isHistoryEntry(item) {
  if (!item || typeof item !== "object") {
    return false;
  }

  if (typeof item.action !== "string" || typeof item.target !== "string") {
    return false;
  }

  if (item.promptText !== undefined && typeof item.promptText !== "string") {
    return false;
  }

  return true;
}

function appendHistory(history, entry) {
  const normalized = {
    createdAt: new Date().toISOString(),
    action: entry.action,
    target: entry.target,
    promptText: entry.promptText || ""
  };

  history.unshift(normalized);
  saveHistory(history);
}

function printHistory(history, countInput) {
  const requestedCount = Number(countInput || 10);
  const count = Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 10;
  const shown = history.slice(0, count);

  if (shown.length === 0) {
    console.log("No history entries yet.");
    return;
  }

  console.log("Recent execute history:");
  for (let i = 0; i < shown.length; i += 1) {
    const item = shown[i];
    const suffix = item.promptText ? ` prompt=\"${item.promptText.slice(0, 80)}${item.promptText.length > 80 ? "..." : ""}\"` : "";
    console.log(`${i + 1}. ${item.action} ${item.target}${suffix} @ ${item.createdAt}`);
  }
}

function getHistoryEntry(history, oneBasedIndex) {
  const idx = Number(oneBasedIndex);
  if (!Number.isFinite(idx) || idx <= 0) {
    return null;
  }

  return history[idx - 1] || null;
}

function connect() {
  const opts = parseArgs();
  const url = `ws://${opts.host}:${opts.port}/ws`;
  const interactiveMode = !(opts.onceAction && opts.onceTarget);
  const history = loadHistory();
  let lastRequestId = null;
  let oneShotRequestId = null;
  const pendingPayloads = [];

  const ws = new WebSocket(url, {
    headers: {
      "x-bridge-token": opts.token
    }
  });

  ws.on("open", () => {
    console.log(`Connected to ${url}`);
    if (pendingPayloads.length > 0) {
      console.log(`Flushing ${pendingPayloads.length} queued command(s)`);
      for (const payload of pendingPayloads.splice(0)) {
        ws.send(JSON.stringify(payload));
        console.log(`> ${payload.type} ${payload.requestId || ""} ${payload.action || ""} ${payload.target || ""}`);
      }
    }

    if (opts.onceAction && opts.onceTarget) {
      const extra = opts.oncePrompt ? { promptText: opts.oncePrompt } : {};
      sendExecute(opts.onceAction, opts.onceTarget, extra);
      return;
    }

    printHelp();
    rl.prompt();
  });

  ws.on("message", (data) => {
    let event;
    try {
      event = JSON.parse(data.toString("utf8"));
    } catch {
      console.log(`< raw ${data.toString("utf8")}`);
      rl.prompt();
      return;
    }

    const type = event.type;
    if (type === "stream") {
      const chunk = event.chunk || "";
      process.stdout.write(`< [${event.requestId}] ${event.stream}: ${chunk}`);
      if (!chunk.endsWith("\n")) {
        process.stdout.write("\n");
      }
      if (interactiveMode) {
        rl.prompt();
      }
      return;
    }

    if (type === "ready") {
      console.log(`< ready version=${event.version}`);
      if (interactiveMode) {
        rl.prompt();
      }
      return;
    }

    if (type === "started") {
      console.log(`< started ${event.requestId} ${event.action} ${JSON.stringify(event.meta || {})}`);
      if (interactiveMode) {
        rl.prompt();
      }
      return;
    }

    if (type === "complete") {
      console.log(`< complete ${event.requestId} exitCode=${event.exitCode} signal=${event.signal}`);
      if (oneShotRequestId && event.requestId === oneShotRequestId) {
        ws.close();
        return;
      }
      if (interactiveMode) {
        rl.prompt();
      }
      return;
    }

    if (type === "error") {
      console.log(`< error requestId=${event.requestId || "-"} code=${event.code} message=${event.message}`);
      if (oneShotRequestId && event.requestId === oneShotRequestId) {
        ws.close();
        return;
      }
      if (interactiveMode) {
        rl.prompt();
      }
      return;
    }

    if (type === "cancelled") {
      console.log(`< cancelled ${event.requestId} cancelled=${event.cancelled}`);
      if (interactiveMode) {
        rl.prompt();
      }
      return;
    }

    console.log(`< ${JSON.stringify(event)}`);
    if (interactiveMode) {
      rl.prompt();
    }
  });

  ws.on("close", (code, reason) => {
    console.log(`Disconnected (${code}): ${String(reason || "")}`);
    process.exit(0);
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
  });

  function send(payload) {
    if (ws.readyState !== WebSocket.OPEN) {
      pendingPayloads.push(payload);
      console.log(`(queued) ${payload.type} ${payload.requestId || ""} ${payload.action || ""} ${payload.target || ""}`);
      return;
    }

    ws.send(JSON.stringify(payload));
    console.log(`> ${payload.type} ${payload.requestId || ""} ${payload.action || ""} ${payload.target || ""}`);
  }

  function sendExecute(action, target, extra = {}) {
    const payload = {
      type: "execute",
      requestId: generateRequestId(),
      action,
      target,
      timestamp: Date.now(),
      nonce: generateNonce(),
      ...extra
    };
    lastRequestId = payload.requestId;
    if (opts.onceAction && opts.onceTarget) {
      oneShotRequestId = payload.requestId;
    }
    appendHistory(history, {
      action,
      target,
      promptText: typeof extra.promptText === "string" ? extra.promptText : ""
    });
    send(payload);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "bridge> "
  });

  rl.on("line", (line) => {
    const raw = line.trim();
    if (!raw) {
      rl.prompt();
      return;
    }

    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    if (cmd === "help") {
      printHelp();
      rl.prompt();
      return;
    }

    if (cmd === "exit") {
      rl.close();
      ws.close();
      return;
    }

    if (cmd === "run" && parts[1]) {
      const preset = PRESET_TASKS[parts[1].toLowerCase()];
      if (!preset) {
        console.log("Unknown task preset");
        rl.prompt();
        return;
      }
      sendExecute(preset[0], preset[1]);
      rl.prompt();
      return;
    }

    if (cmd === "vc" && parts[1]) {
      const preset = PRESET_VSCODE[parts[1].toLowerCase()];
      if (!preset) {
        console.log("Unknown VS Code preset");
        rl.prompt();
        return;
      }
      sendExecute(preset[0], preset[1]);
      rl.prompt();
      return;
    }

    if (cmd === "exec" && parts.length === 3) {
      sendExecute(parts[1], parts[2]);
      rl.prompt();
      return;
    }

    if (cmd === "agent" && parts.length >= 3) {
      const target = parts[1].toLowerCase();
      const promptText = parts.slice(2).join(" ");
      sendExecute("prompt.dispatch", target, { promptText });
      rl.prompt();
      return;
    }

    if (cmd === "draft" && parts.length >= 3) {
      const target = parts[1].toLowerCase();
      const promptText = parts.slice(2).join(" ");
      sendExecute("prompt.write", target, { promptText });
      rl.prompt();
      return;
    }

    if (cmd === "cancel") {
      const requestId = parts[1] || lastRequestId;
      if (!requestId) {
        console.log("No requestId available to cancel");
        rl.prompt();
        return;
      }
      send({
        type: "cancel",
        requestId
      });
      rl.prompt();
      return;
    }

    if (cmd === "history") {
      printHistory(history, parts[1]);
      rl.prompt();
      return;
    }

    if (cmd === "retry") {
      const entry = getHistoryEntry(history, parts[1]);
      if (!entry) {
        console.log("Invalid history index. Use: history");
        rl.prompt();
        return;
      }
      const extra = entry.promptText ? { promptText: entry.promptText } : {};
      sendExecute(entry.action, entry.target, extra);
      rl.prompt();
      return;
    }

    if (cmd === "last") {
      const entry = history[0];
      if (!entry) {
        console.log("No history entries yet.");
        rl.prompt();
        return;
      }
      const extra = entry.promptText ? { promptText: entry.promptText } : {};
      sendExecute(entry.action, entry.target, extra);
      rl.prompt();
      return;
    }

    console.log("Unknown command. Type 'help'.");
    rl.prompt();
  });
}

connect();
