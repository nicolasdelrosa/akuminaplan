# Akumina Bridge Android App

Small native Android client for the Mobile Command Bridge.

## What it does
- Connects to `ws://<host>:<port>/ws`
- In secure mode, can send auth header `x-bridge-token`
- Lets you type plain text from a single textbox
- Lets you switch agents using tabs (`ren`, `scott`, `andrew`, `jason`, `udai`, `theri`, `luke`)
- Supports microphone speech-to-text so you can talk instead of typing
- Keeps connection fields in a collapsible Settings panel
- Includes secure mode toggle in settings (token on/off without rebuild)
- Includes Stop and Regenerate controls for quick iteration
- Renders chat bubbles for user/system/assistant messages
- Streams assistant responses in chunks for a live typing effect
- Persists recent chat history on device between app restarts

## Textbox Behavior
- Any plain text you send is dispatched as `prompt.dispatch` to the selected agent.
- Optional agent targeting: start with `@agentName`.

Examples:
- `Summarize today's blockers and next steps`
- `@scott Review this architecture and list risks`

Special text commands:
- `clear` clears the output panel
- `cancel` cancels the last sent request

## Build APK (Android Studio)
1. Open Android Studio.
2. Choose Open and select [mobile-command-bridge/android-app](mobile-command-bridge/android-app).
3. Let Gradle sync.
4. Build -> Build Bundle(s) / APK(s) -> Build APK(s).
5. Install generated APK on phone.

## Build APK (No Android Studio)
Use GitHub Actions workflow [ .github/workflows/android-apk.yml ](.github/workflows/android-apk.yml).

Automatic trigger:
- Runs on every push to `main`

1. Push your latest changes to GitHub.
2. Open your repository on GitHub.
3. Go to Actions -> Build Android APK.
4. Click Run workflow.
5. Wait for the run to complete.
6. Open the run and download artifact `akumina-bridge-debug-apk`.
7. The artifact contains `app-debug.apk`.

## Release APK path in project
- `app/build/outputs/apk/debug/app-debug.apk`

## Artifact Path In CI
- `mobile-command-bridge/android-app/app/build/outputs/apk/debug/app-debug.apk`

## Notes
- Keep laptop bridge service running first.
- Use your existing bridge token from `.env`.
- For outside LAN, use Tailscale and connect to laptop Tailscale IP.
- App allows cleartext traffic for local `ws://` bridge connections (Android blocks this by default).
