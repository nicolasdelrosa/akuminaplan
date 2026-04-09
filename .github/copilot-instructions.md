# Copilot Instructions

## Project Overview

This workspace manages Akumina deployment and performance optimization tasks across multiple client projects (LA Courts, JM Smuckers, WCB, etc.) using MCP (Model Context Protocol) servers for Jira/Azure DevOps integration and browser automation.

**Key Integration:** Atlassian MCP server authenticates to Jira for ticket management; browser automation via Playwright MCP handles live site testing.

## Architecture & Data Flow

### MCP Server Integration (Critical)
- **Atlassian MCP**: Primary tool for Jira ticket operations (`mcp_atlassian_*` tools)
- **Azure DevOps MCP**: Pipeline management and repository operations
- **Playwright MCP**: Browser automation for site verification
- **Config Location**: `%APPDATA%\Code\User\mcp.json` (not in repo)

**Authentication Flow:**
1. MCP servers authenticate on VS Code startup using tokens from `mcp.json`
2. Tokens expire → 401 errors → requires VS Code reload to refresh session
3. **DO NOT** retry failed MCP calls without reloading first

### Jira Workflow
1. Project-specific CSV caches are the default source for task-list requests:
   - `c:\Git\UFA\UFA\my-jira-tasks.csv`
   - `c:\Git\LACourt\LACourts\my-jira-tasks.csv`
   - Pattern: `c:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv`
2. Use live Jira only when the user explicitly requests fresh/real/latest/no-cache/update/refresh behavior.
3. Live operations may use Jira CLI or `mcp_atlassian_*` tools depending on runtime availability.
4. When MCP auth fails: `.\scripts\reload-vscode.ps1` or `Ctrl+Shift+P` → "Developer: Reload Window"

## Critical Developer Workflows

### MCP Authentication Recovery (MOST COMMON)
**When any MCP tool returns 401/403/auth errors:**
```
Immediately respond: "The [Server Name] MCP authentication has expired. 
Please reload VS Code: Ctrl+Shift+P → 'Developer: Reload Window' or run .\scripts\reload-vscode.ps1"
```
- DO NOT retry without reload
- DO NOT ask permission to suggest reload
- After user confirms reload, retry operation once

### Browser Automation with Playwright
Authentication script: [Authentication/authenticate.js](Authentication/authenticate.js)
- Uses `browser_batch_execute` for multi-step workflows
- Mount Sinai site credentials stored in script (production environment)
- Always include `expectation` config to capture results

Example pattern from [authenticate.js](Authentication/authenticate.js):
```javascript
{
  tool: "browser_navigate",
  arguments: { url: "..." },
  expectation: { includeSnapshot: true, includeConsole: true }
}
```

### Scripts
- **[scripts/check-mcp-auth.ps1](scripts/check-mcp-auth.ps1)**: Verify MCP server configuration status
- **[scripts/reload-vscode.ps1](scripts/reload-vscode.ps1)**: Reload window to refresh MCP auth (triggers `code --command workbench.action.reloadWindow`)
- **[scripts/setup-jira-cli.ps1](scripts/setup-jira-cli.ps1)**: Configure Jira CLI for first-time use

### Daily Planning Workflow (Theri Mode)
When user asks "plan my day" or similar queries, use the **plan-my-day** skill:
- **Skill Location**: [.github/skills/plan-my-day/SKILL.md](.github/skills/plan-my-day/SKILL.md)
- **Primary Method**: MCP Atlassian tools (OAuth-authenticated, most reliable)
- **Fallback**: Jira CLI if MCP unavailable
- **MCP Auth Fix**: Reload VS Code if 401/403 errors occur
- **Query**: `mcp_atlassian_atl_searchJiraIssuesUsingJql` with JQL: `assignee = currentUser() AND (status IN ("In Progress", "Backlog") OR updated >= -7d)`

**Why MCP is Preferred:**
- OAuth authentication (no API token management)
- More reliable (no "undefinedrest" connection errors)
- Already configured and active in VS Code
- Auto-refreshes on VS Code reload

