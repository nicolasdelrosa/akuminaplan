---
name: plan-my-day
description: "Use when: user asks to 'plan my day', 'show my tasks', 'what's on my plate', 'what should I work on', or requests current Jira assignments. Fetches fresh Jira issues assigned to user that are in progress, backlog, or updated this week using MCP Atlassian tools. Caches results to CSV for offline access."
---

# Plan My Day - Jira Task Management Skill

## Purpose
Fetch and display current Jira tasks assigned to you for daily planning using **OAuth-authenticated Atlassian MCP server**. Results are cached to CSV for quick offline access.

Queries for:
- Tasks in "In Progress" status
- Tasks in "Backlog" status  
- Tasks where you were mentioned/tagged in the last 7 days
- Recently updated tasks (within 7 days)

## CSV Caching Strategy

**Cache Location**: 
- Project-specific: `c:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv` (e.g., `c:\Git\LACourt\LACourts\my-jira-tasks.csv`)
- Global: `c:\AkuminaPlan\my-jira-issues.csv` (all projects combined)

**When to Fetch Fresh Data** (from Jira via MCP):
- User explicitly uses keywords: "fresh", "refresh", "recent", "latest", "update"
- CSV file doesn't exist
- CSV file is older than 24 hours

**When to Use Cache** (read from CSV):
- User asks for tasks WITHOUT refresh keywords
- CSV exists and is recent (less than 24 hours old)
- MCP authentication fails (fallback to last known state)

**CSV Format**:
```csv
Key,Summary,Status,Priority,Type,Project,Created,Updated
LAC-252,Provide Terry the complete LAC runbook,To Do,Medium,Task,LA Courts,2026-03-17,2026-03-18
```

## Authentication

**Atlassian MCP (OAuth)**
- OAuth authentication (more reliable than API tokens)
- Already configured in VS Code
- Automatically refreshes on VS Code reload

**MCP Configuration:**
- Location: `%APPDATA%\Code\User\mcp.json`
- Authentication: OAuth tokens (managed by VS Code)
- No manual setup required - already active

## Usage

### Trigger Phrases

**Standard (uses cache if available):**
- "Plan my day"
- "Show my tasks"
- "What's on my plate"
- "What should I work on"
- "Show my Jira issues"
- "Show my LAC tasks" (project-specific)

**Force Fresh Fetch (always queries Jira):**
- "Show my **fresh** tasks"
- "**Refresh** my Jira tasks"
- "Get **latest** LAC tickets"
- "**Update** my task list"
- Any request containing: fresh, refresh, recent, latest, update

### Execution Flow

**Step 1: Determine Data Source**
Check if user wants fresh data or can use cache:
```
IF user request contains ("fresh" OR "refresh" OR "recent" OR "latest" OR "update"):
    → Go to Step 2 (Fetch from Jira)
ELSE IF project-specific or user-requested filter (e.g., "LAC tasks"):
    → Check if project CSV exists: c:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv
    → If exists and < 24 hours old: Go to Step 5 (Read from Cache)
    → Else: Go to Step 2 (Fetch from Jira)
ELSE:
    → Check global CSV: c:\AkuminaPlan\my-jira-issues.csv
    → If exists and < 24 hours old: Go to Step 5 (Read from Cache)
    → Else: Go to Step 2 (Fetch from Jira)
```

**Step 2: Fetch Fresh Tasks from Jira (MCP with OAuth)**
Use Atlassian MCP server (already OAuth-authenticated via VS Code):
```
For project-specific query (e.g., LAC):
  JQL: project = LAC AND assignee = currentUser() AND (status IN ("In Progress", "To Do", "Backlog") OR updated >= -7d) ORDER BY updated DESC

For all projects:
  JQL: assignee = currentUser() AND (status IN ("In Progress", "To Do", "Backlog") OR updated >= -7d) ORDER BY updated DESC

Call mcp_atlassian_atl_searchJiraIssuesUsingJql with:
   - cloudId: d07d95ef-fe55-4050-a8b8-5c310f3260da
   - jql: [as above]
   - fields: ["key", "summary", "status", "priority", "issuetype", "project", "created", "updated"]
   - maxResults: 100
```

**Step 3: Handle MCP Auth Errors**
If MCP returns 401/403 errors:
```
1. Inform user: "Atlassian MCP authentication expired. Please reload VS Code: Ctrl+Shift+P → 'Developer: Reload Window'"
2. Try fallback to cached CSV if available
3. Do NOT retry MCP without reload
```

**Step 4: Save Results to CSV**
After successful Jira fetch:
```
1. Parse MCP response into CSV format:
   Key,Summary,Status,Priority,Type,Project,Created,Updated

2. Save to appropriate location:
   - Project-specific: c:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv
   - Global: c:\AkuminaPlan\my-jira-issues.csv

3. Include timestamp comment in first line: # Updated: 2026-03-19 14:30:00
```

**Step 5: Read from CSV Cache**
When using cached data:
```
1. Read CSV file from appropriate location
2. Parse CSV rows into task objects
3. Check file timestamp and inform user if data is stale:
   "Showing cached tasks from [timestamp]. Use 'fresh' or 'refresh' to update."
4. Display tasks using standard output format
```

**Step 6: Fallback to CLI (if MCP unavailable)**
Only if MCP tools are not available and no cache exists:
```powershell
# Get tasks in progress
jira running

# Get all assigned tasks
jira ls

# Search specific project
jira search <PROJECT>
```

## Output Format

Display tasks grouped by status with cache status indicator:

**When using fresh data:**
```
📋 Your LA Courts (LAC) Tasks (March 19, 2026) [Fresh from Jira]

🚧 In Progress (2):
- WCB-229: Deploy updated CustomFilter and GraphApiClient to PROD
- WCB-228: Implement AAD Group Membership Filter for PeopleSync

📝 To Do (1):
- WCB-198: CDN for static files

📝 Backlog (3):
- WCB-231: Modify employee detail page to use people sync fields
```

**When using cached data:**
```
📋 Your LA Courts (LAC) Tasks [Cached: Mar 19, 14:30] 💾

Use 'refresh' or 'fresh' to update from Jira.

🚧 In Progress (2):
- WCB-229: Deploy updated CustomFilter and GraphApiClient to PROD
...
```

**Include in summary:**
- Total count by status
- High priority items highlighted
- Link to Jira issue: https://akumina.atlassian.net/browse/{KEY}

## Jira Instance Details

- **URL**: https://akumina.atlassian.net
- **Cloud ID**: d07d95ef-fe55-4050-a8b8-5c310f3260da
- **Active Projects**: LAC (LA Courts), JMSMUC (JM Smuckers), WCB, UFA, BCRS (Ball Corp), POM (Pomerleau)
**
Use Atlassian MCP server (OAuth-authenticated via VS Code):
```
1. Call mcp_atlassian_atl_searchJiraIssuesUsing
**Cause**: OAuth tokens expired (happens after VS Code runs for extended periods)
**Fix**: Reload VS Code with `Ctrl+Shift+P` → "Developer: Reload Window" or run `.\scripts\reload-vscode.ps1`
**Do NOT**: Retry MCP calls without reloading first