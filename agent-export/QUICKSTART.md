# Quick Start Guide

Get started with Akumina custom agents in 5 minutes.

## ⚡ For Codex Users

### Step 1: Copy Files (30 seconds)
```powershell
cd "{YOUR_WORKSPACE}"

# Create .github directory if it doesn't exist
New-Item -Path ".\.github\" -ItemType Directory -Force

# Copy agents
Copy-Item -Path "{EXPORT_PATH}\agents" -Destination ".\.github\agents" -Recurse -Force

# Copy skills
Copy-Item -Path "{EXPORT_PATH}\skills" -Destination ".\.github\skills" -Recurse -Force
```

### Step 2: Add to Copilot Instructions (2 minutes)

Create or edit `.github/copilot-instructions.md` and add:

```markdown
<agents>
<agent>
<name>Scott</name>
<description>Tech lead for implementation work</description>
</agent>
<agent>
<name>Theri</name>
<description>PM for Jira task management with MCP Atlassian</description>
</agent>
</agents>

<skills>
<skill>
<name>plan-my-day</name>
<description>Jira task planning with CSV caching</description>
<file>.github/skills/plan-my-day/SKILL.md</file>
</skill>
</skills>
```

### Step 3: Try It! (1 minute)
```
@Scott: What's in my workspace?
@Theri: Show my tasks
Plan my day
```

## 🎯 Essential Agents

Start with these three:

### 1. Scott - Your Tech Lead
**Use for**: Implementation, code changes, feature work
```
@Scott: implement user authentication
@Scott: fix the navigation bug
```

### 2. Theri - Your Project Manager  
**Use for**: Jira tasks, planning, ticket management
```
@Theri: show my tasks
@Theri: what should I work on today?
```
**Requires**: Atlassian MCP server (see MCP Setup below)

### 3. Ren - Your QA Engineer
**Use for**: Testing, validation, browser automation
```
@Ren: run tests for login flow
@Ren: validate the new widget
```

## 🔌 MCP Setup (for Theri & plan-my-day)

### Install Atlassian MCP

1. Open VS Code Settings (Ctrl+,)
2. Search for "MCP"
3. Click "Edit in settings.json"
4. Add:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcpServers": {
    "atlassian": {
      "url": "https://mcp.atlassian.com/"
    }
  }
}
```

5. Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
6. When prompted, authenticate with Atlassian

### Verify MCP is Working
```
@Theri: show my Jira tasks
```

If you get 401 errors → Reload VS Code again

## 📋 Daily Workflow Example

### Morning Planning
```
Plan my day
```
Shows your Jira tasks cached locally (fast)

### Get Fresh Updates
```
Show my fresh tasks
Refresh my Jira assignments
```
Fetches from Jira and updates cache

### Start Work
```
@Scott: implement LAC-252
```
Scott handles the implementation

### Before Commit
```
@Ren: run tests for my changes
```
Ren validates your work

### Update Ticket
```
@Theri: add comment to LAC-252: "Implementation complete, ready for review"
```
Theri updates Jira

## 🗂️ Optional: Workspace Aliases

Create aliases for quick navigation:

**File**: `c:\{WORKSPACE}\workspace-aliases.md`

```markdown
## Aliases
- frontend -> C:/Code/MyApp/frontend/src
- backend -> C:/Code/MyApp/backend/api
- tests -> C:/Code/MyApp/tests

## Usage
frontend: add login component
backend/controllers: fix user endpoint
```

Then use:
```
frontend: implement the login form
backend: add email validation
```

## 🎨 Optional: Add More Agents

### For Multi-Repository Projects

**Andrew** - Widget source specialist  
**Jason** - Core framework specialist  
**Udai** - Backend/AppManager specialist  
**Luke** - Design and UX

Copy these agents when you need specialized expertise in different codebases.

## ⚙️ Advanced: Customize Agents

### Change Agent Scope
Edit `.github/agents/scott.agent.md`:

```yaml
---
name: Scott
description: Tech lead for MyProject
model: sonnet
---

# Update paths to match your workspace
- frontend -> C:/Code/MyApp/frontend
- backend -> C:/Code/MyApp/backend
```

### Add Project-Specific Rules
```markdown
## Project Conventions
- Always use TypeScript strict mode
- Follow airbnb style guide
- Write unit tests for all new features
```

## 🐛 Common Issues

### "Agent not found"
- Check file exists: `.github/agents/scott.agent.md`
- Agent name is case-sensitive: `@Scott` not `@scott`
- Reload VS Code after adding new agents

### "Skill not triggering"
- Check file path in copilot-instructions.md
- Use exact trigger phrases: "plan my day" not "show my plan"
- Verify SKILL.md file exists

### MCP Authentication Failed
- Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check MCP config: `%APPDATA%\Code\User\mcp.json`
- Verify internet connection to mcp.atlassian.com

### CSV Cache Not Found
- Check path in plan-my-day SKILL.md
- Use "fresh" to force Jira fetch: "show my **fresh** tasks"
- Verify directory exists: `C:\Code\MyProject\`

## 📚 Next Steps

1. ✅ Test basic agent invocation: `@Scott: hello`
2. ✅ Set up MCP for Jira integration
3. ✅ Try "Plan my day" skill
4. 📖 Read [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for customization
5. 📖 Read [README.md](README.md) for complete documentation

## 💡 Pro Tips

- **Cache is your friend**: Use cached Jira tasks for fast responses, force refresh only when needed
- **Agent routing**: Let Scott coordinate, he'll ask specialists (Andrew, Jason, Udai) when needed
- **Workspace aliases**: Set up aliases once, save typing forever
- **Model preferences**: Scott uses Sonnet (best quality), Luke/Ren use Haiku (fast & cheap)

---

**Version**: 1.0  
**Export Date**: March 19, 2026  
**Ready to use**: Yes ✅
