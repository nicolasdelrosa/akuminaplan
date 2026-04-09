# Akumina Custom Agents & Skills Export

Complete package of custom GitHub Copilot agents and skills for Akumina development workflows.

## 📦 Package Contents

### Agents (`.github/agents/`)
- **Scott** - Tech lead for implementation work across workspace
- **Andrew** - DigitalWorkplace-Widgets specialist
- **Jason** - DigitalWorkplace-Core specialist  
- **Udai** - AppManager specialist
- **Theri** - PM for Jira task management (MCP Atlassian integration)
- **Ren** - QA and browser testing specialist
- **Luke** - Design and UX support

### Skills (`.github/skills/`)
- **plan-my-day** - Jira task management with CSV caching (MCP Atlassian)
- **create-runbook** - Generate client runbooks in Markdown and DOCX

### Configuration Files
- **workspace-aliases.md** - Workspace routing and alias rules
- **copilot-instructions.md** - Main Copilot configuration template

## 🚀 Quick Setup

### Step 1: Copy Agents
```powershell
# Copy agent files to your workspace
Copy-Item -Path ".\agents\" -Destination "{YOUR_WORKSPACE}\.github\agents\" -Recurse -Force
```

### Step 2: Copy Skills
```powershell
# Copy skill files to your workspace
Copy-Item -Path ".\skills\" -Destination "{YOUR_WORKSPACE}\.github\skills\" -Recurse -Force
```

### Step 3: Configure Workspace Aliases (Optional)
Copy `workspace-aliases.md` to your workspace root and customize paths for your projects.

### Step 4: Update Copilot Instructions
Add the agent configuration to your `.github/copilot-instructions.md`:

```markdown
<agents>
Here is a list of agents that can be used when running a subagent.

<agent>
<name>Scott</name>
<description>Tech lead agent for implementation work across the workspace.</description>
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

<skills>
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

## 🎯 Usage Examples

### Invoke Agents
```
@Scott: implement the user profile widget callback
@Theri: show my LAC tasks
@Andrew: inspect widget X callback lifecycle
@Ren: run Playwright tests for JMSMUC-194
```

### Use Skills
```
Plan my day
Refresh my Jira tasks for LAC
Create a runbook for UFA deployment
```

### Workspace Aliases (if configured)
```
lac: add release notes for LAC-233
widgets: fix spotlight widget race condition
pb/tests: update test selectors
```

## 🔧 MCP Server Requirements

### Theri Agent & plan-my-day Skill
Requires **Atlassian MCP server** configured in VS Code:

**MCP Config Location**: `%APPDATA%\Code\User\mcp.json`

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

**Authentication**: OAuth (automatically managed by VS Code)  
**Cloud ID**: `d07d95ef-fe55-4050-a8b8-5c310f3260da` (Akumina instance)  
**Instance URL**: https://akumina.atlassian.net

If MCP auth expires (401/403 errors): Reload VS Code with `Ctrl+Shift+P` → "Developer: Reload Window"

### Ren Agent (Optional)
Can use **Playwright MCP server** for advanced browser automation:
- Requires `fast-playwright` MCP server configuration
- See `.github/skills/plan-my-day/SKILL.md` for setup details

## 📝 Customization

### Adjust Agent Scope
Edit each `.agent.md` file to customize:
- Workspace paths
- Tool restrictions
- Model preferences (sonnet, haiku)
- Role descriptions

### Modify Skills
Edit skill files in `.github/skills/{skill-name}/SKILL.md` to:
- Change JQL queries (Theri/plan-my-day)
- Update project conventions
- Add custom CSV cache locations

### Update Aliases
Edit `workspace-aliases.md` to define your project shortcuts:
```markdown
- myproject -> C:/Code/MyProject/src
- api -> C:/Code/Backend/API
```

## 📚 Agent Responsibilities

| Agent | Scope | Use When |
|-------|-------|----------|
| Scott | Tech lead, cross-workspace | Default implementation coordinator |
| Andrew | DigitalWorkplace-Widgets/Src | Widget source code analysis |
| Jason | DigitalWorkplace-Core/Src | Core framework logic |
| Udai | AppManager/Src | Backend integration, Azure Functions |
| Theri | Jira (MCP) | Task management, planning, ticket updates |
| Ren | Testing, Playwright | QA validation, browser automation |
| Luke | Design, UX | Layout, visual direction, design system |

## 🔄 Agent Collaboration Pattern

Example workflow for widget implementation:
1. **Scott** receives request from client project (e.g., `lac`)
2. **Scott** inspects client integration code
3. **Scott** asks **Andrew** for widget source context
4. **Andrew** analyzes widget and may ask **Jason** for Core framework details
5. **Scott** coordinates implementation back in client project
6. **Ren** validates with tests
7. **Theri** creates Jira deployment ticket

## 📋 CSV Cache Strategy (plan-my-day)

**Locations**:
- Project-specific: `C:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv`
- Global: `C:\AkuminaPlan\my-jira-issues.csv`

**Triggers**:
- "fresh", "refresh", "latest", "update" → Fetch from Jira (MCP)
- Default request → Use cache if < 24 hours old
- Cache missing/stale → Auto-fetch from Jira

**Format**:
```csv
# Updated: 2026-03-19 14:30:00
Key,Summary,Status,Priority,Type,Project,Created,Updated
LAC-252,Provide runbook,To Do,Medium,Task,LA Courts,2026-03-17,2026-03-18
```

## 🎓 Learning Resources

- **GitHub Copilot Agents**: https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Atlassian MCP**: https://github.com/modelcontextprotocol/servers/tree/main/src/atlassian
- **Custom Agent YAML**: https://code.visualstudio.com/docs/copilot/copilot-customization

## 🐛 Troubleshooting

### MCP Authentication Failures
**Symptom**: Theri returns 401/403 errors  
**Fix**: Reload VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")

### Agent Not Invoked
**Check**:
1. Agent file exists in `.github/agents/{name}.agent.md`
2. Agent listed in copilot-instructions.md `<agents>` section
3. Agent name matches exactly (case-sensitive)

### Skill Not Triggered
**Check**:
1. Skill file exists in `.github/skills/{name}/SKILL.md`
2. Skill listed in copilot-instructions.md `<skills>` section
3. Description includes trigger phrases used in request

### CSV Cache Not Updating
**Check**:
1. Path exists: `C:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv`
2. Use explicit refresh keyword: "show my **fresh** LAC tasks"
3. MCP authentication is working (see above)

## 📞 Support

For issues specific to:
- **Agent configuration**: Review `.agent.md` YAML frontmatter
- **MCP setup**: Check `%APPDATA%\Code\User\mcp.json`
- **Jira integration**: Verify Cloud ID and instance URL in Theri agent

## 📄 License

Custom agents and skills developed for Akumina workflow automation.  
Shared for use with GitHub Copilot in VS Code.

---

**Version**: 1.0  
**Last Updated**: March 19, 2026  
**Workspace**: AkuminaPlan
