# Mobile Command Bridge Protocol (v1)

## WebSocket Endpoint
- URL: `ws://<laptop-host>:8787/ws`
- Required header: `x-bridge-token: <BRIDGE_TOKEN>`

## Client -> Server: Execute
```json
{
  "type": "execute",
  "requestId": "req-001",
  "action": "task.run",
  "target": "browser.request.prepare",
  "timestamp": 1775610000000,
  "nonce": "nonce-12345678"
}
```

## Client -> Server: Cancel
```json
{
  "type": "cancel",
  "requestId": "req-001"
}
```

## Allowed Actions
- `task.run`
- `vscode.command`
- `prompt.write`
- `prompt.dispatch`

## Prompt Action Fields
- `target`: allowlisted agent key (`ren`, `scott`, `andrew`, `jason`, `udai`, `theri`, `luke`)
- `promptText`: text appended after agent mention

Example:

```json
{
  "type": "execute",
  "requestId": "req-002",
  "action": "prompt.write",
  "target": "ren",
  "promptText": "Review today\'s findings and list blockers.",
  "timestamp": 1775610000001,
  "nonce": "nonce-abcdef13"
}
```

## Allowed Task Targets
- `browser.request.prepare`
- `browser.request.watch`
- `browser.request.complete`

## Allowed VS Code Command Targets
- `workbench.action.chat.open`
- `workbench.action.chat.openAsk`
- `github.copilot.chat.open`

## Server Events
- `ready`
- `started`
- `stream`
- `complete`
- `cancelled`
- `error`

## Security
- Shared token on connection (`x-bridge-token`)
- Anti-replay checks (`timestamp`, `nonce`, TTL)
- Strict allowlist for actions and targets
- Optional network guardrails via env settings:
  - `BRIDGE_REQUIRE_TAILSCALE`
  - `BRIDGE_ALLOWED_CLIENT_IPS`
  - `BRIDGE_MAX_ACTIVE_CONNECTIONS`
  - `BRIDGE_MAX_PAYLOAD_BYTES`
