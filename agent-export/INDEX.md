# Akumina Agents Export Package - START HERE

**📦 Package Version**: 1.0  
**📅 Export Date**: March 19, 2026  
**📊 Total Size**: 68.69 KB  
**📁 Total Files**: 17  
**✅ Status**: Ready to Use

---

## 🚀 For Codex: Quick Start in 3 Steps

### Step 1: Copy to Your Workspace (30 seconds)
```powershell
# Navigate to your workspace
cd "C:\Your\Workspace"

# Copy agents
Copy-Item -Path "{THIS_EXPORT}\agents" -Destination ".\.github\agents" -Recurse -Force

# Copy skills
Copy-Item -Path "{THIS_EXPORT}\skills" -Destination ".\.github\skills" -Recurse -Force
```

### Step 2: Add to .github/copilot-instructions.md (2 minutes)
```markdown
<agents>
<agent><name>Scott</name><description>Tech lead for implementation</description></agent>
<agent><name>Theri</name><description>PM for Jira with MCP Atlassian</description></agent>
</agents>

<skills>
<skill>
<name>plan-my-day</name>
<description>Jira task planning</description>
<file>.github/skills/plan-my-day/SKILL.md</file>
</skill>
</skills>
```

### Step 3: Test (1 minute)
```
@Scott: What's in my workspace?
@Theri: Show my tasks
```

