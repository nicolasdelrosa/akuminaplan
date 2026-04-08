# Integration Boundaries

This folder is intentionally isolated from client projects.

## Allowed Cross-Folder Integration Points
- Execute allowlisted task scripts located in the parent workspace (`../scripts/tasks/...`).
- Execute allowlisted VS Code command IDs through the `code` CLI.
- Read-only references to parent workspace config files when needed for command execution context.

## Forbidden Behaviors
- No arbitrary shell command execution from phone requests.
- No writes outside this folder unless an integration point is explicitly approved and documented.
- No direct mutation of client project files from bridge commands.

## Runtime Data Location
- All bridge runtime logs must stay in `runtime-logs/`.
- Bridge config stays in local `.env` only.
