# LASC Dev Deployment Execution Tracking
## January 27, 2026

---

## Deployment Summary

| Item | Details |
|------|---------|
| **Project** | LA Courts (LASC) |
| **Environment** | Development |
| **Deployment Date** | January 27, 2026 |
| **Branch Created** | dev_2026.01.27.01 |
| **Source Branch** | main |
| **Ticket** | LAC-213 (CUSTOM TILES WIDGET - Enhancements) |
| **Commits Included** | `a4278c0c`, `2b489be0` |
| **Deployed By** | Diego Rosa |
| **Status** | ⏳ Ready to Start |

---

## Pre-Deployment Checklist

### Environment Validation
- [ ] Git installed and configured
- [ ] Node.js available for builds
- [ ] Access to Azure DevOps ReleaseManagement project
- [ ] Access to LACourts repository
- [ ] Pipeline LACourts-Headless-Dev is available
- [ ] Visual Studio Code with necessary extensions

### Code Review
- [ ] Pull request created from `main` to `dev_2026.01.27.01`
- [ ] Code review completed for both commits
- [ ] Commits `a4278c0c` and `2b489be0` verified in branch
- [ ] No merge conflicts detected
- [ ] Changes reviewed and approved

### Work Item Linking
- [ ] LAC-213 linked to pull request
- [ ] Work item status updated to "Deploying to Dev"
- [ ] Deployment notes added to LAC-213

---

## Deployment Execution Log

### Step 1: Create Deployment Branch
**Status:** ⏳ Pending  
**Time Started:** _________  
**Time Completed:** _________  
**Command:**
```bash
git checkout main
git pull origin main
git checkout -b dev_2026.01.27.01
git push origin dev_2026.01.27.01
```

**Notes:**
- Branch Name: `dev_2026.01.27.01`
- Source: `main`
- Verify commits `a4278c0c` and `2b489be0` are in the branch

**Verification:**
```bash
git log --oneline --grep="LAC-213" -5
git log --oneline | grep -E "(a4278c0c|2b489be0)"
```

---

### Step 2: Verify Commits in Branch
**Status:** ⏳ Pending  
**Time Started:** _________  
**Time Completed:** _________  

**Commits to Verify:**
1. **a4278c0c** - LAC-213 - Sort entries alphabetically by RefinementName, with 'All' at the end
2. **2b489be0** - LAC-213 - Auto-trigger Apply Filters when checkboxes change

**Verification Command:**
```bash
git log --oneline --all --decorate | grep -E "(a4278c0c|2b489be0)"
git show a4278c0c --stat
git show 2b489be0 --stat
```

**Notes:**
- Confirmed commit a4278c0c present: [ ]
- Confirmed commit 2b489be0 present: [ ]
- No unexpected changes in branch: [ ]

---

### Step 3: Create Pull Request
**Status:** ⏳ Pending  
**Time Started:** _________  
**Time Completed:** _________  

**Pull Request Details:**
- **Source Branch:** `dev_2026.01.27.01`
- **Target Branch:** `main` (for tracking only, not merging)
- **Title:** "LAC-213: Custom Tiles Widget Enhancements - Dev Deployment Jan 27 2026"
- **Description:** Include release notes summary
- **Work Items:** Link LAC-213

**Azure DevOps PR URL:**
_________________________________________

**Notes:**
- Pull request created: [ ]
- LAC-213 linked to PR: [ ]
- Reviewers assigned: [ ]
- PR approved: [ ]

---

### Step 4: Execute Pipeline Deployment
**Status:** ⏳ Pending  
**Time Started:** _________  
**Time Completed:** _________  

**Pipeline Details:**
- **Pipeline Name:** LACourts-Headless-Dev
- **Branch:** `dev_2026.01.27.01`
- **Build Number:** _________

**Pipeline Execution:**
1. Navigate to Azure DevOps Pipelines
2. Select "LACourts-Headless-Dev"
3. Click "Run pipeline"
4. Select branch: `dev_2026.01.27.01`
5. Confirm and run

**Pipeline URL:**
_________________________________________

**Build Results:**
- Build Status: [ ] Success / [ ] Failed
- Deployment Status: [ ] Success / [ ] Failed
- Duration: _________ minutes

**Notes:**
_________________________________________
_________________________________________

---

### Step 5: Post-Deployment Verification
**Status:** ⏳ Pending  
**Time Started:** _________  
**Time Completed:** _________  

