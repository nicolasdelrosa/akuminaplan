# Remote Access With Tailscale (Step 2)

This guide enables safe outside-LAN access to the bridge without exposing a public websocket port.

## Goal
- Phone and laptop join the same private Tailnet.
- Android client connects to the laptop Tailscale IP.
- Bridge keeps token auth and can enforce Tailscale-only traffic.

## 1. Install Tailscale

Laptop (Windows):
- Install Tailscale and sign in.

Android:
- Install Tailscale app and sign in to the same Tailnet.

## 2. Get Laptop Tailscale IP

On laptop PowerShell:

```powershell
tailscale ip -4
```

Example output: 100.104.22.9

## 3. Harden Bridge Settings

Use these values in mobile-command-bridge/.env:

```env
BRIDGE_HOST=0.0.0.0
BRIDGE_PORT=8787
BRIDGE_REQUIRE_TAILSCALE=true
BRIDGE_ALLOWED_CLIENT_IPS=
BRIDGE_MAX_ACTIVE_CONNECTIONS=5
BRIDGE_MAX_PAYLOAD_BYTES=65536
```

Optional stricter policy:
- Set BRIDGE_ALLOWED_CLIENT_IPS to exact Tailscale IPs (comma-separated).
- Example: BRIDGE_ALLOWED_CLIENT_IPS=100.85.4.10,100.104.22.9

## 4. Start Bridge

```powershell
npm --prefix c:\AkuminaPlan\mobile-command-bridge start
```

## 5. Connect From Phone

In Termux on Android:

```bash
cd mobile-command-bridge/android-client
npm install
node termux-client.js --host <laptop-tailscale-ip> --token <BRIDGE_TOKEN>
```

One-shot test:

```bash
node termux-client.js --host <laptop-tailscale-ip> --token <BRIDGE_TOKEN> --once task.run browser.request.complete
```

## 6. Security Checklist

- Keep BRIDGE_TOKEN secret and rotate periodically.
- Prefer BRIDGE_REQUIRE_TAILSCALE=true for remote use.
- Use BRIDGE_ALLOWED_CLIENT_IPS for known devices only.
- Keep allowlisted actions/targets minimal.
- Keep logs in runtime-logs and review failures.
- Do not expose port 8787 on public internet router/firewall.