**Jira CLI Configuration:**
- Config file: `%USERPROFILE%\.jira-cli\config.json`
- Instance: https://akumina.atlassian.net
- Requires API token from https://id.atlassian.com/manage-profile/security/api-tokens

### Client Runbook Generation
When user asks to create project documentation/runbook, use the **create-runbook** skill:
- **Skill Location**: [.github/skills/create-runbook/SKILL.md](.github/skills/create-runbook/SKILL.md)
- **Template**: [.github/skills/create-runbook/RUNBOOK_TEMPLATE.md](.github/skills/create-runbook/RUNBOOK_TEMPLATE.md)
- **Conversion Script**: [.github/skills/create-runbook/convert-runbook-template.js](.github/skills/create-runbook/convert-runbook-template.js)
- **Output Location**: `deployments/{CLIENT}/{CLIENT}_Runbook.md` and `.docx`
- **Format**: Matches Akumina standard runbook template (based on existing client runbooks)

### Document Parsing With Docling
When the user asks to convert PDFs, DOCX, PPTX, HTML, images, or scanned documents into Markdown/JSON or wants OCR/table extraction, use the **docling-workflows** skill:
- **Skill Location**: [.github/skills/docling-workflows/SKILL.md](.github/skills/docling-workflows/SKILL.md)
- **Wrapper Script**: [.github/skills/docling-workflows/scripts/invoke-docling.ps1](.github/skills/docling-workflows/scripts/invoke-docling.ps1)
- **Reference**: [.github/skills/docling-workflows/references/docling.md](.github/skills/docling-workflows/references/docling.md)
- **MCP Option**: Add Docling MCP to `%APPDATA%\Code\User\mcp.json` when the agent should call Docling as a tool instead of shelling out to the CLI

### Widget Custom Views
When the user asks to add or update a widget custom view/template, callback wiring, or deploy-safe widget instance configuration, use the **akumina-widget-custom-view** skill:
- **Skill Location**: [.github/skills/akumina-widget-custom-view/SKILL.md](.github/skills/akumina-widget-custom-view/SKILL.md)
- **Purpose**: Enforces widget `views/` source layout, correct config `Views.Path`, and instance ID matching to avoid duplicate AppManager instances

**Runbook Sections:**
1. Cover Page, Table of Contents, Change Log
2. Introduction, Testing Requirements (browsers, breakpoints)
3. Source Control (repository URL, branch strategy)
4. Site (DEV/PROD URLs, framework versions)
5. Project Customizations (widgets, libraries)

**Always Create Both Formats:**
- Markdown (.md) for version control
- Word (.docx) for client delivery

## Project Conventions

### Agent Invocation Defaults

When a prompt starts with `@AgentName`, apply that agent's scope and default operation rule automatically.

- `@Theri`: Jira/task mode. Prefer the project CSV cache for task-list requests. Use live Jira only when the prompt explicitly asks for fresh, real, latest, no-cache, update, or refresh behavior.
- `@Andrew`: widget-source inspection mode limited to widget repo context.
- `@Ren`: validation/test mode. Prefer Playwright CLI and existing tests before MCP-only flows.
- `@Luke`: UX/design review mode unless implementation is explicitly requested.
- `@Scott`: implementation mode and default coordinator for multi-repo work.
- `@Jason`: Core/platform analysis mode.
- `@Udai`: AppManager/integration mode.

### Agent Search Scope Enforcement

When a prompt starts with `@AgentName`, enforce search scope for that agent.

- `@Andrew`: search/read/edit only under `C:/Git/Akumina/DigitalWorkplace-Widgets/DigitalWorkplace-Widgets/Src`.
- `@Jason`: search/read/edit only under `C:/Git/Akumina/DigitalWorkplace-Core/Src`.
- `@Udai`: search/read/edit only under `C:/Git/Akumina/AppManager/AppManager/Src`.
- `@Scott`: resolve one target repo root first (from alias or prompt), then search only inside that root for the current step. No workspace-wide search.
- `@Ren`, `@Luke`, and `@Theri`: search only the minimal repository/path needed for the active request, not the full workspace.

