# Browser Handoff Workflow

## Purpose

Use this workflow when Codex needs live browser or MCP-only context that is faster to collect from Copilot / Ren than from manual chat back-and-forth.

Examples:

- active widget instance config
- request payloads
- DOM/state that only exists after live rendering
- deployed asset/template paths
- screenshots
- browser console output

## Principle

Keep one shared source of truth:

- `AkuminaTasks/{TICKET}.md`

Codex writes a structured browser request into the ticket file.
Copilot / Ren fulfills that request and writes findings back into the same file.
Codex resumes implementation from the updated file.

## Standard Sections

Add these sections to the ticket file when browser context is needed:

### `Browser Request`

Required fields:

- `Status`
- `Owner`
- `Environment`
- `Target page`
- `Need`
- `Return format`
- `Reason`

### `Browser Findings`

Required fields:

- `Status`
- `Captured by`
- `Environment`
- `Date`
- `Findings`
- `Raw payloads / snippets`
- `Follow-up impact`

## Status Values

For `Browser Request`:

- `Pending`
- `In progress`
- `Complete`
- `Blocked`

For `Browser Findings`:

- `Not started`
- `Complete`

## Request Template

```md
## Browser Request

- Status: Pending
- Owner: Ren / Copilot
- Environment: sandbox name here
- Target page: /sitepages/search.aspx
- Need:
  - exact widget instance id
  - displaytemplateurl
  - querycallbackmethod
  - callbackmethod
  - extendlookin
  - request.lookIn payload when Resources is selected
- Return format:
  - flat bullets
  - include raw payload snippets when relevant
- Reason:
  - Codex needs live widget wiring before changing callback logic
```

## Findings Template

```md
## Browser Findings

- Status: Complete
- Captured by: Ren / Copilot
- Environment: sandbox name here
- Date: 2026-03-21
- Findings:
  - Widget id: ...
  - displaytemplateurl: ...
  - querycallbackmethod: ...
  - callbackmethod: ...
  - extendlookin: ...
  - request.lookIn when Resources selected: ...
- Raw payloads / snippets:
  - paste short relevant payload snippets here
- Follow-up impact:
  - Codex can now update callback selection logic
```

## Recommended Prompt

Use prompts like:

```text
@Ren read C:\AkuminaPlan\AkuminaTasks\LAC-250.md and fulfill the Browser Request section.

Open the target page in the named environment.
Collect exactly the requested browser data.
Update the Browser Findings section in the same ticket file.
Do not rewrite the implementation plan.
```

## Rules

- Codex should ask for browser context only when local repo evidence is insufficient.
- Keep requests narrow and concrete.
- Prefer raw values over summaries when a payload or config value is needed.
- Copilot / Ren should update the same ticket file instead of replying in a separate planning doc.
- If deployment state matters, include branch and deployment status in the request.

## Good Targets For Handoff

- widget instance ids
- template paths
- App Manager values
- `request.lookIn` payloads
- search request payloads
- loaded asset URLs
- console errors
- screenshot evidence

## Bad Targets For Handoff

- code changes that can be done locally
- repo search that Codex can do directly
- speculative architecture questions without a live-browser dependency
