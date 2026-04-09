# WCB PeopleSync - AAD Group-Based Filtering

**Date:** January 28, 2026  
**Client:** WCB  
**Component:** PeopleSync v6 Custom Filter  
**Current Users:** ~3,000

---

## Business Requirement

WCB wants to control which users are synced to Akumina without requiring code changes to the custom filter. The proposed solution is to use an Azure AD security group as the control mechanism:

- **User in AAD Group** → Include in sync
- **User NOT in AAD Group** → Exclude from sync
- **Self-Service Management:** WCB IT can manage sync scope by adding/removing users from the group

---

## Current Implementation

**Location:** `C:\Git\WCB\WCB\project\PeopleSyncFilter\PeopleSync.CustomFilter\PeopleSync.Customization\CustomFilter.cs`

### Current Filter Logic
```csharp
// TODO: Add current CustomFilter.cs implementation here
```

### Current Limitations
- Requires code changes for filter logic updates
- Requires deployment for every change
- No self-service capability for client
- Hard-coded filtering rules

---

## 🎯 PROVEN PATTERN FROM EXISTING IMPLEMENTATIONS

### BP (PB) Implementation - External Data from Azure Blob Storage
**Pattern:** Load external data file (Workday) from Azure Blob Storage, cache in memory, lookup user data
**File:** `C:\Git\PB\people\main\PeopleSyncFilter\PeopleSync.Customization\CustomFilter.cs`

**Key Implementation Details:**
```csharp
public class CustomFilter : ICustomFilter
{
    // Static caching of external data (survives across user filter calls)
    public static JArray workdayUsers = null;
    
    public dynamic UserFilter(dynamic item)
    {
        // Lazy load external data on first use
        if (workdayUsers == null)
        {
            // Read from Azure Blob Storage
            var response = Task.Run(async () => await GetFileData(fileName));
            var dataContent = response.Result;
            
            // Optionally decrypt if encrypted
            if (Configuration.WorkdayFileIsEncrypted)
                dataContent = DecryptFile(dataContent);
            
            // Parse and cache in memory
            var workdayData = JsonConvert.DeserializeObject<WorkdayData>(dataContent);
            workdayUsers = workdayData.Report_Entry;
        }
        
        // Fast lookup from cached data
        var user = workdayUsers.FirstOrDefault(i => 
            i.Value<string>("upn").Equals(upn, StringComparison.InvariantCultureIgnoreCase));
        
        // Augment user with external data
        if (user != null)
        {
            foreach (var prop in user)
                item[prop.Name] = prop.Value;
        }
        
        return item;
    }
}
```

**Storage Access:**
```csharp
private async Task<string> GetFileData(string filename)
{
    var content = await _blobContainer.ReadText(filename);
    return content;
}
```

**Configuration:** Uses Azure Blob Storage connection string from config file

---

### RioTinto Implementation - External Data from Azure Table Storage
**Pattern:** Load external data from Azure Table Storage per user lookup
**File:** `C:\Users\Diego\Downloads\RioTinto\PeopleSyncFilter\PeopleSync.Customization.Net8\CustomFilter.cs`

**Key Implementation Details:**
```csharp
public class CustomFilter : ICustomFilter
{
    private static TableManager _table;
    
    public CustomFilter(TenantInfo tenant, ILogger log)
    {
        GetConfiguration(tenant, _log);
        // Initialize Table Storage client
        _table = new TableManager(
            Configuration.ExternalDataStorageConnectionString, 
            Constants.TableName
        );
    }
    
    public dynamic UserFilter(dynamic item)
    {
        var personId = ExtractPersonId(item);
        
        // Direct table lookup (no caching - real-time)
        var userProfileInfo = GetUserProfileInfo(personId);
        
        if (userProfileInfo != null)
        {
            foreach (var kvp in userProfileInfo)
            {
                var mappedKey = fieldMappings[kvp.Key];
                ((IDictionary<string, object>)item)[mappedKey] = kvp.Value;
            }
        }
        
        return item;
    }
    
    private Dictionary<string, object> GetUserProfileInfo(string personId)
    {
        // Query Azure Table Storage
        var user = _table.RetrieveEntity<TableEntity>(partitionKey, personId);
        
        if (user != null)
        {
            foreach (string prop in user.Keys)
            {
                values.Add(prop, user[prop].ToString());
            }
        }
        
        return values;
    }
}
```