If the needed code is outside an agent's scope, hand off to the correct specialist instead of broadening search.

### Agent Cost And Effort Policy

- `@Theri`: cheap model behavior by default. Escalate only for complex planning or cross-ticket prioritization.
- `@Andrew`: cheap/medium behavior for widget lookup and config analysis. Escalate when the issue crosses into Core behavior.
- `@Ren`: medium behavior for test execution, validation, and failure triage.
- `@Luke`: cheap/medium behavior for UX critique and design direction.
- `@Scott`: strong reasoning by default for implementation, debugging, and coordination.
- `@Jason`: strong reasoning by default for Core/framework issues.
- `@Udai`: strong reasoning by default for AppManager/backend/integration issues.

### Model Recommendation And Cost Routing

For chat-style requests, silently classify the task first and prefer the lowest-cost model that is likely to succeed.

- Routine tasks: use cheap models first. Examples: small edits, summaries, grep/find requests, simple explanations, test commands, lightweight file changes.
- Medium tasks: use mid-tier models. Examples: multi-file edits, moderate debugging, code review, refactors with clear scope, ticket analysis with some synthesis.
- Hard tasks: use strong reasoning models only when needed. Examples: architecture changes, ambiguous bugs, cross-repo coordination, deep framework analysis, high-risk production issues.

Recommended model order when the environment offers these choices:

1. `GPT-5 mini` or equivalent cheap/default chat model for routine work
2. `GPT-5.4 mini` or equivalent mid-tier model for medium work
3. `Claude Sonnet` class models for medium/hard reasoning when strong synthesis is needed
4. `GPT-5.4` or strongest available reasoning model only for hard tasks
5. `Codex-mini` for routine coding-agent work
6. full `Codex` / max reasoning agent only when blocked or when the task is genuinely hard

When starting a new chat request, briefly state the recommendation in one line before proceeding when useful:

`Recommended model: [model]`

Then continue with the task without waiting for confirmation unless the user explicitly asks to choose first.

Cost discipline rules:

- Default to `mini`/cheap models unless there is a concrete reason to escalate.
- Do not recommend premium/high-cost models for simple file lookup, formatting, summaries, or straightforward code edits.
- Escalate only when the task is ambiguous, cross-cutting, high-risk, or the cheaper model is likely to fail.
- If a strong model is recommended, briefly state why in a few words.

### Alias Routing

If a prompt uses `alias: task` or `alias/subpath: task`, resolve the alias before acting.

- `pb` -> `C:/Git/PB/people/main`
- `smk` -> `C:/Git/smuckers/smuckers/project/main`
- `lac` -> `C:/Git/LACourt/LACourts/project/main`
- `ufa` -> `C:/Git/UFA/UFA/main`
- `core` -> `C:/Git/Akumina/DigitalWorkplace-Core/Src`
- `widgets` -> `C:/Git/Akumina/DigitalWorkplace-Widgets/DigitalWorkplace-Widgets/Src`
- `appmgr` -> `C:/Git/Akumina/AppManager/AppManager/Src`
- `plan` -> `C:/AkuminaPlan`

If a request spans multiple codebases, `Scott` should coordinate first and then bring in the relevant specialist context.

### Jira Ticket References
- Always use key format: `PROJECT-123` (e.g., `LAC-219`, `JMSMUC-63`)
- CSV cache contains: Key, Summary, Status, Priority, Type, Project, Created, Updated
- Active projects: LA Courts (LAC), JM Smuckers (JMSMUC), WCB, Ball Corp (BCRS), UFA, Pomerleau (POM)
- Default project cache path pattern: `c:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv`

### Performance Optimization Pattern
Multiple clients have "Performance Checklist" stories with subtasks:
- Baseline/Home page cold/warm load measurements
- CDN implementation (images, static files)
- HTTP protocol upgrades
- Widget lazy loading
- See [my-jira-issues.csv](my-jira-issues.csv) for active performance tasks

