# Workspace Scripts

## 🚀 Performance Optimizations (NEW!)

**See [PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md) for complete documentation.**

### Quick Summary
- **6x faster deployments** (2-3 min → ~30s)
- **10x faster Jira fetching** (22s → 2s)
- JQL batch queries + intelligent caching
- Parallel operations support

### Key Tools
- **[utils/jira-batch-fetch.js](utils/jira-batch-fetch.js)**: Batch Jira ticket fetching with JQL
- **[optimized-deployment.js](optimized-deployment.js)**: Complete optimized deployment workflow
- **[cache-manager.ps1](cache-manager.ps1)**: Enhanced caching utility

### Quick Start
```bash
# Batch fetch Jira tickets
node scripts/utils/jira-batch-fetch.js fetch LAC-219,LAC-220,LAC-221

# Check cache stats
node scripts/utils/jira-batch-fetch.js stats

# View cache statistics
.\scripts\cache-manager.ps1 -Action Stats
```

---

## get-my-jira-tickets.ps1

This PowerShell script automatically runs when you open the workspace and displays quick links to your Jira issues.

### What it does:
- Displays links to your In Progress/Backlog Jira issues
- Displays links to issues where you were mentioned this week
- Provides tips for using Copilot with Atlassian MCP

### Manual Usage:
You can also run the task manually from VS Code:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Get My In Progress Jira Tickets"

### To Auto-Open in Browser:
Uncomment the last line in `get-my-jira-tickets.ps1`:
```powershell
Start-Process $inProgressUrl
```

### Alternative Task:
Use the "Open My Jira Issues in Browser" task to directly open your issues in the browser without the terminal output.
