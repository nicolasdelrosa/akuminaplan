# JM Smuckers DEV Deployment - March 6, 2026
## Release Notes

---

## 📋 Deployment Information

| Item | Value |
|------|-------|
| **Deployment Date** | March 6, 2026 |
| **Environment** | Development |
| **Repository** | https://akuminadev.visualstudio.com/Smuckers |
| **Branch** | `feature/dev-deployment-mar-06-2026` |
| **Pull Request** | TBD (Create after branch push) |
| **Pipeline** | JMSmuckers-Headless-Dev |
| **Deployment Ticket** | [JMSMUC-154](https://akumina.atlassian.net/browse/JMSMUC-154) |
| **Total Tickets** | 6 |
| **Manual Steps Required** | No |
| **Release Label** | `dev-mar-06-2026` |

---

## 🎯 Tickets Included in This Deployment

### High Priority (4 tickets)

#### [JMSMUC-147](https://akumina.atlassian.net/browse/JMSMUC-147) - Update Aptos Font to Montserrat (regular)
**Type:** Task  
**Priority:** High  
**Description:**
- Change APTOS font used throughout the site to MONTSERRAT (regular)
- Montserrat is a popular, free sans-serif Google font
- Update requested by Creative services team as part of corporate ID updates

**Technical Details:**
- Import Google Font Montserrat (regular weight)
- Replace all instances of Aptos font with Montserrat across the site
- Update CSS/SCSS files with new font-family declarations
- Verify rendering across all widgets and pages

**Manual Steps:** None

---

#### [JMSMUC-148](https://akumina.atlassian.net/browse/JMSMUC-148) - Curated news headline margin updates
**Type:** Task  
**Priority:** High  
**Description:**
- Better align the headline in the curated news widget
- Move the eyeball icon inside the margins
- Define character limit for titles
- Decrease the font size

**Technical Details:**
- Update curated news widget styling
- Adjust headline margins and padding
- Reposition eyeball icon within content bounds
- Implement title character limit (truncation logic)
- Reduce headline font size for better visual hierarchy

**Manual Steps:** None

---

#### [JMSMUC-149](https://akumina.atlassian.net/browse/JMSMUC-149) - Unbold Tab Titles
**Type:** Task  
**Priority:** High  
**Description:**
- Change tab titles font-weight from 600 to 400
- Affects Featured news (Blogs) and Company news (News) tabs

**Technical Details:**
- Update tab styling CSS
- Change font-weight property from 600 (semi-bold) to 400 (normal)
- Apply to all tab widgets (news tabs, content tabs, etc.)

**Manual Steps:** None

---

#### [JMSMUC-152](https://akumina.atlassian.net/browse/JMSMUC-152) - Change Custom Calendar View Labels
**Type:** Task  
**Priority:** High  
**Description:**
- Update calendar widget labels for better clarity
- Changes:
  - Main header: "UPCOMING EVENTS"
  - "Today's Events" → "TODAY"
  - "Upcoming Events" → "FUTURE"
  - Bottom button: "CALENDAR VIEW"

**Technical Details:**
- Update calendar widget language tokens/labels
- Modify widget configuration files
- Update both widget code and/or language files

**Manual Steps:** None

---

### Medium Priority (2 tickets)

#### [JMSMUC-150](https://akumina.atlassian.net/browse/JMSMUC-150) - People Directory left filter - remove cream background and replace with white
**Type:** Task  
**Priority:** Medium  
**Description:**
- Update People Directory filter panel styling
- Keep the header purple in color
- Change the background of the filter menu from cream to white

**Technical Details:**
- Update People Directory widget CSS
- Change filter panel background-color to white (#FFFFFF)
- Maintain purple header styling
- Ensure proper contrast and readability

**Manual Steps:** None

---

#### [JMSMUC-151](https://akumina.atlassian.net/browse/JMSMUC-151) - Change Light Green Footer background to Smuckers Blue
**Type:** Task  
**Priority:** Medium  
**Description:**
- Update footer background color
- Current: Smuckers Light Green (#8bc23e)
- New: Smuckers Blue (#00a79d)

**Technical Details:**
- Update footer component styling
- Replace background-color from #8bc23e to #00a79d
- Verify text contrast for accessibility
- Test on all page layouts

**Manual Steps:** None

---

## ✅ Pre-Deployment Checklist

### Code & Repository
- [ ] All code changes committed to local branch
- [ ] Branch created: `feature/dev-deployment-mar-06-2026`
- [ ] Code reviewed locally
- [ ] No merge conflicts with `main` or `develop` branch
- [ ] All 6 tickets verified in "Ready for Dev Deploy" status in Jira
- [ ] Release notes reviewed and approved

### Testing & Validation
- [ ] Local build successful
- [ ] No TypeScript/compilation errors
- [ ] Widget configurations validated
- [ ] No console errors in browser developer tools
- [ ] Font rendering tested across browsers (Chrome, Edge, Firefox)
- [ ] Color changes validated against brand guidelines

### Documentation
- [ ] Release notes document created: `JMSMUC_Dev_Deployment_Mar_06_2026_Release_Notes.md`
- [ ] DOCX version generated: `JMSMUC_Dev_Deployment_Mar_06_2026_Release_Notes.docx`
- [ ] Jira deployment ticket created: [JMSMUC-154](https://akumina.atlassian.net/browse/JMSMUC-154)
- [ ] All related tickets tagged with `dev-mar-06-2026` label

---

## 🚀 Deployment Execution Steps

### Step 1: Create and Push Branch
```powershell
# Navigate to repository directory
cd c:\repos\Smuckers  # Update path as needed

# Ensure you're on the latest main/develop branch
git checkout develop
git pull origin develop

# Create deployment branch
git checkout -b feature/dev-deployment-mar-06-2026

# Verify all changes are committed
git status

# Push branch to Azure DevOps
git push origin feature/dev-deployment-mar-06-2026
```
- [ ] Branch created and pushed successfully
- [ ] Verified no uncommitted changes

### Step 2: Create Pull Request
1. Navigate to: https://akuminadev.visualstudio.com/Smuckers/_git/Smuckers/pullrequests
2. Click "New Pull Request"
3. Set source branch: `feature/dev-deployment-mar-06-2026`
4. Set target branch: `develop` (or appropriate base branch)
5. Title: `DEV Deployment - March 6, 2026 - 6 Tickets`
6. Description:
   ```
   ## Deployment Tickets
   - JMSMUC-147 - Update Aptos Font to Montserrat
   - JMSMUC-148 - Curated news headline margin updates
   - JMSMUC-149 - Unbold Tab Titles
   - JMSMUC-152 - Change Custom Calendar View Labels
   - JMSMUC-150 - People Directory filter background color
   - JMSMUC-151 - Change Footer background to Smuckers Blue
   
   ## Release Notes
   See: JMSMUC_Dev_Deployment_Mar_06_2026_Release_Notes.docx
   
   ## Deployment Ticket
   JMSMUC-154
   ```
7. Add reviewers (if required)
8. **Update PR number below after creation**

- [ ] Pull Request created
- [ ] PR Number: `_______` (Update this after creation)
- [ ] Reviewers added (if applicable)

### Step 3: Merge Pull Request
- [ ] PR reviewed and approved (if review required)
- [ ] All checks/builds passed
- [ ] PR merged to develop branch
- [ ] Merge commit ID recorded: `_______`
- [ ] Deployment branch deleted (optional)

### Step 4: Trigger Azure Pipeline
1. Navigate to: https://akuminadev.visualstudio.com/Smuckers/_build
2. Find pipeline: `JMSmuckers-Headless-Dev`
3. Click "Run pipeline"
4. Select branch: `develop` (or merged target)
5. Monitor pipeline execution

**Pipeline Steps to Monitor:**
- [ ] Build stage started
- [ ] Build completed successfully
- [ ] Deployment stage started
- [ ] Deployment to DEV environment successful
- [ ] No errors in pipeline logs

**Pipeline Information:**
- [ ] Pipeline Run ID: `_______`
- [ ] Build Number: `_______`
- [ ] Start Time: `_______`
- [ ] End Time: `_______`
- [ ] Duration: `_______`

---

## 🧪 Post-Deployment Verification

### Visual Verification Checklist
- [ ] **Font Changes (JMSMUC-147)**
  - [ ] Homepage displays Montserrat font
  - [ ] All text content using new font (not Aptos)
  - [ ] Font loads properly (no FOIT/FOUT issues)
  - [ ] Tested in Chrome, Edge, Firefox

- [ ] **Curated News Widget (JMSMUC-148)**
  - [ ] Headlines aligned properly
  - [ ] Eyeball icon positioned inside margins
  - [ ] Font size reduced appropriately
  - [ ] Character limits applied to titles
  - [ ] No layout breaking with long titles

- [ ] **Tab Titles (JMSMUC-149)**
  - [ ] Featured news (Blogs) tab titles not bold
  - [ ] Company news (News) tab titles not bold
  - [ ] Font-weight appears as 400 (normal)
  - [ ] Tab styling consistent across widgets

- [ ] **Calendar Widget (JMSMUC-152)**
  - [ ] Main header displays "UPCOMING EVENTS"
  - [ ] Tab shows "TODAY" (not "Today's Events")
  - [ ] Tab shows "FUTURE" (not "Upcoming Events")
  - [ ] Bottom button reads "CALENDAR VIEW"
  - [ ] Widget functionality working correctly

- [ ] **People Directory (JMSMUC-150)**
  - [ ] Left filter panel background is white
  - [ ] Header remains purple
  - [ ] No cream/beige background visible
  - [ ] Filter functionality working
  - [ ] Good contrast and readability

- [ ] **Footer Styling (JMSMUC-151)**
  - [ ] Footer background is Smuckers Blue (#00a79d)
  - [ ] No light green (#8bc23e) visible
  - [ ] Text contrast acceptable
  - [ ] Footer appears on all pages tested

### Functional Testing
- [ ] Homepage loads without errors
- [ ] All widgets render correctly
- [ ] No JavaScript console errors
- [ ] No CSS/styling conflicts
- [ ] Page load performance acceptable

### URLs to Test
- [ ] Homepage: [DEV URL]
- [ ] People Directory: [DEV URL]/peopledirectory
- [ ] News/Blogs pages with tabs
- [ ] Calendar pages
- [ ] Any custom pages with affected widgets

### Browser Testing
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if applicable)

---

## 🔄 Rollback Plan

### If Deployment Issues Occur:

#### Option 1: Revert Pull Request (Preferred)
```powershell
# Create revert commit
git revert <merge-commit-id>
git push origin develop

# Trigger pipeline to redeploy reverted code
```

#### Option 2: Restore Previous Build
1. Navigate to Azure Pipeline history
2. Find last successful deployment before this release
3. Re-run that pipeline to restore previous state
4. Document build number: `_______`

#### Option 3: Hot-fix Branch (For Specific Issues)
```powershell
# Create hotfix branch from last stable commit
git checkout -b hotfix/mar-06-deployment-issue

# Make necessary fixes
# Test locally
# Push and create PR for expedited review
```

### Rollback Decision Criteria:
- Site is inaccessible or major functionality broken
- Critical visual bugs affecting user experience
- Performance degradation > 50%
- Security vulnerabilities introduced

### Rollback Contacts:
- **Technical Lead:** [Name/Email]
- **Project Manager:** [Name/Email]
- **DevOps:** [Name/Email]

---

## 📊 Post-Deployment Tasks

### Jira Updates
- [ ] Update [JMSMUC-154](https://akumina.atlassian.net/browse/JMSMUC-154) with deployment completion
- [ ] Move all deployed tickets to "Deployed to DEV" status:
  - [ ] JMSMUC-147
  - [ ] JMSMUC-148
  - [ ] JMSMUC-149
  - [ ] JMSMUC-152
  - [ ] JMSMUC-150
  - [ ] JMSMUC-151
- [ ] Add comment to all tickets with deployment date and build number
- [ ] Link tickets to deployment ticket JMSMUC-154

### Documentation
- [ ] Update this release notes document with actual PR number, pipeline IDs
- [ ] Document any issues encountered and resolutions
- [ ] Update deployment log/tracking spreadsheet (if applicable)

### Communication
- [ ] Notify QA team that DEV is ready for testing
- [ ] Send deployment summary email to stakeholders
- [ ] Update project status in client communications

### Monitoring (First 24-48 hours)
- [ ] Monitor application insights for errors
- [ ] Check user feedback/reports from QA team
- [ ] Review performance metrics
- [ ] Address any immediate issues

---

## 📝 Notes & Issues

### Known Issues Before Deployment:
- None identified

### Issues Discovered During Deployment:
- [ ] Issue: `_______________________`
  - Resolution: `_______________________`
  - Documented in: `_______________________`

### Recommendations for Future Deployments:
- [ ] `_______________________`

---

## ✅ Deployment Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **Developer** | | | |
| **Tech Lead** | | | |
| **DevOps** | | | |
| **QA Lead** | | | |

---

## 📚 References

- **Jira Project:** https://akumina.atlassian.net/browse/JMSMUC
- **Deployment Ticket:** https://akumina.atlassian.net/browse/JMSMUC-154
- **Azure DevOps Repo:** https://akuminadev.visualstudio.com/_git/Smuckers
- **Azure Pipelines:** https://akuminadev.visualstudio.com/Smuckers/_build
- **Release Notes (DOCX):** `JMSMUC_Dev_Deployment_Mar_06_2026_Release_Notes.docx`

---

**Document Version:** 1.0  
**Created:** March 5, 2026  
**Last Updated:** March 5, 2026  
**Created By:** Akumina Deployment Automation
