# JM Smuckers DEV Deployment - February 24, 2026
## Deployment Execution Checklist

---

## 📋 Deployment Information

| Item | Value |
|------|-------|
| **Deployment Date** | February 24, 2026 |
| **Environment** | Development |
| **Repository** | https://akuminadev.visualstudio.com/Smuckers |
| **Branch** | `feature/dev-deployment-feb-24-2026` |
| **Pull Request** | TBD (Create after branch push) |
| **Pipeline** | JMSmuckers-Headless-Dev |
| **Total Tickets** | 4 |
| **Manual Steps Required** | Yes (JMSMUC-99) |

---

## 🎯 Tickets Included in This Deployment

### High Priority
- [x] **JMSMUC-99**: Our People - Custom Widget ⚠️ *Manual Deployment Required*
- [x] **JMSMUC-130**: Update greeting widget and search button branding

### Medium Priority
- [x] **JMSMUC-132**: Update People Directory Background images
- [x] **JMSMUC-114**: Update events card branding GE-002

---

## ✅ Pre-Deployment Checklist

### Code & Repository
- [ ] All code changes committed to local branch
- [ ] Branch created: `feature/dev-deployment-feb-24-2026`
- [ ] Code reviewed locally
- [ ] No merge conflicts with `main` or `develop` branch
- [ ] All 4 tickets verified in "Ready for Dev Deploy" status in Jira

### Testing & Validation
- [ ] Local build successful
- [ ] Unit tests passing (if applicable)
- [ ] Widget configurations validated
- [ ] No console errors in browser developer tools

### Documentation
- [ ] Release notes document reviewed: `JMSMUC_Dev_Deployment_Feb_24_2026_Release_Notes.docx`
- [ ] Manual deployment steps documented below
- [ ] Jira deployment tracking task created (JMSMUC-133 or next available)

---

## 🚀 Deployment Execution Steps

### Step 1: Create and Push Branch
```powershell
# Ensure you're in the correct repository directory
cd <repo-path>

# Create deployment branch
git checkout -b feature/dev-deployment-feb-24-2026

# Verify all changes are committed
git status

# Push branch to Azure DevOps
git push origin feature/dev-deployment-feb-24-2026
```
- [ ] Branch created and pushed successfully

### Step 2: Create Pull Request
1. Navigate to: https://akuminadev.visualstudio.com/Smuckers/_git/Smuckers/pullrequests
2. Click "New Pull Request"
3. Set source branch: `feature/dev-deployment-feb-24-2026`
4. Set target branch: `develop` (or appropriate base branch)
5. Title: `DEV Deployment - February 24, 2026`
6. Description: Link to tickets (JMSMUC-99, 130, 132, 114)
7. Add reviewers (if required)
8. **Update PR number in release notes document**

- [ ] Pull Request created
- [ ] PR Number: `_______` (Update this)

### Step 3: Merge Pull Request
- [ ] PR approved (if review required)
- [ ] PR merged to develop/main branch
- [ ] Deployment branch deleted (optional)

### Step 4: Trigger Azure Pipeline
1. Navigate to: https://akuminadev.visualstudio.com/Smuckers/_build
2. Find pipeline: `JMSmuckers-Headless-Dev`
3. Click "Run pipeline"
4. Select branch: `develop` (or merged target)
5. Monitor pipeline execution

- [ ] Pipeline triggered
- [ ] Pipeline completed successfully
- [ ] Build artifacts generated
- [ ] Deployment to DEV environment successful

---

## ⚠️ MANUAL DEPLOYMENT STEPS - JMSMUC-99

**Ticket**: JMSMUC-99 - Our People - Custom Widget  
**Priority**: HIGH  
**Estimated Time**: 60-90 minutes

### SharePoint Configuration
- [ ] **Step 1**: Create "Smucker Team" SharePoint list
  - List type: Custom List
  - Location: Site Collection root or appropriate subsite
  
- [ ] **Step 2**: Add site columns to Spotlight content type
  - Open Site Settings → Site Content Types → Spotlight
  - Add required columns for employee data (job title, location, tags, etc.)

- [ ] **Step 3**: Create content app
  - Navigate to App Manager
  - Create new app for Employee Spotlight content
  - Configure permissions (25-30 admin users as per requirements)

### Widget Deployment
- [ ] **Step 4**: Import SpotlightWidget and GenericItem
  - Upload widget package to site
  - Import SpotlightWidget component
  - Import GenericItem component
  - Verify imports successful in App Manager

### URL & Routing Configuration
- [ ] **Step 5**: Setup friendlyURL to current environment
  - Configure SEO-friendly URLs for employee spotlight pages
  - Test URL structure (e.g., `/people/spotlight/[employee-name]`)

- [ ] **Step 6**: Setup TaxonomyRoute list
  - Create or update TaxonomyRoute list entries
  - Map routes to spotlight pages
  - Verify navigation structure