**Configuration via Environment Variables:**
```csharp
var externalDataStorageConnectionString = 
    Utilities.GetEnvironmentVariable(Constants.AzureCustomStorageProperty);
config.ExternalDataStorageConnectionString = externalDataStorageConnectionString;
```

**Connection String from Tenant Credentials:**
```csharp
var credential = Utility.GetCredential(tenant, credentialId);
config.ConnectionString = credential.Data;
```

---

## 🔥 RECOMMENDED APPROACH (Based on Proven Patterns)

### Solution 1A: Self-Contained Custom Filter with Graph API (RECOMMENDED)

**Why This Is The Simplest:**
- ✅ RioTinto proves we can use environment variables for credentials
- ✅ BP proves we can make async API calls and use static caching
- ✅ BP proves KeyVault integration works in custom filters
- ✅ **Zero additional infrastructure** - everything in the filter itself
- ✅ **Automatic cache refresh** - happens during sync runs

**Architecture:**
```
[PeopleSync Custom Filter - First User Call]
    ↓ (Service Principal from Environment/KeyVault)
[Microsoft Graph API: GET /groups/{id}/members]
    ↓
[Cache in Static Variable + Optional Table Storage Backup]
    ↓
[Subsequent User Calls: Fast Memory Lookup]
```

**Key Innovation:** The filter manages its own cache and Graph API calls, eliminating separate background processes.

---

## Technical Constraints (PeopleSync v6 Serverless)

### Custom Filter Inputs (from Marisan)
- ✅ Available: `tenantId`, App Manager URL, User data, Environment variables
- ❌ NOT Available: Pre-authenticated `accessToken` for Graph API calls
- ❌ NOT Available: Group membership data in user object

