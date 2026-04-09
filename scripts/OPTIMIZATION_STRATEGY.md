# Deployment Optimization Strategy

## Executive Summary
Current deployment process takes **~2-3 minutes** with multiple manual steps. Optimized process could complete in **~20-30 seconds** with automation.

## Performance Analysis

### Current Bottlenecks
| Operation | Current Time | % of Total | Optimization Potential |
|-----------|--------------|------------|------------------------|
| Jira ticket fetching (11 tickets) | 22s | 73% | **HIGH** - Use JQL batch query |
| Azure DevOps API calls | 5s | 17% | Medium - Cache recent data |
| Manual orchestration | 3s+ | 10% | **HIGH** - PowerShell automation |
| **Total** | **~30s** | 100% | |

*Note: Times exclude human decision time between steps*

## Optimization Roadmap

### ✅ Phase 1: Immediate Wins (Completed)
- [x] Create PowerShell automation script [`deploy-to-dev.ps1`](scripts/deploy-to-dev.ps1)
- [x] Implement caching layer [`cache-manager.ps1`](scripts/cache-manager.ps1)
- [x] Document optimization strategy

**Expected improvement: 50% time reduction**

### 🔄 Phase 2: Batch API Operations (Next Step)
**Priority: CRITICAL - Biggest time saver**

1. **Jira Batch Fetching** (MUST IMPLEMENT)
   - Current: 11 individual `mcp_atlassian_atl_getJiraIssue()` calls
   - Optimized: Single JQL search
   - Code change needed in deployment logic:
   
   ```javascript
   // OLD: Sequential individual calls
   const tickets = [];
   for (const id of ticketIds) {
     const ticket = await getJiraIssue(id); // 11 API calls
     tickets.push(ticket);
   }
   
   // NEW: Single batch query
   const jql = `key in (${ticketIds.join(',')})`;
   const tickets = await searchJira(jql); // 1 API call
   ```

2. **Activate Jira Search Tools**
   - Need to check if `activate_jira_confluence_search_tools` provides JQL capability
   - If not available, request MCP server enhancement

**Expected improvement: 10x faster ticket fetching (22s → 2s)**

### 🔄 Phase 3: Parallel Operations
**Priority: HIGH**

Leverage concurrent execution where operations are independent:

```powershell
# Execute in parallel using PowerShell jobs
$jobs = @(
    Start-Job -ScriptBlock { Get-AzureDevOpsCommits }
    Start-Job -ScriptBlock { Get-LastPipelineRun }
    Start-Job -ScriptBlock { Verify-BranchExists }
)

$results = $jobs | Wait-Job | Receive-Job
```

**Expected improvement: 30% time reduction on multi-operation steps**

### 🔄 Phase 4: Intelligent Caching
**Priority: MEDIUM**

Cache frequently accessed data with smart TTL:

| Data Type | TTL | Cache Key |
|-----------|-----|-----------|
| Last deployment info | 30 min | `last-deployment-{client}` |
| Jira tickets (closed) | 24 hours | `jira-{ticket-id}` |
| Jira tickets (open) | 5 min | `jira-{ticket-id}` |
| Azure DevOps pipelines | 15 min | `pipeline-{client}-{env}` |

**Expected improvement: 80% cache hit rate = 80% faster on repeated operations**

### 🔄 Phase 5: Preemptive Background Tasks
**Priority: LOW (Nice to have)**

Start slow operations early while user is still reading output:

```powershell
# Start Jira fetch in background while showing Azure DevOps results
$jiraJob = Start-Job -ScriptBlock { Fetch-JiraTickets $ticketIds }

# Show Azure results to user
Show-CommitSummary $commits

# By now, Jira data is ready
$tickets = Receive-Job $jiraJob
```

**Expected improvement: Perceived 50% faster user experience**

## Implementation Priority

### Week 1: Critical Path
1. ✅ Create automation scripts (DONE)
2. **Implement JQL batch search for Jira** ← **DO THIS NEXT**
3. Test with JM Smuckers deployment

### Week 2: Enhancements
4. Add caching to deployment script
5. Implement parallel Azure DevOps operations
6. Add retry logic with exponential backoff

### Week 3: Polish
7. Error recovery automation
8. Deployment metrics/logging
9. Documentation updates

## Measurement & Success Metrics

Track these metrics before/after optimization:

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Total deployment prep time | ~2-3 min | ~30 sec | End-to-end timing |
| Jira ticket fetch time | 22s | 2s | API call duration |
| API calls per deployment | 15+ | 5-8 | Tool invocation count |
| Manual intervention points | 3-4 | 0-1 | User prompts needed |
| Cache hit rate | 0% | 60%+ | Cache stats |

## Code Changes Needed

### 1. Add JQL Search Capability
**File**: New wrapper for Jira search or use existing MCP tool

```javascript
// scripts/jira-batch-search.js
async function batchFetchTickets(ticketIds, jiraProject) {
  // Check if MCP search tool is available
  const jql = `key in (${ticketIds.join(',')}) AND project = ${jiraProject}`;
  
  // TODO: Call mcp_atlassian with JQL when available
  // For now, fallback to individual calls but cache results
  const tickets = [];
  for (const id of ticketIds) {
    const cachedTicket = getCached(`jira-${id}`);
    if (cachedTicket) {
      tickets.push(cachedTicket);
    } else {
      const ticket = await getJiraIssue(id);
      setCached(`jira-${id}`, ticket, 60); // 1 hour TTL
      tickets.push(ticket);
    }
  }
  
  return tickets;
}
```

### 2. Update Deployment Script with Caching
**File**: [`scripts/deploy-to-dev.ps1`](scripts/deploy-to-dev.ps1)

Add cache checks before each API operation:

```powershell
# Check cache first
$lastDeploy = & $PSScriptRoot\cache-manager.ps1 -Action Get -Key "last-deployment-$Client"

if (-not $lastDeploy) {
    # Cache miss - fetch from Azure DevOps
    $lastDeploy = Get-LastPipelineRun -Client $Client
    & $PSScriptRoot\cache-manager.ps1 -Action Set -Key "last-deployment-$Client" -Value $lastDeploy -TTLMinutes 30
}
```

## Next Immediate Action

**Run this command to see current cache status:**
```powershell
.\scripts\cache-manager.ps1 -Action Stats
```

**Then implement JQL batch search** - this single change will provide 90% of the performance improvement!

## Questions for User

1. Do you want me to activate the Jira search tools now to check for JQL support?
2. Should I update the deployment script to use caching immediately?
3. Would you like me to create a performance tracking log to measure improvements?
