# UFA Development Deployment - January 22, 2026

## 📋 Deployment Overview

**Environment:** Development  
**Date:** January 22, 2026  
**Branch:** dev_2026.01.22.01  
**Pipeline:** UFA Development - Headless Pipeline  
**Tickets:** 2 Ready to Deploy

---

## 🎯 Tickets Included

### Ready to Deploy

#### UFA-285: Add System & Tools results in typeahead and global search
- **Status:** Ready to Deploy
- **Priority:** Medium
- **Updated:** January 22, 2026
- **Description:** Add System & Tools results to both typeahead and global search functionality.

#### UFA-286: Search add SLW results in typeahead and global search
- **Status:** Ready to Deploy
- **Priority:** Medium  
- **Updated:** January 22, 2026
- **Assignee:** Ren Tetrault
- **Description:** Add SLW (Site List Widget) results to both typeahead and global search functionality.

**Manual Deployment Steps Required:**
1. Configure Managed Property for SummaryLinks
   - Navigate to SharePoint Admin Center > Search > Manage Search Schema
   - Find a RefinableString managed property (e.g., RefinableString50)
   - Map the crawled property: `ows_NodeType` or `ows_q_CHCS_NodeType`
   - Create alias: `SPSUMMARYLINKNODETYPE`
   - Enable: ✓ Queryable, ✓ Retrievable, ✓ Refinable
   - Trigger Re-crawl of `SummaryLinks_AK` list

---

## 🔧 Pre-Deployment Checklist

- [ ] Verify MCP authentication is active (`.\scripts\check-mcp-auth.ps1`)
- [ ] Confirm both tickets are in 'Ready to Deploy' status ✅
- [ ] Review existing UFA-274 to UFA-283 deployment (Jan 20) is complete
- [ ] Ensure development environment is accessible
- [ ] Notify stakeholders of deployment window

---

## 🚀 Deployment Steps

### Step 1: Create Deployment Branch
```powershell
# Using Azure DevOps MCP or manually via CLI
$branchName = "dev_2026.01.22.01"
# Create from master/main branch
```

### Step 2: Generate Pull Request
- Merge `master` into `dev_2026.01.22.01`
- Include commit references for UFA-285 and UFA-286

### Step 3: Execute Pipeline
- Run **UFA Development - Headless Pipeline**
- Branch: `dev_2026.01.22.01`
- Monitor for errors

### Step 4: Manual Configuration

#### SharePoint Search Schema Configuration
1. **Access SharePoint Admin Center**
   - Navigate to: Search > Manage Search Schema
   
2. **Configure Managed Property**
   - Find available RefinableString (e.g., RefinableString50)
   - Map crawled property: `ows_NodeType` or `ows_q_CHCS_NodeType`
   - Create alias: `SPSUMMARYLINKNODETYPE`
   
3. **Enable Property Settings**
   - ✓ Queryable
   - ✓ Retrievable
   - ✓ Refinable
   
4. **Trigger Re-crawl**
   - Re-crawl the `SummaryLinks_AK` list
   - Verify managed property is populated

---

## ✅ Post-Deployment Verification

### Search Functionality Tests

- [ ] **Typeahead Search - System & Tools**
  - Type "tools" in global search
  - Verify System & Tools results appear in typeahead
  - Confirm results are relevant and accurate

- [ ] **Typeahead Search - SLW Results**
  - Type summary link title in search
  - Verify SLW items appear in typeahead
  - Check that `SPSUMMARYLINKNODETYPE` is populated

- [ ] **Global Search - System & Tools**
  - Execute full search for tools/systems
  - Verify results display correctly
  - Check result ranking and relevance

- [ ] **Global Search - SLW Results**
  - Execute full search for summary links
  - Verify SLW items appear in results
  - Validate metadata display (NodeType, etc.)

### Environment Verification
- [ ] Dev environment: https://cloud-dev-fe-ufa.onakumina.com/
- [ ] No JavaScript errors in console
- [ ] Search index updated properly
- [ ] Managed properties configured correctly

---

## 📊 Known Issues & Monitoring

### Active Issues (Not in This Deployment)
- **UFA-289:** Typeahead mixture of good/incorrect elements (To Do)
- **UFA-270:** Document search not displaying last modified by (In Progress)
- **UFA-251:** Inconsistent announcements loading (In Progress)

### Monitoring Points
- Watch for typeahead rendering issues (related to UFA-289)
- Monitor search performance after index re-crawl
- Track managed property population success rate

---

## 🆘 Rollback Plan

If critical issues occur:
1. Stop pipeline execution
2. Revert to previous branch: `dev_2026.01.20.01`
3. Document failure in Jira tickets (UFA-285, UFA-286)
4. Re-run UFA Development pipeline with previous branch

---

## 📞 Support Contacts

**Primary Contact:** Diego Rosa (diego.rosa@akumina.com)  
**Technical Assignee:** Ren Tetrault  
**Secondary Contact:** Luke Shuck (Luke.Shuck@akumina.com)  

**For Issues:** Create ticket in Jira under project UFA

---

## 📝 Release Notes

Generated: January 22, 2026  
Previous Deployment: January 20, 2026 (UFA-274 to UFA-283)  
Next Scheduled: TBD

**Deployment Script:** `.\scripts\deploy-to-dev.ps1 -Client UFA -Project ReleaseManagement`
