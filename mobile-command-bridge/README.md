# Mobile Command Bridge

Simple phone-to-laptop command bridge for running allowlisted VS Code related commands and streaming results over WebSocket.

## What This v1 Supports
- Authenticated WebSocket connection from phone.
- Command execution via strict allowlist.
- Live stdout/stderr streaming.
- Final completion event with exit code.
- Request replay protection with timestamp and nonce.

## Quick Start
1. Install dependencies:
```powershell
cd c:\AkuminaPlan\mobile-command-bridge
npm install
```
2. Generate token:
```powershell
npm run token
```
3. Create `.env` from `.env.example` and set `BRIDGE_TOKEN`.
4. Start server:
```powershell
npm start
```
5. Health check:
```powershell
curl http://localhost:8787/health
```

## WebSocket
- Endpoint: `ws://<laptop-ip>:8787/ws`
- Header: `x-bridge-token: <BRIDGE_TOKEN>`

## Step 2: Remote Access Hardening
- Recommended remote path: Tailscale (no public port exposure).
- New hardening settings are available in `.env.example`:
  - `BRIDGE_REQUIRE_TAILSCALE`
  - `BRIDGE_ALLOWED_CLIENT_IPS`
  - `BRIDGE_MAX_ACTIVE_CONNECTIONS`
  - `BRIDGE_MAX_PAYLOAD_BYTES`
- Setup guide: `docs/remote-access-tailscale.md`

## Android App (No Termux)
- Native app source is in [mobile-command-bridge/android-app](mobile-command-bridge/android-app).
- Build APK with Android Studio from that folder.
- See [mobile-command-bridge/android-app/README.md](mobile-command-bridge/android-app/README.md) for commands and build path.
- If you do not have Android Studio, use GitHub Actions workflow [ .github/workflows/android-apk.yml ](.github/workflows/android-apk.yml) and download artifact `akumina-bridge-debug-apk`.
- The workflow now builds automatically on every push to `main`.

## Example Execute Message
```json
{
  "type": "execute",
  "requestId": "req-001",
  "action": "task.run",
  "target": "browser.request.prepare",
  "timestamp": 1775610000000,
  "nonce": "nonce-abcdef12"
}
```

See `docs/protocol.md` for full event list and target allowlist.
