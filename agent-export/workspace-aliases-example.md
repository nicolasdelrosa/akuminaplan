# Workspace Shortcuts

Use this format:

Alias: task

Or with a subpath:

Alias/subpath: task

## Aliases

- pb: C:/Git/PB/people/main
- smk: C:/Git/smuckers/smuckers/project/main
- lac: C:/Git/LACourt/LACourts/project/main
- ufa: C:/Git/UFA/UFA/main
- core: C:/Git/Akumina/DigitalWorkplace-Core/Src
- widgets: C:/Git/Akumina/DigitalWorkplace-Widgets/DigitalWorkplace-Widgets/Src
- appmgr: C:/Git/Akumina/AppManager/AppManager/Src
- plan: C:/AkuminaPlan

## Examples

- pb: fix spotlight language fallback and run tests
- smk/tests: update jmsmuc-194 selector logic
- lac: add release note for LAC-233
- plan/deployments: create release notes for next prod deploy

## Agent Routing

- Scott: tech lead and default implementation coordinator across the workspace
- Andrew: widget-source specialist for `widgets`
- Jason: shared Core specialist for `core`
- Udai: AppManager specialist for `appmgr`
- Theri: PM for Jira task creation and updates, always starting with CLI and using MCP only as fallback
- Ren: QA for tests, Playwright CLI, and Playwright MCP when needed
- Luke: design and UX support

## Routing Rules

- Use `Scott` for most implementation requests in client projects such as `lac`, `pb`, `smk`, and `ufa`.
- Use `Theri` for Jira work when you want CLI first. If CLI cannot complete the task, `Theri` may fall back to authenticated MCP Jira tools.
- If a client project references a widget but does not contain the widget source, `Scott` should ask `Andrew` for widget context.
- If `Andrew` needs shared framework context, ask `Jason`.
- If the behavior depends on AppManager integration or backend flow, ask `Udai`.
- Specialists stay scoped to their own source trees even when the request starts from a client alias.

## Agent Examples

- `Scott -> lac: implement a callback for widget X`
- `Andrew -> widgets: inspect widget X callback lifecycle`
- `Jason -> core: explain where widget X event pipeline is wired`
- `Udai -> appmgr: check whether widget X behavior depends on AppManager config`
- `Theri -> lac: create Jira tasks for release prep`
- `Ren -> smk/tests: run focused Playwright validation for jmsmuc-194`
- `Luke -> pb: propose a cleaner layout for the spotlight area`

## Pin In VS Code

1. Open this file.
2. Right-click the tab.
3. Select Pin.