**Need Jira?** See [MCP Setup](#mcp-setup-for-jira-features) below.

---

## 📚 Documentation Guide

| Read This | When You Need To |
|-----------|------------------|
| **[QUICKSTART.md](QUICKSTART.md)** ⚡ | Get running in 5 minutes |
| **[README.md](README.md)** 📖 | Understand everything (complete reference) |
| **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** 🔧 | Customize for your setup |
| **[MANIFEST.md](MANIFEST.md)** 📋 | See what's included |

**Start with QUICKSTART.md** ← Most important for new users

---

## 🤖 What Agents Do

### Essential 3 (Start Here)

**1. Scott** - Your Tech Lead  
Implementation work, code changes, feature development
```
@Scott: implement login feature
@Scott: fix the navigation bug
```

**2. Theri** - Your Project Manager  
Jira tasks, planning, ticket management (requires MCP)
```
@Theri: show my tasks
@Theri: what should I work on?
Plan my day
```

**3. Ren** - Your QA Engineer  
Testing, validation, browser automation
```
@Ren: run tests
@Ren: validate the login flow
```

### Specialists (For Multi-Repo Projects)

**4. Andrew** - DigitalWorkplace-Widgets  
**5. Jason** - DigitalWorkplace-Core  
**6. Udai** - AppManager  
**7. Luke** - Design & UX

---

## 🎯 What Skills Do

### plan-my-day (Jira Integration)
**Triggers**: "plan my day", "show my tasks", "what's on my plate"  
**Features**:
- Fetches your Jira assignments
- Caches to CSV for offline access
- Project-specific filtering
- Fresh vs. cached modes

**Requires**: Atlassian MCP server (see setup below)

### create-runbook (Document Generation)
**Triggers**: "create runbook", "generate deployment docs"  
**Features**:
- Generates client deployment runbooks
- Outputs Markdown + DOCX
- Template-based formatting

**Requires**: Node.js + `docx` package

---

## 🔌 MCP Setup (for Jira Features)

### Quick MCP Installation

1. **Add to VS Code settings.json**:
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

2. **Reload VS Code**: `Ctrl+Shift+P` → "Developer: Reload Window"

3. **Authenticate** when prompted

4. **Test**: `@Theri: show my tasks`

### If MCP Auth Expires (401 errors)
Just reload VS Code again: `Ctrl+Shift+P` → "Developer: Reload Window"

---

## 📁 Package Structure

```
agent-export/
├── 📄 INDEX.md ← You are here
├── 📄 QUICKSTART.md ← Start here for setup
├── 📄 README.md ← Complete documentation
├── 📄 INTEGRATION_GUIDE.md ← Customization guide
├── 📄 MANIFEST.md ← Package inventory
├── 📄 workspace-aliases-example.md
├── 📁 agents/ (7 files)
│   ├── scott.agent.md
│   ├── theri.agent.md
│   ├── andrew.agent.md
│   ├── jason.agent.md
│   ├── udai.agent.md
│   ├── ren.agent.md
│   └── luke.agent.md
└── 📁 skills/ (2 complete skills)
    ├── plan-my-day/
    │   └── SKILL.md
    └── create-runbook/
        ├── SKILL.md
        ├── assets/RUNBOOK_TEMPLATE.md
        ├── scripts/convert-runbook.js
        └── agents/openai.yaml
```

---

## ⚙️ Customization Required

### 🎯 Must Update (Before Using)

1. **Agent Paths** - Update in each `.agent.md` file:
   ```
   OLD: C:/Git/Akumina/DigitalWorkplace-Widgets/...
   NEW: C:/Your/Workspace/Path/...
   ```

2. **Jira Config** (if using Theri):
   - Update Cloud ID in `theri.agent.md`
   - Update instance URL: `https://your-company.atlassian.net`

3. **CSV Cache Paths** (if using plan-my-day):
   - Update cache locations in `skills/plan-my-day/SKILL.md`

### 💡 Optional Updates

4. **Workspace Aliases** - Create shortcuts for your projects
5. **Model Preferences** - Change agent model (sonnet/haiku)

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for details.

---

## 🧪 Testing Your Setup

### Basic Test (No MCP Required)
```
@Scott: list files in this workspace
@Scott: what's the project structure?
```
✅ Should work immediately after copying agents

### Jira Test (Requires MCP)
```
@Theri: show my tasks
Plan my day
```
✅ Should work after MCP setup

### Full Workflow Test
```
1. Plan my day
2. @Scott: implement {task from list}
3. @Ren: validate my changes
4. @Theri: update ticket {task-key}
```

---

## 🐛 Troubleshooting

### "Agent not found"
- ✅ Check `.github/agents/` directory exists
- ✅ Verify agent name in copilot-instructions.md
- ✅ Agent names are case-sensitive: `@Scott` not `@scott`

### "MCP authentication failed" (Theri)
- ✅ Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
- ✅ Check MCP config in settings.json
- ✅ Verify internet connection

### "Skill not triggering"
- ✅ Check file path in copilot-instructions.md
- ✅ Use exact trigger phrases
- ✅ Verify SKILL.md file exists

**More help**: See [README.md](README.md) Troubleshooting section

---

## 💡 Pro Tips

1. **Use cached tasks** for fast responses: `Show my tasks`
2. **Force refresh** only when needed: `Show my **fresh** tasks`
3. **Let Scott coordinate** - he'll delegate to specialists automatically
4. **Set up aliases once** - save typing forever
5. **Reload VS Code** fixes most MCP auth issues

---

## 📊 Daily Workflow Example

```
Morning:
  Plan my day                    → See your tasks (cached, instant)
  
Start Work:
  @Scott: implement LAC-252      → Implementation
  
Before Commit:
  @Ren: test my changes          → Validation
  
Update Jira:
  @Theri: add comment to LAC-252 → Ticket update
  
Get Updates:
  Refresh my Jira tasks          → Update cache
```

---

## 🎓 Learning Path

1. ✅ **Copy files** (30 sec)
2. ✅ **Update copilot-instructions.md** (2 min)
3. ✅ **Test basic agents**: `@Scott: test` (1 min)
4. 📖 **Read [QUICKSTART.md](QUICKSTART.md)** (5 min)
5. 🔌 **Set up MCP** for Jira features (5 min)
6. ✅ **Test Jira**: `Plan my day` (1 min)
7. 📖 **Read [README.md](README.md)** for advanced features (15 min)
8. 🎯 **Customize** paths and aliases (15 min)
9. 🚀 **Use daily** - integrate into workflow

**Total Time**: ~30 minutes to fully set up and understand

---

## ✅ Ready to Use

This package is **complete and tested**. All agents and skills are production-ready.

### What Works Out of the Box
- ✅ All 7 agents (basic invocation)
- ✅ Agent routing and delegation
- ✅ Specialist scoped search/edit

### Requires Setup
- 🔌 Jira integration (Theri + plan-my-day) → Needs MCP
- 🔌 Document generation (create-runbook) → Needs Node.js

### Requires Customization
- ⚙️ Agent workspace paths
- ⚙️ Jira Cloud ID and instance URL
- ⚙️ CSV cache locations
- ⚙️ Workspace aliases (optional)

---

## 📞 Next Steps

### New to Agents?
👉 **Start here**: [QUICKSTART.md](QUICKSTART.md)

### Need Complete Reference?
👉 **Read this**: [README.md](README.md)

### Ready to Customize?
👉 **Follow this**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

### Want Package Details?
👉 **Check this**: [MANIFEST.md](MANIFEST.md)

---

**Version**: 1.0  
**Status**: ✅ Ready for Production  
**Compatibility**: VS Code + GitHub Copilot  
**Last Updated**: March 19, 2026

**Questions?** See [README.md](README.md) or [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
