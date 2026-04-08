const path = require("path");

const ALLOWED_VSCODE_COMMANDS = new Set([
  "workbench.action.chat.open",
  "workbench.action.chat.openAsk",
  "github.copilot.chat.open"
]);

const ALLOWED_PROMPT_TARGETS = {
  ren: "Ren",
  scott: "Scott",
  andrew: "Andrew",
  jason: "Jason",
  udai: "Udai",
  theri: "Theri",
  luke: "Luke"
};

const ALLOWED_TASKS = {
  "browser.request.prepare": {
    command: "node",
    args: ["scripts/tasks/browser-request-watcher.js", "scan"],
    cwd: "."
  },
  "browser.request.watch": {
    command: "node",
    args: ["scripts/tasks/browser-request-watcher.js", "watch"],
    cwd: "."
  },
  "browser.request.complete": {
    command: "node",
    args: ["scripts/tasks/browser-request-watcher.js", "completion-scan"],
    cwd: "."
  }
};

function resolveTask(taskAlias, workspaceRoot) {
  const definition = ALLOWED_TASKS[taskAlias];
  if (!definition) {
    return null;
  }

  return {
    ...definition,
    cwd: path.resolve(workspaceRoot, definition.cwd)
  };
}

function resolvePromptTarget(target) {
  if (!target || typeof target !== "string") {
    return null;
  }

  const key = target.trim().toLowerCase();
  const agentName = ALLOWED_PROMPT_TARGETS[key];
  if (!agentName) {
    return null;
  }

  return {
    key,
    agentName
  };
}

module.exports = {
  ALLOWED_VSCODE_COMMANDS,
  resolvePromptTarget,
  resolveTask
};
