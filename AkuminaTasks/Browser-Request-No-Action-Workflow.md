# Browser Request No-Action Workflow

## Goal

Let Codex request live browser context from `@Ren` without any manual user handoff steps.

## Intended Flow

1. Codex updates a ticket file such as `AkuminaTasks/LAC-250.md`
2. `## Browser Request` is set to `Status: Pending`
3. A background dispatcher notices the pending request
4. The dispatcher generates the prompt and marks the request `In progress`
5. AutoHotkey opens VS Code Copilot Chat and sends the prompt to `@Ren`
6. `@Ren` updates `Browser Findings`
7. A completion notifier detects the updated `Browser Findings` and shows a Windows toast
8. If no completed findings appear after the timeout window, a warning toast is shown
9. Codex continues from the updated file

## Components

- `scripts/tasks/browser-request-watcher.js`
  Parses pending requests and generates prompt artifacts.
- `scripts/tasks/invoke-browser-request-dispatch.ps1`
  Watch loop and dispatch orchestrator.
- `tools/browser-request-automation/send-to-copilot.ahk`
  UI automation for VS Code + Copilot Chat.
- `scripts/tasks/show-browser-request-toast.ps1`
  Windows toast notification helper for completed Browser Findings.

## Current Gap

The no-action path depends on:

- AutoHotkey v2 installed
- Copilot chat calibration remaining stable
- Windows toast notifications being allowed in the current environment

## Core Commands

Dispatch a ticket once:

```powershell
powershell -ExecutionPolicy Bypass -File C:\AkuminaPlan\scripts\tasks\invoke-browser-request-dispatch.ps1 -TicketFile C:\AkuminaPlan\AkuminaTasks\LAC-250.md -Force
```

Run the background loop for dispatch plus completion notification:

```powershell
npm run browser:auto
```

The watch loop also warns if a dispatched ticket still has no completed `Browser Findings` after the configured timeout.
