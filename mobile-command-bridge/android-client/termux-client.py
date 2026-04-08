#!/usr/bin/env python3
"""Simple interactive Android/Termux client for the mobile command bridge."""

import argparse
import json
import queue
import secrets
import threading
import time
from dataclasses import dataclass

import websocket


PRESET_TASKS = {
    "prepare": ("task.run", "browser.request.prepare"),
    "watch": ("task.run", "browser.request.watch"),
    "complete": ("task.run", "browser.request.complete"),
}

PRESET_VSCODE = {
    "chat": ("vscode.command", "workbench.action.chat.open"),
    "ask": ("vscode.command", "workbench.action.chat.openAsk"),
    "copilot": ("vscode.command", "github.copilot.chat.open"),
}


@dataclass
class SessionState:
    ws: websocket.WebSocketApp | None = None
    ready: bool = False
    last_request_id: str | None = None


def generate_request_id() -> str:
    return f"req-{int(time.time() * 1000)}-{secrets.token_hex(3)}"


def generate_nonce() -> str:
    return f"nonce-{secrets.token_hex(8)}"


def make_execute_payload(action: str, target: str) -> dict:
    request_id = generate_request_id()
    return {
        "type": "execute",
        "requestId": request_id,
        "action": action,
        "target": target,
        "timestamp": int(time.time() * 1000),
        "nonce": generate_nonce(),
    }


def make_cancel_payload(request_id: str) -> dict:
    return {
        "type": "cancel",
        "requestId": request_id,
    }


def print_help() -> None:
    print("\nCommands:")
    print("  help                              Show this help")
    print("  run <prepare|watch|complete>      Run task preset")
    print("  vc <chat|ask|copilot>             Run VS Code command preset")
    print("  exec <action> <target>            Run a custom allowlisted action/target")
    print("  cancel [requestId]                Cancel last request or a specific one")
    print("  exit                              Quit")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Termux client for mobile-command-bridge")
    parser.add_argument("--host", default="127.0.0.1", help="Laptop host/IP")
    parser.add_argument("--port", type=int, default=8787, help="Bridge port")
    parser.add_argument("--token", required=True, help="Bridge token (BRIDGE_TOKEN)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    state = SessionState()
    event_queue: queue.Queue[dict] = queue.Queue()

    ws_url = f"ws://{args.host}:{args.port}/ws"

    def on_open(_: websocket.WebSocketApp) -> None:
        print(f"Connected to {ws_url}")

    def on_message(_: websocket.WebSocketApp, message: str) -> None:
        try:
            payload = json.loads(message)
        except json.JSONDecodeError:
            print(f"[raw] {message}")
            return

        event_queue.put(payload)

    def on_error(_: websocket.WebSocketApp, error: Exception) -> None:
        print(f"[error] websocket: {error}")

    def on_close(_: websocket.WebSocketApp, status_code: int, close_msg: str) -> None:
        print(f"Disconnected ({status_code}): {close_msg}")

    headers = [f"x-bridge-token: {args.token}"]

    ws = websocket.WebSocketApp(
        ws_url,
        header=headers,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    state.ws = ws

    thread = threading.Thread(target=ws.run_forever, daemon=True)
    thread.start()

    # Wait briefly for the initial ready event.
    ready_deadline = time.time() + 5
    while time.time() < ready_deadline and not state.ready:
        pump_events(state, event_queue)
        time.sleep(0.1)

    print_help()

    while True:
        pump_events(state, event_queue)
        try:
            raw = input("bridge> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye")
            break

        if not raw:
            continue

        parts = raw.split()
        cmd = parts[0].lower()

        if cmd == "help":
            print_help()
            continue

        if cmd == "exit":
            break

        if cmd == "run" and len(parts) == 2:
            preset = PRESET_TASKS.get(parts[1].lower())
            if not preset:
                print("Unknown task preset")
                continue
            send_execute(state, *preset)
            continue

        if cmd == "vc" and len(parts) == 2:
            preset = PRESET_VSCODE.get(parts[1].lower())
            if not preset:
                print("Unknown VS Code preset")
                continue
            send_execute(state, *preset)
            continue

        if cmd == "exec" and len(parts) == 3:
            send_execute(state, parts[1], parts[2])
            continue

        if cmd == "cancel":
            request_id = parts[1] if len(parts) == 2 else state.last_request_id
            if not request_id:
                print("No requestId available to cancel")
                continue
            send_payload(state, make_cancel_payload(request_id))
            continue

        print("Unknown command. Type 'help'.")

    if state.ws:
        state.ws.close()


def send_execute(state: SessionState, action: str, target: str) -> None:
    payload = make_execute_payload(action, target)
    state.last_request_id = payload["requestId"]
    send_payload(state, payload)


def send_payload(state: SessionState, payload: dict) -> None:
    if not state.ws:
        print("Not connected")
        return

    state.ws.send(json.dumps(payload))
    print(f"-> {payload['type']} {payload.get('requestId', '')} {payload.get('action', '')} {payload.get('target', '')}")


def pump_events(state: SessionState, event_queue: queue.Queue[dict]) -> None:
    while True:
        try:
            event = event_queue.get_nowait()
        except queue.Empty:
            return

        event_type = event.get("type", "unknown")

        if event_type == "ready":
            state.ready = True
            print(f"<- ready version={event.get('version')} serverTime={event.get('serverTime')}")
            continue

        if event_type == "stream":
            req = event.get("requestId", "?")
            stream_name = event.get("stream", "stdout")
            chunk = event.get("chunk", "")
            print(f"<- [{req}] {stream_name}: {chunk}", end="" if chunk.endswith("\n") else "\n")
            continue

        if event_type == "started":
            print(f"<- started {event.get('requestId')} {event.get('action')} {event.get('meta', {})}")
            continue

        if event_type == "complete":
            print(
                f"<- complete {event.get('requestId')} exitCode={event.get('exitCode')} signal={event.get('signal')}"
            )
            continue

        if event_type == "cancelled":
            print(f"<- cancelled {event.get('requestId')} cancelled={event.get('cancelled')}")
            continue

        if event_type == "error":
            print(
                f"<- error requestId={event.get('requestId')} code={event.get('code')} message={event.get('message')}"
            )
            continue

        print(f"<- {json.dumps(event)}")


if __name__ == "__main__":
    main()
