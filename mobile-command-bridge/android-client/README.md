# Android Client (Step 1)

This folder includes a practical Android-first client using Termux.

## Why Termux First
- Fastest way to get a terminal-like command prompt on Android.
- Supports WebSocket headers (`x-bridge-token`) required by server auth.
- No Android Studio setup needed for v1.

## Files
- `termux-client.js`: primary interactive command prompt for Android phone (Node/Termux).
- `package.json`: Node dependency for WebSocket support.
- `command-history.json`: auto-generated history store for retry and last commands.
- `termux-client.py`: optional Python client.
- `requirements.txt`: Python dependency file.

## Termux Setup (Android, Node - Recommended)
1. Install Termux.
2. In Termux, run:

```bash
pkg update -y
pkg install -y nodejs
npm install
```

3. Copy this folder to your phone (or clone repo if available).

## Run Client

```bash
node termux-client.js --host <laptop-ip> --port 8787 --token <BRIDGE_TOKEN>
```

Example:

```bash
node termux-client.js --host 192.168.1.42 --token 33db0a17...
```

One-shot mode (auto-executes and exits):

```bash
node termux-client.js --host 192.168.1.42 --token <BRIDGE_TOKEN> --once task.run browser.request.complete
```

One-shot prompt write (safe adapter test):

```bash
node termux-client.js --host 192.168.1.42 --token <BRIDGE_TOKEN> --once prompt.write ren --once-prompt "Review today and summarize blockers"
```

## Optional Python Setup

```bash
pkg install -y python
pip install -r requirements.txt
python termux-client.py --host <laptop-ip> --token <BRIDGE_TOKEN>
```

## Interactive Commands
- `run prepare`: runs `task.run` + `browser.request.prepare`
- `run watch`: runs `task.run` + `browser.request.watch`
- `run complete`: runs `task.run` + `browser.request.complete`
- `vc chat`: runs `vscode.command` + `workbench.action.chat.open`
- `vc ask`: runs `vscode.command` + `workbench.action.chat.openAsk`
- `vc copilot`: runs `vscode.command` + `github.copilot.chat.open`
- `exec <action> <target>`: custom allowlisted command
- `agent <name> <text...>`: sends `prompt.dispatch` to allowlisted agent target
- `draft <name> <text...>`: sends `prompt.write` to create prompt artifact only
- `history [count]`: list recent commands (default 10)
- `retry <index>`: rerun a command from history output
- `last`: rerun the most recent command
- `cancel [requestId]`: cancels last request or a specific request ID
- `help`
- `exit`

## Notes
- Keep bridge server running on laptop: `npm --prefix c:\AkuminaPlan\mobile-command-bridge start`
- For outside-LAN access, use a secure tunnel (planned in step 2).