**Smoke Tests:**

#### Test 1: Verify Alphabetical Sorting of Filters
- [ ] Navigate to page with Custom Tiles Widget
- [ ] Open filter panel
- [ ] Confirm refinement names are sorted alphabetically
- [ ] Verify 'All' option appears at the end
- **Result:** _____ Pass / Fail
- **Notes:** _________________________________________

#### Test 2: Verify Auto-Apply Filters
- [ ] Navigate to page with Custom Tiles Widget
- [ ] Select a filter checkbox
- [ ] Verify results update immediately (without clicking Apply button)
- [ ] Deselect checkbox
- [ ] Verify results update again automatically
- **Result:** _____ Pass / Fail
- **Notes:** _________________________________________

#### Test 3: Verify Multiple Filter Selections
- [ ] Select multiple filter checkboxes
- [ ] Verify each selection triggers automatic filtering
- [ ] Confirm results reflect all selected filters
- [ ] Clear filters one by one
- [ ] Verify results update with each deselection
- **Result:** _____ Pass / Fail
- **Notes:** _________________________________________

#### Test 4: Console Error Check
- [ ] Open browser developer console
- [ ] Navigate to Custom Tiles Widget page
- [ ] Interact with filters
- [ ] Verify no JavaScript errors appear
- **Result:** _____ Pass / Fail
- **Console Errors (if any):** _________________________________________

---

### Step 6: Update Work Item Status
**Status:** ⏳ Pending  
**Time Started:** _________  
**Time Completed:** _________  

**Actions:**
- [ ] Update LAC-213 status to "Deployed to Dev"
- [ ] Add deployment timestamp comment
- [ ] Add link to this execution document
- [ ] Add smoke test results summary
- [ ] Notify stakeholders (Jenna Lee, team)

**Work Item URL:**
https://akumina.atlassian.net/browse/LAC-213

**Notes:**
_________________________________________

---

## Issues Encountered

### Issue Log

| Time | Issue Description | Severity | Resolution | Resolved By |
|------|------------------|----------|------------|-------------|
| ___ | _______________ | ________ | __________ | ___________ |

**Notes:**
_________________________________________
_________________________________________

---

## Rollback Procedure (If Needed)

### Rollback Decision Criteria
- Critical bugs discovered in post-deployment testing
- Filter functionality completely broken
- Application errors preventing widget use
- Stakeholder request to rollback

### Rollback Steps
1. **Immediate Action:**
   ```bash
   # Revert to previous deployment branch
   git checkout dev_2026.01.26.01
   ```

2. **Re-run Pipeline:**
   - Navigate to LACourts-Headless-Dev pipeline
   - Select branch: `dev_2026.01.26.01`
   - Execute deployment

3. **Verify Rollback:**
   - Confirm previous version is live
   - Test basic widget functionality
   - Update LAC-213 with rollback notes

4. **Document Issues:**
   - Add detailed issue description to LAC-213
   - Create new sub-tasks for fixes if needed
   - Schedule fix and re-deployment

**Rollback Executed:** [ ] Yes / [X] No  
**Rollback Time:** _________  
**Rollback By:** _________

---

## Deployment Timeline

| Phase | Start Time | End Time | Duration | Status |
|-------|-----------|----------|----------|--------|
| Pre-Deployment Checks | _______ | _______ | _______ | ⏳ |
| Branch Creation | _______ | _______ | _______ | ⏳ |
| Commit Verification | _______ | _______ | _______ | ⏳ |
| Pull Request | _______ | _______ | _______ | ⏳ |
| Pipeline Execution | _______ | _______ | _______ | ⏳ |
| Post-Deployment Tests | _______ | _______ | _______ | ⏳ |
| Work Item Update | _______ | _______ | _______ | ⏳ |
| **Total Deployment** | _______ | _______ | _______ | ⏳ |

---

## Sign-Off

### Deployment Team
- **Developer:** Diego Rosa  
  - Signature: _____________ Date: _______
  
- **Code Reviewer:** _____________  
  - Signature: _____________ Date: _______

### Stakeholder Approval
- **Product Owner:** Jenna Lee  
  - Signature: _____________ Date: _______

---

## Additional Notes

_________________________________________
_________________________________________
_________________________________________
_________________________________________

---

**Document Version:** 1.0  
**Created:** January 27, 2026  
**Last Updated:** January 27, 2026  
**Status:** Ready for Execution
