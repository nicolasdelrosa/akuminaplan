# Clarified Response to Marisan

---

**Subject:** RE: WCB PeopleSync - AAD Group-Based User Filtering Request

Hi Marisan,

Thanks for the quick response. Let me simplify the question:

**The Core Problem:**
WCB's custom filter needs to check if a user belongs to an AAD group (3,000 members). This requires calling Microsoft Graph API to check group membership.

**The Authentication Challenge:**
Since custom filters only receive `tenantId` and `appManagerUrl` (no accessToken or Graph credentials), we need to determine how the custom filter should authenticate to call Graph API.

**Two Possible Solutions:**

**Option 1: Custom Filter Gets Its Own Credentials**
- Custom filter reads service principal credentials from environment variables
- Custom filter directly calls Microsoft Graph API using those credentials
- **Question:** Is this allowed/supported in PeopleSync v6 serverless?

**Option 2: Use App Manager as a Proxy**
- We create a new App Manager endpoint: `POST /api/peoplesync/checkmembership`
- App Manager uses its existing Graph access to check the group membership
- Custom filter calls this App Manager endpoint via HTTP
- **Question:** Can we add this endpoint to App Manager? Would this work?

**What I Need:**
Just confirmation on which option is the recommended approach (or if there's a third option I'm missing).

Happy to schedule a call with you and Udai to discuss. What times work for you this week?

Best regards,
Diego

---

## Even Simpler Version (If You Want to Be More Direct)

---

Hi Marisan,

Let me clarify: WCB's custom filter needs to check AAD group membership via Graph API.

**Simple Question:** How should the custom filter authenticate to call Graph API?
- **Option A:** Custom filter uses its own service principal (from environment variables)
- **Option B:** Custom filter calls App Manager endpoint, App Manager checks Graph API

Which option is recommended for PeopleSync v6, or should we discuss alternatives?

Happy to setup a call with you and Udai to align on approach.

Best regards,
Diego