### Cache & Pages
- [ ] **Step 7**: Clear configuration cache
  ```powershell
  # Clear Akumina cache (method depends on your setup)
  # Option 1: Through Central Site Manager
  # Option 2: PowerShell script (if available)
  ```

- [ ] **Step 8**: Create `spotlightdetail` page and add widget
  - Page URL: `/pages/spotlightdetail`
  - Add SpotlightWidget to page
  - Configure widget properties (view type, styling, etc.)
  - Publish page

- [ ] **Step 9**: Create `employeespotlightlist` page and add widget
  - Page URL: `/pages/employeespotlightlist`
  - Add SpotlightWidget with list view
  - Configure carousel/scroll properties (8-9 cards, 20-item scroll limit)
  - Publish page

### Testing & Validation
- [ ] **Step 10**: Test with multiple user profiles
  - Test with regular employees (M365 profile photos)
  - Test with hyphenated names
  - Test with "Organizational announcements" (corporate logo fallback)
  - Test across all departments

#### Specific Test Cases:
- [ ] Profile pictures load correctly from M365
- [ ] Corporate logo displays for org announcements
- [ ] Hyphenated/junior names display correctly
- [ ] Tags display correctly (Welcome, Promotion, etc.)
- [ ] Chronological ordering works (most recent first)
- [ ] "View All" button navigates to full list
- [ ] Detail pages render correctly
- [ ] Multilingual tokens work (if applicable)
- [ ] 25-30 admins can publish content

---

## 🔍 Post-Deployment Verification

### Automated Tickets (JMSMUC-130, 132, 114)
- [ ] **JMSMUC-130**: Verify greeting widget date color is teal
- [ ] **JMSMUC-130**: Verify search button branding updated
- [ ] **JMSMUC-132**: Verify People Directory background images updated
- [ ] **JMSMUC-132**: Test responsive behavior (desktop, tablet, mobile)
- [ ] **JMSMUC-114**: Verify event cards background is cream (#FFF7E5)
- [ ] **JMSMUC-114**: Verify event card title font is black

### Manual Ticket (JMSMUC-99)
- [ ] All manual steps completed successfully
- [ ] Widget displays on homepage/designated pages
- [ ] No console errors
- [ ] Performance acceptable (page load time)

### General Validation
- [ ] No breaking changes introduced
- [ ] Site navigation works correctly
- [ ] All existing widgets still functional
- [ ] Browser compatibility (Chrome, Edge, Firefox, Safari)

---

## 📝 Update Jira Tickets

### After Successful Deployment
- [ ] Update JMSMUC-99 status → "Client Validation on Dev"
- [ ] Update JMSMUC-130 status → "Client Validation on Dev"
- [ ] Update JMSMUC-132 status → "Client Validation on Dev"
- [ ] Update JMSMUC-114 status → "Client Validation on Dev"
- [ ] Update deployment tracking task (JMSMUC-133) → "Done"
- [ ] Add deployment completion comment to all tickets with timestamp

---

## 🐛 Rollback Plan (If Issues Occur)

### Pipeline Rollback
1. Navigate to pipeline history
2. Identify previous successful deployment
3. Redeploy previous version
4. Document issues encountered

### Code Rollback
```powershell
# Revert the merge commit (if recently merged)
git revert <merge-commit-hash>
git push origin develop

# Or reset to previous commit (use with caution)
git reset --hard <previous-commit-hash>
git push origin develop --force
```

### Manual Configuration Rollback (JMSMUC-99)
- Hide/deactivate spotlight pages
- Remove widget instances from pages
- Document state for future retry

---

## 📞 Contact Information

| Role | Name | Contact |
|------|------|---------|
| **Tech Lead** | TBD | TBD |
| **DevOps** | TBD | TBD |
| **Project Manager** | TBD | TBD |

---

## 📌 Notes & Issues

### Deployment Notes
- Date: February 24, 2026
- Executed by: _________________
- Start time: _________________
- End time: _________________

### Issues Encountered
*(Document any issues here)*

---

### Known Limitations (JMSMUC-99)
- Comments can only be toggled at widget level (not per-item)
- People picker struggles with hyphenated names (workaround: manual entry)
- Multilingual: Labels tokenized, content requires manual propagation

---

## ✅ Deployment Sign-Off

- [ ] All automated deployment steps completed
- [ ] All manual deployment steps completed
- [ ] Post-deployment verification passed
- [ ] Jira tickets updated
- [ ] Client notified for UAT validation

**Deployed by**: _________________ **Date**: _________ **Time**: _________

**Reviewed by**: _________________ **Date**: _________ **Time**: _________

---

**🎉 Deployment Complete! Next Steps:**
1. Notify client for UAT testing
2. Monitor for any issues in first 24 hours
3. Prepare for Production deployment after client approval
