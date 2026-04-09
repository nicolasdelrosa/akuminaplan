# Package Manifest

**Export Date**: March 19, 2026  
**Version**: 1.0  
**Source Workspace**: C:\AkuminaPlan

## 📦 Package Contents

### Documentation (Root Level)
- ✅ `README.md` - Complete documentation and usage guide (8.9 KB)
- ✅ `QUICKSTART.md` - 5-minute setup guide for quick start (5.6 KB)
- ✅ `INTEGRATION_GUIDE.md` - Detailed integration instructions (6.1 KB)
- ✅ `MANIFEST.md` - This file - complete package inventory

### Configuration Examples
- ✅ `workspace-aliases-example.md` - Workspace routing template (2.3 KB)

### Agents (`.github/agents/`)
All 7 custom agents included:

| Agent | File | Size | Description |
|-------|------|------|-------------|
| Scott | `scott.agent.md` | 2.4 KB | Tech lead, implementation coordinator |
| Andrew | `andrew.agent.md` | 2.4 KB | DigitalWorkplace-Widgets specialist |
| Jason | `jason.agent.md` | 2.1 KB | DigitalWorkplace-Core specialist |
| Udai | `udai.agent.md` | 2.2 KB | AppManager specialist |
| Theri | `theri.agent.md` | 3.8 KB | PM, Jira management (MCP Atlassian) |
| Ren | `ren.agent.md` | 1.5 KB | QA, browser testing |
| Luke | `luke.agent.md` | 1.5 KB | Design and UX |

**Total Agents**: 7 files, ~16.3 KB

### Skills (`.github/skills/`)

#### plan-my-day (Jira Task Management)
- ✅ `SKILL.md` - Main skill implementation (6.6 KB)
- **Features**:
  - MCP Atlassian integration
  - CSV caching for offline access
  - Project-specific task filtering
  - Fresh/cached data modes

#### create-runbook (Client Runbook Generation)
- ✅ `SKILL.md` - Main skill implementation (1.8 KB)
- ✅ `assets/RUNBOOK_TEMPLATE.md` - Runbook template (3.2 KB)
- ✅ `scripts/convert-runbook.js` - Markdown to DOCX converter (9.8 KB)
- ✅ `agents/openai.yaml` - OpenAI agent configuration (2.6 KB)
- **Features**:
  - Generates Markdown and DOCX runbooks
  - Akumina deployment format
  - Automated document conversion

**Total Skills**: 2 complete skills with supporting files

## 🎯 Core Capabilities

### Agent Routing & Coordination
- ✅ Multi-repository workspace support
- ✅ Automatic specialist delegation (Scott → Andrew/Jason/Udai)
- ✅ Workspace alias resolution
- ✅ Model preference configuration (Sonnet/Haiku)

### Jira Integration (Theri + plan-my-day)
- ✅ OAuth-authenticated MCP Atlassian
- ✅ JQL query support
- ✅ CSV caching strategy (project-specific + global)
- ✅ Fresh vs. cached data modes
- ✅ Auto-reload on auth expiry

### Code Specialization
- ✅ Scoped agent search/edit (prevents cross-contamination)
- ✅ Tool restrictions per agent
- ✅ Coordinated multi-agent workflows

### Testing & QA
- ✅ Playwright CLI integration (Ren)
- ✅ Playwright MCP support (optional)
- ✅ Cost-optimized test execution

### Document Generation
- ✅ Client runbook creation
- ✅ Markdown → DOCX conversion
- ✅ Template-based formatting

## 📋 Requirements

### Minimum Setup
- VS Code with GitHub Copilot
- GitHub Copilot Chat enabled
- `.github/` directory in workspace

### For Jira Features (Theri + plan-my-day)
- ✅ Atlassian MCP server configuration
- ✅ OAuth authentication with Atlassian
- ✅ Jira Cloud ID configured in Theri agent
- ✅ VS Code reload capability for MCP auth refresh

### For Document Generation (create-runbook)
- ✅ Node.js installed
- ✅ `docx` npm package (for DOCX conversion)

### Optional
- ✅ Playwright MCP (for advanced browser testing)
- ✅ Git worktrees support (for multi-branch workflows)

## 🚀 Deployment Checklist

Copy this export package to target workspace and:

- [ ] Copy `agents/` to `.github/agents/`
- [ ] Copy `skills/` to `.github/skills/`
- [ ] Create or update `.github/copilot-instructions.md`
  - [ ] Add `<agents>` section
  - [ ] Add `<skills>` section with correct file paths
- [ ] Update agent file paths in each `.agent.md`
- [ ] Configure workspace aliases (optional)
- [ ] Set up Atlassian MCP for Jira features (if needed)
  - [ ] Install Atlassian MCP extension
  - [ ] Authenticate with OAuth
  - [ ] Update Cloud ID in `theri.agent.md`
  - [ ] Update Cloud ID in `skills/plan-my-day/SKILL.md`
