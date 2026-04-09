---
name: get my tasks
description: Gets my assigned Jira tasks and mentions

---

When the user types "get my tasks" or asks about their Jira tasks, use the Atlassian MCP tools to retrieve:

1. **Assigned Tasks** - Issues assigned to me with status:
   - In Progress
   - Backlog
   - To Do
   - Selected for Development
   - Open

2. **Recent Mentions** - Items where I was mentioned this week

## Implementation

### Step 1: Get Cloud ID
First, get the Atlassian cloud ID:
```
Use: mcp_atlassian_atl_getAccessibleAtlassianResources
```

### Step 2: Query Assigned Issues
Use JQL to search for assigned issues:
```
Use: mcp_atlassian_atl_searchJiraIssuesUsingJql

JQL: assignee = currentUser() AND status IN ("In Progress", "Backlog", "To Do", "Selected for Development", "Open") ORDER BY updated DESC

Fields: ["summary", "status", "issuetype", "priority", "created", "updated", "assignee"]
MaxResults: 50
```

### Step 3: Query Recent Mentions (Past Week)
Use JQL to search for mentions:
```
Use: mcp_atlassian_atl_searchJiraIssuesUsingJql

JQL: text ~ currentUser() AND updated >= -7d ORDER BY updated DESC

Fields: ["summary", "status", "issuetype", "priority", "updated"]
MaxResults: 25
```

### Step 3a: Retrieve Comments for Mentioned Issues
For each issue from Step 3, retrieve the comments to find where the user was mentioned:
```
Use: activate_jira_issue_management_tools (to access comment tools)
Then use: mcp_atlassian_atl_getJiraIssueComments for each issue

Extract and display the specific comment(s) where the current user was mentioned
```

### Step 4: Format and Display Results
Present the results in a clear, organized format:
- Group by status
- Show ALL issues individually - never summarize or group issues together
- Include issue key, summary, project name, priority for each ticket
- List every single ticket - do not use phrases like "and 13 more tasks" or summarize groups
- Include direct links to each issue
- Highlight any high-priority or urgent items

## Output Format

**My Assigned Tasks** (X issues)
- **In Progress** (Y)
  - **KEY-123** - Summary text (Project Name) - Priority: High
  - **KEY-124** - Another summary (Project Name) - Priority: Medium
  - (list ALL tickets individually, no summarization)
- **Backlog** (Z)
  - **KEY-200** - Task summary (Project Name) - Priority: Low
  - **KEY-201** - Another task (Project Name) - Priority: Medium
  - (list ALL tickets individually, no summarization)

**Recent Mentions** (N issues from past 7 days)
- **KEY-456** - Summary text (Project Name) - Status: In Progress - Updated: Yesterday
  - 💬 Comment: "Hey @username, can you review this?" - By: John Doe - Date: Jan 14, 2026
- **KEY-457** - Another issue (Project Name) - Status: To Do
  - 💬 Comment: "Tagging @username for visibility" - By: Jane Smith - Date: Jan 13, 2026
- (list ALL mentioned tickets with their relevant comments)

---

## Notes
- Uses Atlassian MCP server connection configured in VS Code
- Requires valid ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, and ATLASSIAN_DOMAIN in mcp.json
- Cloud ID is typically extracted from the domain (akumina.atlassian.net)