### Performance Considerations
- Serverless architecture → each function invocation is stateless (but static variables persist)
- Fetching 3k group members ONCE per sync run = acceptable
- PeopleSync enumerates ALL users regardless of filter (can't avoid initial enumeration)

### Key Solution
**Custom filter authenticates to Graph API itself using service principal credentials from environment variables/KeyVault.**

---

**Implementation (Self-Contained Pattern):**

#### Step 1: Custom Filter with Self-Managed Cache (Following RioTinto + BP Patterns)
```csharp
using Azure.Data.Tables;
using Azure.Identity;
using Microsoft.Graph;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CustomFilter : ICustomFilter
{
    private static HashSet<string> _cachedMembers;
    private static DateTime _lastCacheRefresh = DateTime.MinValue;
    private static readonly TimeSpan _cacheInterval = TimeSpan.FromMinutes(30);
    private static TableServiceClient _tableClient;
    private readonly ILogger _log;
    
    public CustomFilter(TenantInfo tenant, ILogger log)
    {
        _log = log;
        
        // Initialize Table Storage for backup (following RioTinto pattern)
        var tableConnectionString = Utilities.GetEnvironmentVariable("MEMBERSHIP_CACHE_CONNECTION");
        if (!string.IsNullOrEmpty(tableConnectionString))
        {
            _tableClient = new TableServiceClient(tableConnectionString);
        }
    }
    
    public dynamic UserFilter(dynamic item)
    {
        // Refresh cache if stale (ONCE per sync run on first user)
        if (_cachedMembers == null || DateTime.UtcNow - _lastCacheRefresh > _cacheInterval)
        {
            RefreshGroupMembershipCache();
        }
        
        // Fast O(1) lookup from cached HashSet
        var upn = ((IDictionary<string, object>)item)["userPrincipalName"]?.ToString();
        if (string.IsNullOrEmpty(upn))
        {
            _log.LogWarning("User has no UPN - excluding");
            return null;
        }
        
        var isInGroup = _cachedMembers?.Contains(upn.ToLower()) ?? false;
        
        if (!isInGroup)
        {
            _log.LogInformation($"User {upn} not in sync group - excluding");
            return null; // Exclude from sync
        }
        
        return item; // Include in sync
    }
    
    private void RefreshGroupMembershipCache()
    {
        try
        {
            _log.LogInformation("Refreshing group membership cache from Microsoft Graph");
            
            // Get credentials from environment variables (following RioTinto pattern)
            var clientId = Utilities.GetEnvironmentVariable("GRAPH_CLIENT_ID");
            var clientSecret = Utilities.GetEnvironmentVariable("GRAPH_CLIENT_SECRET");
            var tenantId = Utilities.GetEnvironmentVariable("GRAPH_TENANT_ID");
            var groupId = Utilities.GetEnvironmentVariable("AAD_PEOPLESYNC_GROUP_ID");
            
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                _log.LogError("Graph credentials not configured - loading from Table Storage backup");
---

## Alternative Architectural Solutions

### Solution 1B: Separate Background Process with Table Storage (If Filter Can't Call Graph)

*Separate Process - PowerShell/Logic App/Azure Function - Every 15 mins]
    ↓ (Managed Identity or Service Principal)
[Microsoft Graph API: GET /groups/{id}/members]
    ↓
[Store to Azure Table Storage]
    ↓
[PeopleSync Custom Filter: Read from Table Storage (cached)
# Optional - Table Storage Backup
MEMBERSHIP_CACHE_CONNECTION=DefaultEndpointsProtocol=https;AccountName=wcbpeoplesync;...
```

**Or Using KeyVault (BP Style):**
```csharp
// Store secrets in KeyVault and reference by URL
GRAPH_CLIENT_SECRET=https://kv-wcb.vault.azure.net/secrets/graph-client-secret

// Filter retrieves at runtime (like BP does)
var secretValue = KeyVault.GetSecret(config.GraphClientSecret);
```

**Pros:**
- ✅ **Zero additional infrastructure** - everything in custom filter
- ✅ Proven patterns (RioTinto env vars + BP async calls + BP KeyVault)
- ✅ Static caching works perfectly in serverless (BP proves this)
- ✅ Fast O(1) lookup from cached HashSet
- ✅ Automatic cache refresh during sync runs
- ✅ Table Storage backup survives cold starts
- ✅ Simpler deployment - one component only
- ✅ Fire-and-forget persistence (non-blocking)
- ✅ Graceful degradation if Graph API fails

**Cons:**
- ❌ First sync run slightly slower (one-time Graph API call ~2-3 sec)
- ❌ Requires service principal with Graph permissions
- ❌ Cache only refreshes during sync runs (acceptable for most scenarios)
- ❌ Table Storage optional but recommended (adds ~50 lines of code)

**Key Design Decisions:**
- **Minimal Table Storage**: Fire-and-forget persistence, non-blocking
- **Graceful fallback**: Graph fails → use Table backup → log warning
- **Cold start optimization**: Load from Table first if available
- **Batch processing**: First 100 users sync, rest persist in background
                    }
                }
                
                membersPage = result.NextPageRequest;
                
            } while (membersPage != null);
            
            _cachedMembers = members;
            _lastCacheRefresh = DateTime.UtcNow;
            
            _log.LogInformation($"Refreshed cache: {members.Count} members from {pageCount} pages");
            
            // Persist to Table Storage as backup (optional but recommended)
            if (_tableClient != null)
            {
                Task.Run(async () => await PersistToTableStorageAsync(members));
            }
        }
        catch (Exception ex)
        {
            _log.LogError($"Graph API cache refresh failed: {ex.Message}");
            
            // Fallback: Load from Table Storage backup
            LoadFromTableStorageBackup();
        }
    }
    
    private async Task PersistToTableStorageAsync(HashSet<string> members)
    {
        try
        {
            var tableClient = _tableClient.GetTableClient("GroupMembership");
            await tableClient.CreateIfNotExistsAsync();
            
            // Clear old data and insert new
            var batch = new List<TableTransactionAction>();
            foreach (var upn in members)
            {
                var entity = new TableEntity("PEOPLESYNC", upn)
                {
                    { "IsMember", true },
                    { "LastUpdated", DateTime.UtcNow.ToString("o") }
                };
                
                await tableClient.UpsertEntityAsync(entity);
            }
            
            _log.LogInformation($"Persisted {members.Count} members to Table Storage backup");
        }
        catch (Exception ex)
        {
            _log.LogError($"Table Storage persist failed: {ex.Message}");
            // Non-critical - cache still works from memory
        }
    }
    
    private void LoadFromTableStorageBackup()
    {
        try
        {
            if (_tableClient == null)
            {
                _log.LogError("No Table Storage configured for backup");
                return;
            }
            
            _log.LogInformation("Loading group membership from Table Storage backup");
            
            var tableClient = _tableClient.GetTableClient("GroupMembership");
            var members = new HashSet<string>();
            
            var query = tableClient.Query<TableEntity>(
                filter: $"PartitionKey eq 'PEOPLESYNC'"
            );
            
            foreach (var entity in query)
            {
                members.Add(entity.RowKey.ToLower());
            }
            
            if (members.Count > 0)
            {
                _cachedMembers = members;
                _lastCacheRefresh = DateTime.UtcNow;
                _log.LogInformation($"Loaded {members.Count} members from Table Storage backup");
            }
            else
            {
                _log.LogWarning("Table Storage backup is empty");
            }
        }
        catch (Exception ex)
        {
            _log.LogError($"Table Storage backup load failed: {ex.Message}");
            // Keep existing cache if available
        }
    }
}
```

#### Step 2: Configuration (Following RioTinto + BP

### Solution 1: Pre-Sync Caching with Azure Function (Original Proposal)

**Architecture:**
```
[Timer Trigger Azure Function - Every 15 mins]
    ↓ (Managed Identity)