- [ ] Test agent invocation: `@Scott: test`
- [ ] Test skill invocation: `Plan my day`
- [ ] Verify CSV cache locations exist (or will be created)

## 📊 Usage Statistics (from Source Workspace)

### Agent Usage Patterns
- **Scott**: Most frequently used, general implementation
- **Theri**: Daily planning, ticket management
- **Andrew/Jason/Udai**: Specialist consultation as needed
- **Ren**: Pre-commit validation
- **Luke**: Design reviews

### Skill Triggers
- **plan-my-day**: Daily planning, task review
- **create-runbook**: Client deployments, documentation

### CSV Cache Strategy
- Project-specific caches: `C:\Git\{PROJECT}\{PROJECT}\my-jira-tasks.csv`
- Global cache: `C:\AkuminaPlan\my-jira-issues.csv`
- Cache lifetime: 24 hours
- Force refresh: Use "fresh", "refresh", "latest", "update" keywords

## 🔧 Customization Points

### Agent Scope (Must Customize)
Each agent has hardcoded paths to Akumina workspace:
```
C:/Git/Akumina/DigitalWorkplace-Widgets/DigitalWorkplace-Widgets/Src
C:/Git/Akumina/DigitalWorkplace-Core/Src
C:/Git/Akumina/AppManager/AppManager/Src
```
**Action Required**: Update these paths in agent files to match your workspace

### Workspace Aliases (Optional)
Default aliases reference Akumina projects:
- `lac` → LA Courts
- `smk` → JM Smuckers  
- `ufa` → UFA
- `pb` → Pomerleau

**Action Required**: Replace with your project aliases in `workspace-aliases-example.md`

### Jira Configuration (If Using Theri)
Default configuration:
- Cloud ID: `d07d95ef-fe55-4050-a8b8-5c310f3260da` (Akumina)
- Instance: https://akumina.atlassian.net

**Action Required**: Update with your Jira instance details

### CSV Cache Paths (If Using plan-my-day)
Default paths reference `C:\Git\{PROJECT}\` structure

**Action Required**: Update cache paths in `skills/plan-my-day/SKILL.md`

## 📁 File Structure

```
agent-export/
├── README.md (main documentation)
├── QUICKSTART.md (5-min setup guide)
├── INTEGRATION_GUIDE.md (detailed setup)
├── MANIFEST.md (this file)
├── workspace-aliases-example.md (configuration template)
├── agents/
│   ├── scott.agent.md (tech lead)
│   ├── andrew.agent.md (widgets specialist)
│   ├── jason.agent.md (core specialist)
│   ├── udai.agent.md (appmanager specialist)
│   ├── theri.agent.md (PM, Jira)
│   ├── ren.agent.md (QA, testing)
│   └── luke.agent.md (design, UX)
└── skills/
    ├── plan-my-day/
    │   └── SKILL.md (Jira task management)
    └── create-runbook/
        ├── SKILL.md (runbook generation)
        ├── assets/
        │   └── RUNBOOK_TEMPLATE.md
        ├── scripts/
        │   └── convert-runbook.js
        └── agents/
            └── openai.yaml
```

## 🎓 Documentation Index

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| README.md | Complete reference, troubleshooting | All users |
| QUICKSTART.md | Fast setup, get running in 5 min | New users, Codex |
| INTEGRATION_GUIDE.md | Detailed integration steps | System administrators |
| MANIFEST.md | Package contents, inventory | Package reviewers |
| workspace-aliases-example.md | Configuration template | Workspace customizers |

## ✅ Quality Checklist

- [x] All 7 agents exported
- [x] Both skills exported with supporting files
- [x] Documentation complete (README, QUICKSTART, INTEGRATION_GUIDE)
- [x] Configuration examples included
- [x] MCP setup instructions provided
- [x] Troubleshooting guide included
- [x] Customization points documented
- [x] File structure organized and logical
- [x] Usage examples provided
- [x] Agent collaboration patterns explained

## 📞 Support & Next Steps

### Getting Help
1. Start with [QUICKSTART.md](QUICKSTART.md) for fast setup
2. Read [README.md](README.md) for complete documentation
3. Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for customization
4. Review agent `.md` files for specific agent capabilities

### Integration Path
1. ✅ **Setup** (5 min): Copy files, add to copilot-instructions.md
2. ✅ **Test** (2 min): Try `@Scott: test` and `Plan my day`
3. ✅ **Customize** (15 min): Update paths, aliases, Jira config
4. ✅ **Deploy** (ongoing): Use in daily workflow

## 🔄 Version History

### v1.0 (March 19, 2026)
- Initial export from AkuminaPlan workspace
- 7 agents (Scott, Andrew, Jason, Udai, Theri, Ren, Luke)
- 2 skills (plan-my-day, create-runbook)
- Complete documentation suite
- Ready for production use

---

**Package Status**: ✅ Complete and Ready  
**Total Size**: ~50 KB (all files)  
**Compatibility**: VS Code + GitHub Copilot  
**License**: Custom agents for Akumina workflows
