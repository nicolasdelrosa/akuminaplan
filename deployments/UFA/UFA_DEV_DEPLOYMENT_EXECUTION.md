# UFA DEV Deployment Execution - January 22, 2026

## ✅ DEPLOYMENT INITIATED

**Status:** In Progress  
**Date:** January 22, 2026  
**Branch:** dev_2026.01.22.01  
**Tickets:** UFA-285, UFA-286

---

## 📋 STEP-BY-STEP EXECUTION GUIDE

### STEP 1: Create Deployment Branch ✓
**Portal:** Azure DevOps (https://dev.azure.com)

1. Navigate to **ReleaseManagement** project
2. Go to **Repos** > **Branches**
3. Click **New branch**
4. Enter details:
   - **Name:** `dev_2026.01.22.01`
   - **Based on:** `main`
5. Click **Create**

**Status:** □ Pending

---

### STEP 2: Create Pull Request ✓
**Portal:** Azure DevOps

1. Go to **Repos** > **Pull requests**
2. Click **New pull request**
3. Configure:
   - **Source branch:** `main`
   - **Target branch:** `dev_2026.01.22.01`
   - **Title:** `UFA Dev Deployment - Jan 22, 2026 (UFA-285, UFA-286)`
   - **Description:**
     ```
     ## Deployment Summary
     - UFA-285: Add System & Tools results in typeahead and global search
     - UFA-286: Add SLW results in typeahead and global search
     
     ## Search Enhancements
     This deployment enhances search functionality by adding:
     1. System & Tools content to typeahead suggestions
     2. Summary Link Widget (SLW) results to search
     
     ## Post-Deployment Requirements
     - Configure SharePoint managed property: SPSUMMARYLINKNODETYPE
     - Re-crawl SummaryLinks_AK list
     
     ## Testing Checklist
     - [ ] Typeahead search displays System & Tools
     - [ ] Typeahead search displays SLW results
     - [ ] Global search returns accurate results
     - [ ] No console errors
     ```
4. **Link work items:** UFA-285, UFA-286
5. **Add reviewers** (if required)
6. Click **Create**
7. **Complete** the pull request after review

**Status:** □ Pending

---

### STEP 3: Run Pipeline ✓
**Portal:** Azure DevOps

1. Go to **Pipelines**
2. Find: **UFA-Headless-Dev** (or UFA Development pipeline)
3. Click **Run pipeline**
4. Select:
   - **Branch:** `dev_2026.01.22.01`
5. Click **Run**
6. **Monitor** pipeline execution:
   - Watch for build errors
   - Check deployment logs
   - Verify all stages complete successfully

**Expected Duration:** 10-20 minutes

**Status:** □ Pending

---

### STEP 4: SharePoint Search Configuration ⚠️
**Portal:** SharePoint Admin Center

**CRITICAL:** This must be completed AFTER pipeline succeeds

1. **Access Admin Center**
   - URL: `https://[your-tenant]-admin.sharepoint.com`
   - Login with admin credentials

2. **Navigate to Search Schema**
   - Click: **More features**
   - Under Search: Click **Open**
   - Click: **Manage Search Schema**

3. **Configure Managed Property**
   - **Find available property:**
     - Search for: `RefinableString`
     - Identify unused property (e.g., `RefinableString50`)
   
   - **Map crawled property:**
     - Click on the RefinableString property
     - Click **Edit/Map property**
     - Add mapping: `ows_NodeType` OR `ows_q_CHCS_NodeType`
     - **Include in Mappings:** ☑
   
   - **Create alias:**
     - In Aliases section
     - Add: `SPSUMMARYLINKNODETYPE`
   
   - **Enable settings:**
     - ☑ **Queryable**
     - ☑ **Retrievable**
     - ☑ **Refinable**
   
   - Click **OK** to save

4. **Trigger Re-crawl**
   - Navigate to: **Site Settings** > **Site contents**
   - Find list: **SummaryLinks_AK**
   - Advanced settings > **Reindex site**
   - OR use: **Request Reindex** button
   - **Wait time:** 10-15 minutes for indexing

**Status:** □ Pending (after pipeline)

---

### STEP 5: Testing & Verification ✓
**Environment:** https://cloud-dev-fe-ufa.onakumina.com/

#### Test Case 1: Typeahead - System & Tools
1. Click on global search box
2. Type: `tools` or `system`
3. **Expected:** System & Tools items appear in dropdown suggestions
4. **Verify:** Click a suggestion navigates to correct page

**Status:** □ Not Tested

#### Test Case 2: Typeahead - SLW Results
1. Click on global search box
2. Type a known Summary Link title
3. **Expected:** Summary link items appear in dropdown
4. **Verify:** Metadata displays correctly (category, description)

**Status:** □ Not Tested

#### Test Case 3: Global Search - Full Results
1. Execute search for: `tools and systems`
2. View full results page
3. **Expected:** System & Tools content appears in results
4. **Verify:** Results ranked appropriately

**Status:** □ Not Tested

#### Test Case 4: Global Search - SLW
1. Execute search for Summary Link content
2. **Expected:** SLW items display in results
3. **Verify:** NodeType field populated (check managed property)

**Status:** □ Not Tested

#### Test Case 5: Console Errors
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Perform searches (typeahead and global)
4. **Expected:** No JavaScript errors
5. Check **Network** tab for 404s or failed requests

**Status:** □ Not Tested

---

### STEP 6: Update Jira Tickets ✓

#### UFA-285
1. Go to: https://akumina.atlassian.net/browse/UFA-285
2. **Transition:** Ready to Deploy → Deployed to Dev
3. **Add comment:**
   ```
   Deployed to Development environment on January 22, 2026
   Branch: dev_2026.01.22.01
   Pipeline: UFA-Headless-Dev
   
   System & Tools search integration completed.
   Typeahead and global search tested successfully.
   ```

#### UFA-286
1. Go to: https://akumina.atlassian.net/browse/UFA-286
2. **Transition:** Ready to Deploy → Deployed to Dev
3. **Add comment:**
   ```
   Deployed to Development environment on January 22, 2026
   Branch: dev_2026.01.22.01
   Pipeline: UFA-Headless-Dev
   
   SharePoint Configuration Completed:
   - Managed property SPSUMMARYLINKNODETYPE configured
   - SummaryLinks_AK list re-crawled
   - SLW search integration verified
   ```

**Status:** □ Pending (after testing)

---

### STEP 7: Stakeholder Notification ✓

**Send email to:**
- **To:** Ren Tetrault (assignee - UFA-286)
- **Cc:** Diego Rosa, Luke Shuck, Alison J Haynes

**Subject:** UFA Dev Deployment Complete - Jan 22, 2026 (UFA-285, UFA-286)

**Body:**
```
Hi Team,

The UFA Development deployment has been completed successfully.

Deployment Details:
- Date: January 22, 2026
- Environment: DEV (https://cloud-dev-fe-ufa.onakumina.com/)
- Branch: dev_2026.01.22.01
- Tickets: UFA-285, UFA-286

Features Deployed:
1. System & Tools results in typeahead and global search (UFA-285)
2. Summary Link Widget (SLW) results in search (UFA-286)

Post-Deployment Configuration:
✓ SharePoint managed property SPSUMMARYLINKNODETYPE configured
✓ SummaryLinks_AK list re-crawled
✓ All testing completed successfully

Testing Results:
✓ Typeahead search - System & Tools: PASSED
✓ Typeahead search - SLW: PASSED
✓ Global search results: PASSED
✓ No console errors: PASSED

The features are ready for client testing in DEV.

Please let me know if you have any questions.

Best regards,
[Your Name]
```

**Status:** □ Pending (after completion)

---

## 📊 DEPLOYMENT STATUS TRACKER

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1 | Create branch dev_2026.01.22.01 | □ | Azure DevOps |
| 2 | Create & complete pull request | □ | Link UFA-285, UFA-286 |
| 3 | Run UFA-Headless-Dev pipeline | □ | Monitor for errors |
| 4 | Configure SharePoint search | □ | SPSUMMARYLINKNODETYPE |
| 5 | Re-crawl SummaryLinks_AK | □ | Wait 10-15 min |
| 6 | Test typeahead - System & Tools | □ | DEV environment |
| 7 | Test typeahead - SLW | □ | DEV environment |
| 8 | Test global search | □ | Both features |
| 9 | Check console errors | □ | F12 DevTools |
| 10 | Update UFA-285 status | □ | → Deployed to Dev |
| 11 | Update UFA-286 status | □ | → Deployed to Dev |
| 12 | Notify stakeholders | □ | Email team |

---

## ⚠️ TROUBLESHOOTING

### Pipeline Fails
1. Check build logs for errors
2. Verify branch name is correct
3. Ensure all code changes are committed
4. Check for merge conflicts
5. Contact DevOps team if persistent

### Search Not Working
1. Verify managed property created correctly
2. Check re-crawl completed (wait longer if needed)
3. Clear browser cache and test again
4. Verify SPSUMMARYLINKNODETYPE alias exists
5. Check search index status in SharePoint

### Typeahead Empty
1. F12 > Network tab - check API calls
2. Verify search service is running
3. Check for JavaScript errors
4. Validate search configuration in App Manager
5. Test in incognito window

---

## 📞 SUPPORT CONTACTS

**Primary Contact:** Diego Rosa  
Email: diego.rosa@akumina.com  
Role: Deployment Lead

**Technical Assignee:** Ren Tetrault  
Role: UFA-286 Owner

**Secondary Contact:** Luke Shuck  
Email: Luke.Shuck@akumina.com  
Role: Technical Support

**For Issues:** Create Jira ticket in UFA project

---

## 🔄 ROLLBACK PROCEDURE

If critical issues occur:

1. **Stop current deployment**
2. **Identify the issue** (document in Jira)
3. **Execute rollback:**
   - Revert to previous branch
   - Re-run pipeline with stable branch
4. **Notify stakeholders**
5. **Schedule fix and re-deployment**

**Previous stable branch:** Check last successful deployment

---

## ✅ COMPLETION CHECKLIST

Final verification before marking complete:

- [ ] All 12 deployment steps completed
- [ ] Both tickets (UFA-285, UFA-286) tested successfully
- [ ] SharePoint configuration verified
- [ ] No console errors or warnings
- [ ] Jira tickets updated
- [ ] Stakeholders notified
- [ ] Documentation updated
- [ ] Deployment notes saved

**Deployment Completed By:** ___________________  
**Date/Time:** ___________________  
**Verified By:** ___________________

---

*Generated: January 22, 2026*  
*Deployment Package: UFA DEV 2026.01.22.01*
