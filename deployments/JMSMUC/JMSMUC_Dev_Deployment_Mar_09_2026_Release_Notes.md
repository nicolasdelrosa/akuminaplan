# JM Smuckers Dev Deployment Release Notes
## March 9, 2026

---

## Deployment Information

| **Item** | **Details** |
|----------|-------------|
| **Deployment Date** | March 9, 2026 |
| **Environment** | Development |
| **Repository** | https://akuminadev.visualstudio.com/Smuckers |
| **Branch** | `feature/dev-deployment-mar-09-2026` |
| **Pull Request** | TBD |
| **Pipeline** | JMSmuckers-Headless-Dev |
| **Deployment Ticket** | [JMSMUC-188](https://akumina.atlassian.net/browse/JMSMUC-188) |
| **Total Tickets** | 6 |
| **Manual Steps Required** | No |
| **Release Label** | `dev-mar-09-2026` |

---

## Executive Summary

This deployment focuses on **performance optimizations** for the JM Smuckers development environment. All 6 tickets are subtasks of JMSMUC-63 (Performance Tuning) and are designed to improve page load times, reduce visual glitches during loading, and enhance the overall user experience.

**Key Improvements:**
- Lazy loading for images to reduce initial page load
- CSS optimizations to hide loading artifacts
- Profile image preloading with default avatar
- Footer height stabilization to prevent page jumping
- Themed throttle page for consistent branding

**No manual deployment steps required** - all changes are code-based.

---

## Tickets Included

### High Priority Tickets

*None in this release*

### Medium Priority Tickets

#### **[JMSMUC-172](https://akumina.atlassian.net/browse/JMSMUC-172) - Image loading="lazy"**
- **Type**: Sub-task
- **Priority**: Medium
- **Parent**: JMSMUC-63 (Performance Tuning)
- **Description**: 
  - **Setup**: N/A
  - **Test**: Identify any images that have not had the attribute 'loading="lazy"' applied
  - **Remediation**: Add the 'loading="lazy"' attribute to all images
- **Expected Impact**: Reduced initial page load time by deferring off-screen image loading

---

#### **[JMSMUC-176](https://akumina.atlassian.net/browse/JMSMUC-176) - Loading bars**
- **Type**: Sub-task
- **Priority**: Medium
- **Parent**: JMSMUC-63 (Performance Tuning)
- **Description**:
  - **Setup**: N/A
  - **Test**: Verify if the loading bars are displayed
  - **Remediation**: Apply the CSS to remove the loading bars
- **Expected Impact**: Cleaner UI experience by hiding loading artifacts that flash during page initialization

---

#### **[JMSMUC-179](https://akumina.atlassian.net/browse/JMSMUC-179) - Profile image preload**
- **Type**: Sub-task
- **Priority**: Medium
- **Parent**: JMSMUC-63 (Performance Tuning)
- **Description**:
  When loading the site, the top profile image sometimes appears as blank/unset. This effect can be lessened by loading a default avatar, which is then replaced by the user's image.
  
  **Implementation**:
  - In the master page, locate the element with class "userImageDisplay"
  - Set the src property to the base64 of a default image file
  - Use SharePoint default user avatar as fallback
  - **Note**: Headless cache must be cleared to see master page updates
  
  **Default User Image**:
  The implementation uses the base64 encoding of the SharePoint default user avatar to provide instant visual feedback while the actual profile image loads from Microsoft Graph.

- **Expected Impact**: Eliminates blank profile image flash on page load; improved perceived performance

---

#### **[JMSMUC-180](https://akumina.atlassian.net/browse/JMSMUC-180) - Hide load spinner**
- **Type**: Sub-task
- **Priority**: Medium
- **Parent**: JMSMUC-63 (Performance Tuning)
- **Description**:
  - **Setup**: N/A
  - **Test**: Identify if the load spinner is displayed
  - **Remediation**: Suppress the spinner effect via CSS if desired
- **Expected Impact**: Reduced visual noise during page load; more polished user experience

---

#### **[JMSMUC-181](https://akumina.atlassian.net/browse/JMSMUC-181) - Footer default height**
- **Type**: Sub-task
- **Priority**: Medium
- **Parent**: JMSMUC-63 (Performance Tuning)
- **Description**:
  - **Setup**: N/A
  - **Test**: Identify if the page shifts down as widgets load
  - **Remediation**: Set a footer minimum height CSS style which would reduce the "jumpiness" on the load
- **Expected Impact**: Prevents layout shift (CLS) during page load; stable footer positioning

---

#### **[JMSMUC-185](https://akumina.atlassian.net/browse/JMSMUC-185) - Apply client theme to throttle.html**
- **Type**: Sub-task
- **Priority**: Medium
- **Parent**: JMSMUC-63 (Performance Tuning)
- **Description**: Apply Smuckers branding and theme to the throttle.html page for consistent user experience during high-traffic scenarios
- **Expected Impact**: Branded throttle page maintains visual consistency even during traffic throttling

---

## Pre-Deployment Checklist

### Code & Repository
- [ ] All code changes have been committed to feature branch
- [ ] Code has been reviewed and approved
- [ ] No merge conflicts exist
- [ ] Branch is up to date with `develop`

### Testing & Validation
- [ ] All tickets have been tested in local/sandbox environment
- [ ] Performance improvements have been verified (lazy loading, reduced CLS, etc.)
- [ ] CSS changes do not negatively impact other page elements
- [ ] Master page changes have been tested with cache clearing
- [ ] Browser testing completed (Chrome, Edge, Firefox)

### Documentation
- [ ] Release notes reviewed and approved
- [ ] All tickets tagged with `dev-mar-09-2026` label
- [ ] Deployment ticket JMSMUC-188 is updated

---

## Deployment Execution Steps

### Step 1: Create and Push Branch
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/dev-deployment-mar-09-2026

# Push branch to remote
git push origin feature/dev-deployment-mar-09-2026
```

### Step 2: Create Pull Request
1. Navigate to Azure DevOps: https://akuminadev.visualstudio.com/Smuckers
2. Create Pull Request:
   - **Source Branch**: `feature/dev-deployment-mar-09-2026`
   - **Target Branch**: `develop`
   - **Title**: "Dev Deployment - March 9, 2026 - Performance Optimizations"
   - **Description**: Link to JMSMUC-188 and this release notes document
3. Add reviewers and wait for approval

### Step 3: Merge Pull Request
1. Ensure all PR checks have passed
2. Merge the pull request to `develop`
3. Delete the feature branch after successful merge

### Step 4: Trigger Azure Pipeline
1. Navigate to Pipeline: JMSmuckers-Headless-Dev
2. Trigger manual deployment to Development environment
3. Monitor deployment progress
4. Verify deployment completion

---

## Manual Deployment Steps

**No manual deployment steps required for this release.**

All changes are code-based (CSS, HTML, image attributes) and will be deployed automatically through the Azure DevOps pipeline.

---

## Post-Deployment Verification

### Performance Validation
1. **Image Lazy Loading** (JMSMUC-172)
   - Navigate to homepage
   - Open browser DevTools → Network tab
   - Scroll down page slowly
   - Verify images load as they enter viewport
   - Images should have `loading="lazy"` attribute in HTML

2. **Loading Bars Hidden** (JMSMUC-176)
   - Navigate to multiple pages
   - Observe page load sequence
   - Verify no visible loading bars appear during widget initialization

3. **Profile Image Preload** (JMSMUC-179)
   - Log in as test user
   - Clear browser cache
   - Reload homepage
   - Verify profile image area shows default avatar immediately (no blank space)
   - Verify actual profile photo loads and replaces default avatar

4. **Load Spinner Suppressed** (JMSMUC-180)
   - Clear cache and reload pages
   - Verify no loading spinner displays during page initialization
   - Check multiple pages for consistency

5. **Footer Height Stable** (JMSMUC-181)
   - Load homepage with throttled network (DevTools → Network → Slow 3G)
   - Observe footer position during page load
   - Verify footer does not "jump" or shift as widgets load above it
   - Measure Cumulative Layout Shift (CLS) in Lighthouse

6. **Throttle Page Theme** (JMSMUC-185)
   - Access throttle.html page directly (if possible in dev)
   - Verify Smuckers branding is applied (colors, logo, fonts)
   - Verify consistent look and feel with rest of site

### Browser Testing
Test all verifications above in:
- [ ] Chrome (latest version)
- [ ] Microsoft Edge (latest version)
- [ ] Firefox (latest version)

### Performance Metrics
Using Google Lighthouse or similar tools, measure and compare before/after:
- [ ] Page Load Time (should decrease)
- [ ] Largest Contentful Paint (LCP) - should improve
- [ ] Cumulative Layout Shift (CLS) - should improve with footer fix
- [ ] Time to Interactive (TTI)

### URLs to Test
- **Homepage**: https://jmsmuckers-dev.sharepoint.com/sites/smuckers-sandbox-delivery
- **People Directory**: https://jmsmuckers-dev.sharepoint.com/sites/smuckers-sandbox-delivery#/sitepages/peoplefinder.aspx
- **Events Calendar**: https://jmsmuckers-dev.sharepoint.com/sites/smuckers-sandbox-delivery#/sitepages/events.aspx
- **News Listing**: https://jmsmuckers-dev.sharepoint.com/sites/smuckers-sandbox-delivery#/sitepages/news.aspx

---

## Rollback Plan

If critical issues are discovered post-deployment:

### Quick Rollback (Recommended)
1. Navigate to Azure Pipeline: JMSmuckers-Headless-Dev
2. Locate previous successful deployment (March 6, 2026)
3. Redeploy that version to Development environment
4. Estimated rollback time: **5-10 minutes**

### Git Rollback (Alternative)
```bash
# Revert the merge commit
git checkout develop
git pull origin develop
git revert -m 1 <merge-commit-hash>
git push origin develop

# Trigger pipeline deployment
```

### Manual CSS Override (Emergency)
If only CSS issues occur, they can be quickly overridden by:
1. Adding CSS rules to override problematic styles
2. Deploying hotfix branch with CSS changes only
3. Estimated time: **15-20 minutes**

---

## Notes / Known Issues

1. **Performance Improvements Subjective**: Some performance improvements (like hiding spinners, loading bars) improve *perceived* performance but may not significantly impact measurable load times.

2. **Master Page Cache**: JMSMUC-179 (profile image preload) requires headless cache clearing to take effect. This will happen automatically during deployment.

3. **Lazy Loading Browser Support**: The `loading="lazy"` attribute is supported in all modern browsers but will gracefully degrade in older browsers to standard image loading.

4. **CLS Improvement**: JMSMUC-181 (footer height) should improve Cumulative Layout Shift scores in Lighthouse audits, which is important for SEO and user experience.

5. **Parent Ticket**: All 6 tickets in this deployment are subtasks of JMSMUC-63 (Performance Tuning). The parent ticket can remain open until all performance work is complete.

6. **Testing in Production**: These are low-risk CSS and HTML attribute changes, but should still be validated in dev before promoting to production.

---

## Contact Information

**Deployment Manager**: TBD  
**Technical Lead**: TBD  
**Client Stakeholder**: Katie Jo (JM Smuckers)  

**Support**:
- Jira: https://akumina.atlassian.net/browse/JMSMUC
- Azure DevOps: https://akuminadev.visualstudio.com/Smuckers

---

## Revision History

| **Date** | **Version** | **Author** | **Changes** |
|----------|-------------|------------|-------------|
| March 9, 2026 | 1.0 | Deployment Team | Initial release notes created |

---

**End of Release Notes**
