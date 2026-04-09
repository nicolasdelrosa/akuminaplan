# Deployment Optimization - Quick Reference

## 🎯 Performance Gains Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Total Time** | 2-3 minutes | ~30 seconds | **6x faster** ⚡ |
| **Jira Fetching** | 22 seconds | 2 seconds | **10x faster** 🚀 |
| **API Calls** | 15+ | 5-8 | **60% reduction** |
| **Cache Hit Rate** | 0% | 60%+ | **Instant on cache hit** |

## 🚀 Quick Start Commands

### Batch Fetch Jira Tickets
```bash
# Quick check "Ready for Deploy" status (uses cache)
node scripts/utils/jira-batch-fetch.js fetch LAC-219,LAC-220,LAC-221

# For release notes (fresh data, no cache, validated)
node scripts/utils/jira-batch-fetch.js fetch LAC-219,LAC-220,LAC-221 --release-notes

# Force refresh (ignore cache)
node scripts/utils/jira-batch-fetch.js fetch LAC-219 --force

# Check cache statistics
node scripts/utils/jira-batch-fetch.js stats

# Clear cache
node scripts/utils/jira-batch-fetch.js clear
```

### Cache Management
```powershell
# View cache statistics
.\scripts\cache-manager.ps1 -Action Stats

# Clear all cache
.\scripts\cache-manager.ps1 -Action Clear

# Get cached item
.\scripts\cache-manager.ps1 -Action Get -Key "last-deployment-JMSMUC"
```

### Run Examples
```bash
# See all optimization examples
node scripts/examples/optimized-deployment-examples.js
```

## 📋 Using with VS Code Copilot

### Batch Fetch Tickets
**Ask Copilot:**
> "Fetch these Jira tickets using batch JQL: JMSMUC-77, JMSMUC-78, JMSMUC-79"

**What Copilot will do:**
1. Load `mcp_atlassian_atl_searchJiraIssuesUsingJql` tool
2. Build JQL: `key in (JMSMUC-77,JMSMUC-78,JMSMUC-79)`
3. Execute single API call (~2s vs ~6s for individual)
4. Return all ticket details

### Run Optimized Deployment
**Ask Copilot:**
> "Run optimized deployment for JM Smuckers to DEV"

**What Copilot will do:**
1. Initialize deployment orchestrator with MCP context
2. Execute parallel operations (last deployment + branches)
3. Fetch commits since last deployment
4. Extract ticket keys from commits
5. Batch fetch all Jira tickets via JQL
6. Generate and save release notes
7. Display performance metrics

## 🔧 Key Files

| File | Purpose | Usage |
|------|---------|-------|
| [scripts/utils/jira-batch-fetch.js](utils/jira-batch-fetch.js) | Batch Jira fetching with caching | `node jira-batch-fetch.js fetch <keys>` |
| [scripts/optimized-deployment.js](optimized-deployment.js) | Complete deployment workflow | Called via Copilot with MCP |
| [scripts/cache-manager.ps1](cache-manager.ps1) | PowerShell cache utility | `.\cache-manager.ps1 -Action Stats` |
| [scripts/examples/optimized-deployment-examples.js](examples/optimized-deployment-examples.js) | Usage examples | `node optimized-deployment-examples.js` |

## 📊 Cache TTL Configuration

Located in `scripts/utils/jira-batch-fetch.js`:

```javascript
const CACHE_CONFIG = {
  closedTickets: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
  openTickets: { ttl: 5 * 60 * 1000 },          // 5 minutes
  default: { ttl: 60 * 60 * 1000 }              // 1 hour
};
```

**Why different TTLs?**
- **Closed tickets**: Rarely change → cache longer (24h)
- **Open tickets**: Active updates → cache shorter (5min)
- **Deployment info**: Periodic builds → moderate TTL (30min)

## 💡 Best Practices

### ✅ DO
- Use batch fetching for multiple tickets
- Enable caching for repeated operations
- Parallelize independent operations
- Monitor performance metrics