[Microsoft Graph API: GET /groups/{id}/members]
    ↓
[Cache group members in Table Storage/Cosmos DB]
    ↓
[PeopleSync Custom Filter reads from cache]
```

**Implementation Details:**

#### 1.1 Pre-Sync Azure Function
```csharp
// Separate Azure Function (Timer Trigger)
[FunctionName("CacheGroupMembers")]
public static async Task Run(
    [TimerTrigger("0 */15 * * * *")] TimerInfo timer, // Every 15 mins
    ILogger log)
{
    var graphClient = GetAuthenticatedGraphClient(); // Managed Identity
    var groupId = Environment.GetEnvironmentVariable("AAD_PEOPLESYNC_GROUP_ID");
    
    var members = new HashSet<string>();
    var request = graphClient.Groups[groupId].Members.Request().Top(999);
    
    do {
        var page = await request.GetAsync();
        foreach (var member in page.OfType<User>())
        {
            members.Add(member.UserPrincipalName);
            // Or use member.Id if matching by ObjectId
        }
        request = page.NextPageRequest;
    } while (request != null);
    
    // Store in Table Storage or Cosmos DB
    await StoreMembershipCache(members);
    log.LogInformation($"Cached {members.Count} group members");
}
```

#### 1.2 Updated Custom Filter
```csharp
public class CustomFilter : ICustomFilter
{
    private static HashSet<string> _cachedMembers;
    private static DateTime _lastCacheLoad = DateTime.MinValue;
    private static readonly TimeSpan _cacheRefreshInterval = TimeSpan.FromMinutes(30);
    
