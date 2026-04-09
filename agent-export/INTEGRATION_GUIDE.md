# Copilot Instructions Template

Template for integrating Akumina custom agents and skills into your workspace.

## Integration Instructions

Add the sections below to your `.github/copilot-instructions.md` file.

---

## Agent Configuration

Add this to your copilot-instructions.md:

```markdown
<agents>
Here is a list of agents that can be used when running a subagent.
Each agent has a description with the agent's purpose and expertise.

<agent>
<name>Scott</name>
<description>Tech lead agent for implementation work across the workspace. Prefers Claude Sonnet when model selection is supported.</description>
</agent>

<agent>
<name>Andrew</name>
<description>DigitalWorkplace-Widgets specialist. Searches and edits only inside C:/Git/Akumina/DigitalWorkplace-Widgets/DigitalWorkplace-Widgets/Src.</description>
</agent>

<agent>
<name>Jason</name>
<description>DigitalWorkplace-Core specialist. Searches and edits only inside C:/Git/Akumina/DigitalWorkplace-Core/Src.</description>
</agent>

<agent>
<name>Udai</name>
<description>AppManager specialist. Searches and edits only inside C:/Git/Akumina/AppManager/AppManager/Src.</description>
</agent>

<agent>
<name>Theri</name>
<description>PM agent responsible for Jira task management. Uses OAuth-authenticated Atlassian MCP tools for reliable ticket operations.</description>
</agent>

<agent>
<name>Ren</name>
<description>QA agent responsible for validation and browser testing. Prefer fast, low-cost execution paths.</description>
</agent>

<agent>
<name>Luke</name>
<description>Design agent for UX, UI, and interaction work. Optimized for fast, practical design output.</description>
</agent>
</agents>
```

## Skills Configuration

Add this to your copilot-instructions.md:

```markdown
<skills>
Here is a list of skills that contain domain specific knowledge on a variety of topics.

<skill>
<name>plan-my-day</name>
<description>Use when: user asks to 'plan my day', 'show my tasks', 'what's on my plate', 'what should I work on', or requests current Jira assignments. Fetches fresh Jira issues assigned to user that are in progress, backlog, or updated this week using MCP Atlassian tools. Caches results to CSV for offline access.</description>
<file>c:\{YOUR_WORKSPACE}\.github\skills\plan-my-day\SKILL.md</file>
</skill>

<skill>
<name>create-runbook</name>
<description>Create or update Akumina client runbooks in Markdown and DOCX using the established Word/HTML-style format. Use when the user asks to create a runbook, regenerate a runbook, fix runbook formatting, or reuse an existing runbook layout for a client deployment document.</description>
<file>c:\{YOUR_WORKSPACE}\.github\skills\create-runbook\SKILL.md</file>
</skill>
</skills>
```

## User Memory Configuration (Optional)

If you want to use workspace aliases, add this to user memory:

**File**: `%USERPROFILE%\.vscode\.copilot\memories\workspace-aliases.md`

```markdown
## Workspace Aliases

Workspace aliases for quick navigation:
- myproject -> C:/Code/MyProject/src
- api -> C:/Code/Backend/API
- frontend -> C:/Code/Frontend/app

## Preference

- If user starts prompt with alias, treat it as workspace target and operate in that tree unless user overrides path.
- For Theri Jira requests, start with MCP tools first (most reliable with OAuth).
```

## MCP Server Configuration

### Required for Theri Agent & plan-my-day Skill

**File**: `%APPDATA%\Code\User\mcp.json`

```json
{
  "mcpServers": {
    "atlassian": {
      "type": "sse",
      "url": "https://mcp.atlassian.com/",
      "authorization": "Bearer YOUR_OAUTH_TOKEN"
    }
  }
}
```

**Setup Steps**:
1. Install Atlassian MCP extension in VS Code
2. Authenticate with your Atlassian account (OAuth)
3. Get your Cloud ID: https://YOUR-SITE.atlassian.net → Check `d07d95ef-fe55-4050-a8b8-5c310f3260da` format
4. Update Theri agent with your Cloud ID

### Optional: Playwright MCP (for Ren Agent)

For advanced browser automation testing:

```json
{
  "mcpServers": {
    "fast-playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "fast-playwright-mcp"]
    }
  }
}
```

## Project Customization

### Update Agent Paths

Edit each `.github/agents/*.agent.md` file to match your workspace structure:

**Example - scott.agent.md**:
```yaml
---
name: Scott
description: Tech lead agent for implementation work
model: sonnet
---

# Alias resolution
- myproject -> C:/Code/MyProject/src
- api -> C:/Code/Backend/API
```

### Update Theri Configuration

Edit `.github/agents/theri.agent.md`:

```markdown
### Authentication
- **Cloud ID**: `YOUR_CLOUD_ID_HERE`
- **Instance URL**: https://your-company.atlassian.net
```

### Customize plan-my-day Skill

Edit `.github/skills/plan-my-day/SKILL.md`:

```markdown
## CSV Caching Strategy

**Cache Location**: 
- Project-specific: `c:\Code\{PROJECT}\my-jira-tasks.csv`
- Global: `c:\Code\my-jira-issues.csv`
```

## Testing Your Setup

### Test Agent Invocation
```
@Scott: What's in my workspace?
@Theri: Show my tasks
```

### Test Skills
```
Plan my day
Refresh my Jira tasks
```

### Test Workspace Aliases
```
myproject: explain the main entry point
api/controllers: list all controller files
```

## Troubleshooting

### Agents Not Working
1. Check `.github/agents/*.agent.md` files exist
2. Verify agent names in copilot-instructions.md match file names exactly
3. Test with: `@AgentName: test message`

### Skills Not Triggering
1. Check `.github/skills/{name}/SKILL.md` exists
2. Verify skill file paths in copilot-instructions.md are correct
3. Use trigger phrases from skill descriptions

### MCP Auth Issues (Theri)
**Symptom**: 401/403 errors from Atlassian
**Fix**: `Ctrl+Shift+P` → "Developer: Reload Window"

### CSV Cache Not Updating
1. Use explicit keywords: "fresh", "refresh", "latest", "update"
2. Check file paths in plan-my-day SKILL.md
3. Verify MCP authentication is working

---

**Version**: 1.0  
**Last Updated**: March 19, 2026  