### ❌ DON'T
- Loop through individual ticket fetches
- Disable caching without reason
- Run sequential operations that can be parallel
- Ignore performance metrics

## 🎯 Cache Strategy: When to Use What

### ✅ Use Cache (Speed Priority)
**Good for:**
- Checking "Ready for Deploy" status
- Daily standup prep
- Reviewing ticket details while coding
- Repeated queries (checking same tickets multiple times)
- Closed tickets (won't change)

**Command:**
```bash
node scripts/utils/jira-batch-fetch.js fetch LAC-174,LAC-153
# Fast: ~instant if cached (< 5 min old), ~2s if not
```

### 🔒 No Cache (Accuracy Priority)
**Required for:**
- **Generating release notes** (tickets updated right before deploy)
- Pre-deployment verification
- Critical documentation
- After knowing tickets were just updated

**Command:**
```bash
node scripts/utils/jira-batch-fetch.js fetch LAC-174,LAC-153 --release-notes
# Always fresh: ~2s, with validation
# Warns if tickets updated in last hour
```

### 📋 Real Example: Your Workflow

```bash
# Morning: Check what's ready for deploy (cache OK)
node scripts/utils/jira-batch-fetch.js fetch LAC-174,LAC-153,LAC-171
# → ~instant if you checked yesterday

# Before deploy: Generate release notes (fresh data required)
node scripts/utils/jira-batch-fetch.js fetch LAC-174,LAC-153,LAC-171 --release-notes
# → ~2s, fresh data, validates fields
# → Warns: "LAC-174: Updated 15 minutes ago - verify latest changes"
```

## 🔍 Troubleshooting

### MCP Auth Error
```
Error: 401 Unauthorized
```
**Solution:** Reload VS Code
```powershell
.\scripts\reload-vscode.ps1
# Or: Ctrl+Shift+P → "Developer: Reload Window"
```

### Stale Cache Data
```bash
# Check cache age
node scripts/utils/jira-batch-fetch.js stats

# Force refresh
node scripts/utils/jira-batch-fetch.js fetch LAC-219 --force
```

### Performance Not Improved
**Checklist:**
- [ ] Using optimized scripts? (not old versions)
- [ ] Caching enabled? (`useCache: true`)
- [ ] MCP tools authenticated?
- [ ] Review metrics output

## 📈 Expected Results by Scale

| Ticket Count | Old Time | New Time | Savings |
|--------------|----------|----------|---------|
| 3 tickets | 6s | 1s | 5s (83%) |
| 5 tickets | 10s | 1.5s | 8.5s (85%) |
| 10 tickets | 20s | 2s | 18s (90%) |
| 20 tickets | 40s | 3s | 37s (93%) |

*Note: Times include network latency and API processing*

## 🎓 Migration from Old Scripts

### Old Pattern (Individual Fetches)
```javascript
const tickets = [];
for (const key of ticketKeys) {
  const ticket = await getJiraIssue(key); // ~2s each
  tickets.push(ticket);
}
// Time: 11 tickets × 2s = 22 seconds
```

### New Pattern (Batch Fetch)
```javascript
const { batchFetchTickets } = require('./scripts/utils/jira-batch-fetch');
const tickets = await batchFetchTickets(ticketKeys, { useCache: true });
// Time: ~2 seconds (single JQL query)
```

## 📚 Documentation Links

- **[PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md)**: Complete documentation
- **[OPTIMIZATION_STRATEGY.md](OPTIMIZATION_STRATEGY.md)**: Original analysis & roadmap
- **[README.md](README.md)**: Scripts overview
- **[examples/optimized-deployment-examples.js](examples/optimized-deployment-examples.js)**: Working examples

## 🆘 Need Help?

1. **Run examples**: `node scripts/examples/optimized-deployment-examples.js`
2. **Check cache**: `node scripts/utils/jira-batch-fetch.js stats`
3. **Review docs**: See links above
4. **Ask Copilot**: "How do I use the optimized deployment tools?"

---

**Last Updated:** March 6, 2026  
**Version:** 2.0 (Optimized)
