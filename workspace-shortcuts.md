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

## Operation Rules

- `@Theri`
  Read/summarize mode by default. For task-list requests, use the project CSV cache first. Only use live Jira when the user explicitly asks for fresh, real, latest, no-cache, or update/refresh behavior.
- `@Andrew`
  Widget-inspection mode by default. Search/read/edit only under `C:/Git/Akumina/DigitalWorkplace-Widgets/DigitalWorkplace-Widgets/Src`, prefer config/runtime lookup, and escalate to `Jason` only if the behavior depends on shared Core logic.
- `@Ren`
  Validation mode by default. Prefer Playwright CLI and existing tests, summarize failures clearly, and escalate only when debugging requires deeper implementation analysis.
- `@Luke`
  UX review mode by default. Focus on layout, copy, and interaction guidance unless implementation work is explicitly requested.
- `@Scott`
  Implementation mode by default. Own planning, code changes, repo coordination, and escalations to specialists when a request crosses source-tree boundaries. Search only inside one resolved target repo root per step (no workspace-wide search).
- `@Jason`
  Core-analysis mode by default. Search/read/edit only under `C:/Git/Akumina/DigitalWorkplace-Core/Src`, and use when widget or client behavior depends on Core internals.
- `@Udai`
  Integration mode by default. Focus on AppManager, backend flow, and environment-sensitive behavior. Search/read/edit only under `C:/Git/Akumina/AppManager/AppManager/Src`.

## Search Scope Guardrails

- Every `@AgentName` request must resolve a target scope before running search/list/read operations.
- Specialists (`@Andrew`, `@Jason`, `@Udai`) stay inside their source trees at all times.
- `@Scott` may coordinate multi-repo work but should search only one repo root at a time and switch scope explicitly when needed.
- If relevant code is outside current scope, delegate or hand off to the matching specialist agent.

## Cost And Effort Policy

- `@Theri`: cheap model behavior unless the request needs cross-ticket prioritization or complex planning.
  Cache path pattern: `c:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv` for project-specific task lists such as UFA and LAC.
- `@Andrew`: cheap/medium behavior for widget lookup and config analysis; escalate to strong reasoning only for ambiguous cross-layer issues.
- `@Ren`: medium behavior for test selection, execution, and failure triage; escalate for unclear root cause.
- `@Luke`: cheap/medium behavior for design critique and UX direction.
- `@Scott`: strong reasoning by default for implementation and debugging.
- `@Jason`: strong reasoning by default for Core/platform work.
- `@Udai`: strong reasoning by default for AppManager/integration work.

## Invocation Defaults

- If a prompt starts with `@AgentName`, apply that agent's scope, operation rule, and cost/effort policy automatically.
- If a prompt also uses an alias such as `ufa:`, `lac:`, `widgets:`, or `appmgr:`, use the alias only to resolve context and repository location.
- If a request spans multiple codebases, `Scott` coordinates first and then pulls in the relevant specialist context.

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