### MCP Tool Naming
- Atlassian: `mcp_atlassian_atl_*` (e.g., `mcp_atlassian_atl_getAccessibleAtlassianResources`)
- Azure: `mcp_microsoft_azu_*`
- Playwright: `mcp_fast-playwrig_browser_*`

## Error Recovery Patterns

### Pattern 1: MCP Auth Failure
**Trigger:** `{"code":401,"message":"Unauthorized"}` or similar
**Response:** Immediate reload suggestion (see "MCP Authentication Recovery" above)
**DO NOT:** Make 2+ retry attempts, ask for permission to troubleshoot

### Pattern 2: Missing Jira Ticket Details
**Fallback:** Check [my-jira-issues.csv](my-jira-issues.csv) for cached data
**Last Resort:** Ask user for ticket key/details

### Pattern 3: Browser Session Expired
**Response:** Reload VS Code to restart Playwright MCP server
**Alternative:** Close/reopen browser tab if navigation-specific

## Key Files Reference

- **[.github/COPILOT_INSTRUCTIONS.md](.github/COPILOT_INSTRUCTIONS.md)**: Detailed MCP troubleshooting procedures (200+ lines)
- **[Authentication/authenticate.js](Authentication/authenticate.js)**: Mount Sinai site login automation
- **[package.json](package.json)**: Dependencies: `chrome-devtools-mcp`, `docx` (document generation)
- **[my-jira-issues.csv](my-jira-issues.csv)**: Cached ticket list for offline reference

## Release Notes Workflow (CRITICAL)

### Standard Process for Creating Release Notes
When creating deployment release notes, **ALWAYS** follow this complete workflow:

1. **Create Deployment Tickets in Jira**
   - Create separate tickets for DEV and PROD deployments
   - Include release version/branch and list of tickets in description
   - Tag with appropriate labels (e.g., `deployment`, release version)

2. **Tag Related Tickets**
   - Add release version label to all tickets included in the deployment
   - Maintain existing labels on tickets

3. **Generate Markdown Release Notes**
   - Create comprehensive release notes in `deployments/{PROJECT}/` directory
   - Include all manual steps from ticket descriptions
   - Format: `{PROJECT}_{ENV}_Deployment_{Date}_Release_Notes.md`
   - Structure MUST include:
     - Deployment Information (environment, date, branch, ticket)
     - Included Tickets with full descriptions and manual steps
     - Pre-Deployment Checklist
     - Post-Deployment Verification steps
     - Rollback Plan

4. **Generate DOCX Version (MANDATORY)**
   - **ALWAYS create DOCX version** using the conversion utility
   - Scripts location: `scripts/utils/convert-to-docx.js` or create project-specific converter
   - Run conversion script to generate `.docx` files
   - Both markdown and DOCX must be in the same directory

5. **Update Deployment Tickets**
   - Add comment to deployment tickets noting release notes are available
   - Mention both markdown and DOCX formats

### Manual Steps Documentation
When documenting manual steps from tickets:
- **Extract verbatim** from ticket descriptions (look for `manualsteps` section)
- Format as numbered lists for clarity
- Include all technical details (property names, values, configurations)
- Preserve exact syntax and formatting from original tickets

### Example DOCX Conversion Script Pattern
```javascript
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, HeadingLevel } = require('docx');

function convertMarkdownToDocx(markdownFile, outputFile) {
  // Parse markdown and create DOCX structure
  // Save to same directory as markdown file
}
```

## DO NOT

1. Retry MCP calls without reload after auth failure
2. Ask permission before suggesting standard troubleshooting (reload, auth check)
3. Proceed with workflow if MCP tools required and failing
4. Store credentials in repo (use MCP config only)
5. Ignore the existing [.github/COPILOT_INSTRUCTIONS.md](.github/COPILOT_INSTRUCTIONS.md) - it contains detailed MCP error templates
