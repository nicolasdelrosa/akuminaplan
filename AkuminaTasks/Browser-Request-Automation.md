# Browser Request Automation

## Goal

Reduce the handoff from Codex to `@Ren` to one local command.

The first version does not try to call Copilot directly. Instead it:

- watches `AkuminaTasks/*.md`
- finds `## Browser Request` sections with `Status: Pending`
- generates the standard `@Ren` handoff prompt
- writes prompt artifacts under `AkuminaTasks/.browser-requests`
- copies the prompt to the clipboard on Windows

That removes the prompt-rewriting step and keeps the workflow file-driven.

The second layer adds VS Code tasks so the active ticket can generate and open the `@Ren` prompt with one action.

## Commands

Run once:

```powershell
npm run browser:request
```

Watch continuously:

```powershell
npm run browser:watch
```

Prepare the active ticket in VS Code:

- `Tasks: Run Task` -> `Browser Request: Prepare Current Ticket`

Prepare and claim the active ticket:

- `Tasks: Run Task` -> `Browser Request: Prepare And Claim Current Ticket`

Optional status claim:

```powershell
node scripts\tasks\browser-request-watcher.js scan --claim
```

`--claim` changes the ticket's `Browser Request` status from `Pending` to `In progress` after prompt generation.

## Output

For a ticket like `LAC-250.md`, the script writes:

- `AkuminaTasks/.browser-requests/LAC-250.prompt.txt`
- `AkuminaTasks/.browser-requests/LAC-250.json`

It also attempts to copy the generated prompt into the Windows clipboard so it can be pasted directly into Copilot.
When run from the VS Code task, it also tries to reopen the generated prompt file in the current window.
The watcher state now records both request generation and completion-aware metadata so completed tickets are not regenerated accidentally.

## What This Solves

- Codex writes the structured browser need once in the ticket file
- the script converts that into a standardized `@Ren` request
- you avoid retyping the handoff prompt every time

## Current Limitation

This is a soft automation pass, not a true Copilot trigger.

It does not yet:

- open Copilot automatically
- submit the prompt automatically
- detect when `@Ren` finished

To get fully automatic dispatch, the next layer would need either:

- a VS Code extension/command integration
- a callable Copilot/MCP interface
- or another local automation hook that can send the prompt into the chat surface

## Suggested Next Step

If this first pass feels useful, the next improvement should be:

- a VS Code extension or command that sends the generated prompt into the active Copilot chat session