    public bool FilterUser(CustomFilterContext context)
    {
        // Lazy load cache from storage
        if (DateTime.UtcNow - _lastCacheLoad > _cacheRefreshInterval)
## 🏆 FINAL RECOMMENDATION: Solution 1A (Self-Contained Filter)

### Why This Is The Best Approach

1. **Proven Patterns Combined:**
   - ✅ RioTinto: Environment variables + async operations
   - ✅ BP: Static caching + KeyVault + async API calls
   - ✅ Both prove serverless custom filters handle this perfectly

2. **Simplicity:**
   - ✅ **One component** - just the custom filter
   - ✅ No separate Azure Function, Logic App, or PowerShell script
   - ✅ Filter manages its own cache lifecycle
   - ✅ Self-healing with Table Storage backup

3. **Performance:**
   - ✅ In-memory HashSet lookup = O(1) constant time
   - ✅ Graph API call happens ONCE per sync run (30-min intervals)
   - ✅ First sync run: ~2-3 seconds slower (one-time cost)
   - ✅ Subsequent user checks: microseconds

4. **Cost:**
   - ✅ Service Principal: Free
   - ✅ Graph API calls: Free (well within rate limits)
   - ✅ Table Storage backup (optional): < $0.01/month
   - ✅ **Total: Essentially FREE** (< $0.01/month)

5. **Development Velocity:**
   - ✅ Copy-paste from RioTinto + BP proven code
   - ✅ Team already familiar with these exact patterns
   - ✅ Faster to implement - no new infrastructure
   - ✅ Easier to test - everything in one place

6. **Client Self-Service:**
   - ✅ WCB adds/removes users from AAD group
   - ✅ Zero code changes needed
   - ✅ Changes reflected in next sync run (max 30 mins)

### Implementation Comparison

| Aspect | Solution 1A (Self-Contained) | Solution 1B (External Process) | Solution 2 (App Manager API) |
|--------|------------------------------|-------------------------------|------------------------------|
| **Infrastructure** | ⭐ Filter only | ⭐⭐ Filter + Background job | ⭐⭐⭐ Filter + App Manager changes |
| **Proven Pattern** | ✅ RioTinto + BP | ✅ Inferred from RioTinto | ❌ New implementation |
| **Deployment** | ⭐ 1 component | ⭐⭐ 2 components | ⭐⭐⭐ 3+ components |
| **Monthly Cost** | **~$0** (free) | ~$1-2 | $0 (but dev hours) |
| **Code Reuse** | ✅ Copy existing patterns | ⚠️ New background job | ❌ Write from scratch |
| **Performance** | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent | ⭐ Poor (3k API calls) |
| **Maintenance** | ⭐ Single component | ⭐⭐ Multiple components | ⭐⭐⭐ Complex dependencies |
| **Resilience** | ⭐⭐⭐ Self-healing fallback | ⭐⭐ Depends on background job | ⭐ Single point of failure |

### Implementation Timeline

**Solution 1A (Self-Contained) - RECOMMENDED:**
- **Week 1:** 
  - Day 1: Create service principal + configure environment variables
  - Day 2-3: Implement custom filter (copy RioTinto + BP patterns)
  - Day 4-5: Set up Table Storage backup + testing
- **Week 2:** Integration testing + refinement
- **Week 3:** UAT with WCB
- **Week 4:** Production deployment

**Solution 1B (External Process) - FALLBACK:**
- Week 1: Create Table Storage + PowerShell/Logic App sync script
- Week 2: Update Custom Filter + Testing
- Week 3: UAT with WCB
- Week 4: Production deployment

### Decision Gate

**Before implementation, confirm with Udai:**
> "Can custom filters authenticate to Microsoft Graph using service principal credentials from environment variables or KeyVault?"

- **If YES** → Proceed with Solution 1A (self-contained)
- **If NO** → Fallback to Solution 1B (external process)lientWithServiceAccount();
    var groupId = Configuration["PeopleSync:GroupId"];
    
    var result = await graphClient.Users[request.UserId]
        .CheckMemberGroups(new List<string> { groupId })
        .Request()
        .PostAsync();
    
    return Ok(new { IsMember = result.Any() });
}
```

#### 2.2 Updated Custom Filter
```csharp
public bool FilterUser(CustomFilterContext context)
{
    var appManagerUrl = context.AppManagerUrl;
    var userId = context.User.Id; // or UserPrincipalName
    
    var isMember = CheckMembership(appManagerUrl, context.TenantId, userId);
    return isMember;
}

private bool CheckMembership(string appManagerUrl, string tenantId, string userId)
{
    using (var client = new HttpClient())
    {
        var response = client.PostAsJsonAsync(
            $"{appManagerUrl}/api/peoplesync/checkmembership",
            new { TenantId = tenantId, UserId = userId }
        ).Result;
        
        if (response.IsSuccessStatusCode)
        {
            var result = response.Content.ReadAsAsync<MembershipResponse>().Result;
            return result.IsMember;
        }
    }
    return false; // Fail-safe: exclude if check fails
}
```

**Pros:**
- ✅ Real-time membership validation
- ✅ No additional infrastructure
- ✅ Centralized authentication

**Cons:**
- ❌ 3,000+ API calls per sync run (1 per user)
- ❌ Performance bottleneck
- ❌ App Manager changes required
- ❌ Not ideal for serverless (many HTTP calls)

---

### Solution 3: Hybrid Approach with Distributed Cache

**Architecture:**
```
[Timer Function: Cache to Redis/Cosmos - Every 5 mins]
    ↓
[Redis Cache / Cosmos DB with TTL]
    ↓
[PeopleSync Custom Filter: Read from cache]
```

Similar to Solution 1 but uses Redis Cache or Cosmos DB with TTL for faster access and automatic expiration.

**Pros:**
- ✅ Near real-time (5-min cache refresh)
- ✅ Ultra-fast lookup
- ✅ Automatic cache expiration

**Cons:**
- ❌ Additional Azure service cost
- ❌ More complex infrastructure

---

---

1. **Proven in Production:**
   - RioTinto uses Azure Table Storage for external data enrichment ✅
   - BP uses static caching for external Workday data ✅
   - Both patterns work perfectly in PeopleSync v6 serverless

2. **Performance:**
   - In-memory HashSet lookup = O(1) constant time
   - Cache refreshes every 30 mins (configurable)
   - Table Storage query very fast (<100ms for 3k records)

3. **Simpler Than Azure Function:**
   - No additional Function App to deploy
   - Reuses existing pattern from RioTinto/BP
   - Team already familiar with this approach

4. **Cost-Effective:**
   - Table Storage: ~$0.50/month for 3k rows
   - PowerShell/Logic App: ~$1/month for 2,880 runs
   - **Total: ~$1.50/month** (vs $5/month for Function App)

5. **Development Velocity:**
   - Copy-paste proven code from RioTinto + BP
   - No learning curve - exact same pattern
   - Faster to implement and test

6. **Client Self-Service:**
   - WCB adds/removes users from AAD group
   - No code changes needed
   - Changes reflected within cache refresh interval

### Implementation Comparison
Critical Questions for Udai

### PRIMARY QUESTION (Decision Gate):

**1. Can custom filters authenticate to Microsoft Graph API using service principal credentials?**
   - Can we use `ClientSecretCredential` from environment variables?
   - Can we use KeyVault integration (like BP does) for Graph secrets?
   - Are there any PeopleSync restrictions on outbound Graph API calls?
   - **This determines if we use Solution 1A (self-contained) or 1B (external process)**

### SECONDARY QUESTIONS (Implementation Details):

2. **Static Variable Caching:** Are static variables reliable in PeopleSync v6 serverless context?
   - BP proves this works for Workday data - does it work for our scenario?
   - Do static variables persist across user filter calls within same sync run?

3. **Async Operations:** Can custom filters safely make async API calls?
   - BP uses `Task.Run(async () => await GetFileData())` - is this recommended?
### Phase 0: Architecture Validation
- [ ] Send architectural document to Udai/Marisan
- [ ] Confirm custom filters can call Graph API with service principal
- [ ] Decide: Solution 1A (self-contained) or 1B (external process)

### Phase 1: Infrastructure Setup
- [ ] Create Azure AD service principal
- [ ] Grant `GroupMember.Read.All` or `Group.Read.All` permission
- [ ] Create AAD security group (or identify existing)
- [ ] Set up Azure Table Storage for backup (optional but recommended)
- [ ] Configure environment variables or KeyVault secrets

### Phase 2: Development
- [ ] Copy RioTinto pattern for environment variables
- [ ] Copy BP pattern for static caching
- [ ] Implem Service Principal
```powershell
# Create service principal
$sp = New-AzADServicePrincipal -DisplayName "WCB-PeopleSync-GraphAPI"

# Grant Graph API permissions (requires admin consent)
# GroupMember.Read.All or Group.Read.All
```

### AAD Security Group
- Create new group: "WCB-Akumina-Sync-Users"
- Or use existing group
- Note the Object ID (GUID)

### Environment Variables (PeopleSync Function App)
```
# Required - Graph API Authentication
GRAPH_CLIENT_ID=<service-principal-application-id>
GRAPH_CLIENT_SECRET=<service-principal-secret>
GRAPH_TENANT_ID=<wcb-aad-tenant-id>
AAD_PEOPLESYNC_GROUP_ID=<group-object-id>

# Optional - Table Storage Backup
MEMBERSHIP_CACHE_CONNECTION=DefaultEndpointsProtocol=https;AccountName=wcbpeoplesync;AccountKey=...;EndpointSuffix=core.windows.net
```

### Alternative: KeyVault Configuration (Recommended for Production)
```
# Store secrets in KeyVault
GRAPH_CLIENT_SECRET=https://wcb-keyvault.vault.azure.net/secrets/graph-client-secret
MEMBERSHIP_CACHE_CONNECTION=https://wcb-keyvault.vault.azure.net/secrets/table-storage-connection

# Custom filter retrieves from KeyVault at runtime (following BP pattern)s/secrets accessible
- [ ] Monitor first sync run performance
- [ ] Validate cache refresh on subsequent runs
- [ ] Document AAD group management process for WCB

### Phase 5: Production
- [ ] UAT with WCB stakeholders
- [ ] Production deployment
- [ ] Monitor cache refresh frequency
- [ ] Create runbook for troubleshooting
- [ ] Train WCB on AAD group management with warning logs**

6. **Built-in Options:** Are there any native PeopleSync configuration options for AAD group filtering we're not aware of
  - Day 3-5: Implement Custom Filter (copy RioTinto pattern)
- Week 2: Testing + refinement
- Week 3: UAT with WCB
- Week 4: Production deployment

### Alternative Approaches (Keep for Reference)

**If Table Storage approach has issues, fallback to:**
- Solution 1: Azure Function caching (more infrastructure but isolated concerns)
- Solution 2: App Manager API (real-time but performance concerns) manages AAD group, no code changes needed

**Implementation Timeline:**
- Week 1: Deploy Azure Function + Storage
- Week 2: Update Custom Filter + Testing
- Week 3: UAT with WCB
- Week 4: Production deployment

---

## Open Questions for Udai

1. **Custom Filter Enhancement:** Can PeopleSync v6 custom filter access environment variables for connection strings?

2. **Static Members in Serverless:** Are static variables reliable in Azure Functions serverless context for caching?

3. **Configuration Support:** Is there a recommended approach for external data sources in custom filters?

4. **Alternative Approaches:** Are there built-in PeopleSync configuration options for AAD group filtering we're not aware of?

5. **Performance Baseline:** What's the acceptable execution time for custom filter per user in serverless?

6. **Error Handling:** If cache is unavailable, should we fail-open (sync all) or fail-closed (sync none)?

---

## Implementation Checklist

- [ ] Review with Udai/Marisan
- [ ] Create Azure Function for group member caching
- [ ] Set up Table Storage or Cosmos DB
- [ ] Configure Managed Identity for Graph API access
- [ ] Update CustomFilter.cs with cache lookup logic
- [ ] Add error handling and logging
- [ ] Create monitoring alerts for cache staleness
- [ ] Document AAD group management process for WCB
- [ ] UAT test plan
- [ ] Production deployment plan

---

## Configuration Required

### Azure AD
- Create AAD security group (or use existing)
- Grant Managed Identity `GroupMember.Read.All` or `Group.Read.All`

### Azure Function App Settings
```
AAD_PEOPLESYNC_GROUP_ID=<group-object-id>
GRAPH_API_ENDPOINT=https://graph.microsoft.com/v1.0
CACHE_STORAGE_CONNECTION=<connection-string>
```

### PeopleSync Custom Filter Settings
```
MEMBERSHIP_CACHE_CONNECTION=<connection-string>
CACHE_REFRESH_INTERVAL_MINUTES=30
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cache staleness (15-min delay) | Low | Document process, consider 5-min refresh if critical |
| Storage unavailable | High | Implement fallback logic (fail-open or fail-closed) |
| Graph API throttling | Medium | Implement retry logic with exponential backoff |
| Cost overruns | Low | Monitor Function execution costs |

---

## Success Criteria

- ✅ WCB can add/remove users from AAD group without Akumina involvement
- ✅ Changes reflected in next PeopleSync run (within cache refresh interval)
- ✅ No performance degradation compared to current custom filter
- ✅ Zero code changes required for future membership updates
- ✅ Audit trail via AAD group membership logs
