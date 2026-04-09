# WCB PeopleSync Filter - AAD Group Membership Estimation

## Email to Client

---

**Subject:** WCB PeopleSync Filter Enhancement - Effort Estimation for AAD Group-Based Filtering

Dear [Client Name],

Following our discussion regarding implementing AAD group-based filtering for WCB's PeopleSync solution, I've prepared the effort estimation for the proposed implementation.

### Project Objective
Enable dynamic control of which users are synced to Akumina based on Azure Active Directory group membership, eliminating the need for code changes when updating the user list.

### Implementation Approach
We've identified two viable scenarios for this implementation:

#### **Scenario A: App Manager API Approach** (RECOMMENDED)
This approach leverages Akumina's existing App Manager API to check group membership, reusing the already-authenticated Graph API connection.

**Advantages:**
- Reuses existing authentication infrastructure
- Single HTTP call per sync operation
- Follows Akumina's standard integration pattern
- Lower complexity and maintenance overhead

**Effort Estimate:**
- Development: 16-20 hours
  - Custom filter implementation (4-5 hours)
  - App Manager API endpoint creation (6-8 hours)
  - Static caching mechanism (2-3 hours)
  - Configuration and environment setup (2-3 hours)
  - Code review and documentation (2 hours)
- Testing: 4 hours
  - Unit testing (1 hour)
  - Integration testing (2 hours)
  - User acceptance testing scenarios (1 hour)

**Total Estimate: 20-24 hours**

---

#### **Scenario B: Direct Graph API Approach** (Alternative)
This approach has the custom filter directly authenticate to Microsoft Graph API using its own service principal.

**Advantages:**
- Self-contained solution within the custom filter
- No dependency on App Manager modifications
- Faster initial implementation

**Considerations:**
- Requires separate service principal setup and maintenance
- Additional authentication overhead
- Less aligned with Akumina's standard architecture

**Effort Estimate:**
- Development: 12-16 hours
  - Custom filter with Graph API authentication (6-8 hours)
  - Static caching mechanism (2-3 hours)
  - Configuration and environment setup (2-3 hours)
  - Code review and documentation (2 hours)
- Testing: 4 hours
  - Unit testing (1 hour)
  - Integration testing (2 hours)
  - User acceptance testing scenarios (1 hour)

**Total Estimate: 16-20 hours**

---

### Recommendation
We recommend **Scenario A (App Manager API Approach)** as it:
- Aligns with Akumina's architectural patterns
- Provides better long-term maintainability
- Leverages existing authentication infrastructure
- Offers cleaner separation of concerns

While Scenario A has a higher initial development effort (20-24 hours vs 16-20 hours), the benefits in maintainability and alignment with Akumina's architecture provide better long-term value.

### Next Steps
1. Confirm preferred implementation approach
2. Validate technical feasibility with Akumina (Udai) - particularly for Scenario A
3. Schedule development sprint upon approval
4. Plan testing and deployment timeline

### Key Technical Questions for Udai (Akumina)
Before proceeding with Scenario A, we need confirmation from Akumina on:
1. Ability to create custom App Manager API endpoint for group membership checks
2. Access to Microsoft Graph API authentication context within App Manager
3. Performance impact of additional API call during PeopleSync operations

Please let me know if you have any questions about these estimates or would like to discuss either scenario in more detail.

Best regards,

---

## Detailed Breakdown

### Testing Activities Included (4 hours)

1. **Unit Testing (1 hour)**
   - Test static caching mechanism
   - Test group membership lookup logic
   - Mock API responses for edge cases

2. **Integration Testing (2 hours)**
   - Test with actual AAD groups (3,000 members)
   - Verify cold-start behavior
   - Performance testing under load
   - Cache persistence validation

3. **User Acceptance Testing (1 hour)**
   - Verify filtering works correctly
   - Test group membership updates reflect properly
   - Document test scenarios and results
   - Client walkthrough and validation

### Configuration Requirements
- AAD Group ID(s) to filter against
- Service Principal credentials (Scenario B) or App Manager API access (Scenario A)
- Environment variable setup in Azure Functions
- Optional: Azure Table Storage for cache resilience

### Deliverables
- Custom filter code implementation
- App Manager API endpoint (Scenario A) or Service Principal setup (Scenario B)
- Configuration documentation
- Testing documentation and results
- Deployment guide
