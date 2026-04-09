# JM Smuckers PROD Deployment Release Notes
## March 10, 2026

---

## Deployment Information

| **Item** | **Details** |
|----------|-------------|
| **Deployment Date** | March 10, 2026 |
| **Environment** | Production |
| **Repository** | https://akuminadev.visualstudio.com/Smuckers |
| **Branch** | `TBD (will be promoted from DEV after successful testing)` |
| **Pull Request** | TBD (Create after branch push) |
| **Pipeline** | JMSmuckers-Headless-Prod |
| **Deployment Ticket** | [JMSMUC-193](https://akumina.atlassian.net/browse/JMSMUC-193) |
| **Total Tickets** | 11 |
| **Manual Steps Required** | Yes (JMSMUC-186 requires manual steps) |
| **Release Label** | `prod-mar-10-2026` |

---

## Executive Summary

This deployment includes **2 critical NEW features** that must be deployed tonight, plus **9 catch-up tickets** from previous releases that were not successfully deployed. The release contains high-priority bug fixes, performance optimizations, and UI enhancements for the JM Smuckers Production environment.

**CRITICAL - New for Tonight:**
- **JMSMUC-186**: Our People widget rebuild as Author App with new sorting logic (**REQUIRES MANUAL STEPS**)
- **JMSMUC-189**: Disable comments on all News and Blog content types (bug fix)

**Catch-up Tickets (9):**
- **Critical Bug Fixes**: Language switcher functionality, display message formatting, font rendering
- **Performance Optimizations**: CDN implementation for static files, minified JS/CSS
- **UI Enhancements**: Social icon color updates, news/blogs tab improvements, events persona support
- **Documentation**: Spotlight configuration guide for content authors

**⚠️ IMPORTANT**: JMSMUC-186 has manual configuration steps that must be performed during deployment (see ticket details below).

---

## Tickets Included in This Deployment

### ⚠️ CRITICAL - NEW Tickets for Tonight (2 tickets - HIGHEST Priority)

#### **[JMSMUC-186](https://akumina.atlassian.net/browse/JMSMUC-186) - Our People: order by latest persona added goes to top of active people list**
- **Type**: Task
- **Priority**: Highest
- **Status**: Ready for Prod Deploy
- **Labels**: UAT, manualdeployment
- **Description**: 
  
  **Problem**: The current slider widget is unsuitable for large content lists (>20 items) because its drag-and-drop ordering is inefficient and prone to conflicts among multiple editors.
  
  **Solution**: Rebuild the existing "Our People" widget as an Author-based app and implement new sorting logic:
  - **Primary Sort**: Publish Date (newest first)
  - **Secondary Sort**: Alphabetical (for items with the same publish date)
  
  **Requirements**:
  - Rebuild the current **Our People widget** using the **Author App framework**
  - Implement the new sorting logic (newest publish date first, then alphabetical)
  - Ensure the widget pulls author data correctly from the new app structure
  - Validate that the sorting behavior displays results in the intended order
  - Confirm compatibility with existing pages where the widget is currently used
  
- **Technical Changes**: 
  - Converted Our People widget from slider-based to Author App architecture
  - Implemented dual-level sorting: Publication Date (primary), Alphabetical (secondary)
  - Hidden SortOrder field from content app (no longer used)
  - Imported GenericListWidget to Central Site for author functionality
  
- **⚠️ MANUAL DEPLOYMENT STEPS** (CRITICAL):
  1. **Change Our People content app from slider to Author**
     - Navigate to Central Site Content App configuration
     - Locate "Our People" content app
     - Change type from "Slider" to "Author"
  
  2. **Hide the field SortOrder from content app**
     - Edit Our People content app schema
     - Set "SortOrder" field visibility to hidden
     - Save changes
  
  3. **Import GenericListWidget to Central Site**
     - Deploy GenericListWidget assets to Central Site
     - Verify widget registration
     - Test widget rendering

- **Testing Notes**:
  - Verify new people are sorted by publish date (newest first)
  - Verify people with the same publish date are sorted alphabetically
  - Verify active checkbox filters correctly
  - Verify no conflicts when multiple editors publish simultaneously
  - Verify all existing pages using Our People widget render correctly
  
---

#### **[JMSMUC-189](https://akumina.atlassian.net/browse/JMSMUC-189) - Disable comments on all Company (i.e. global news) and Featured news (i.e blogs)**
- **Type**: Bug
- **Priority**: Highest
- **Status**: Ready for Prod Deploy
- **Labels**: UAT
- **Description**: 
  
  **Issue**: Comments are currently enabled on all News and Event articles, which does not align with original requirements. Per the initial design, comments should only be enabled on the "Our People" widget.
  
  **Goal**: Disable comments on all news and event content types (target: tonight's deployment).
  
  **Requirements**:
  - Disable comments on all **News** content types
  - Disable comments on all **Blog** content types
  - Ensure comments remain **enabled only on the "Our People" widget**
  - Confirm that disabling comments does not impact other content functionality or rendering
  - Event detail pages should continue to **NOT SHOW comments** enabled
  
- **Technical Changes**: 
  - Disabled comment functionality on Company News (global news) content type
  - Disabled comment functionality on Featured News (blogs) content type
  - Verified comments remain active only on Our People widget
  - Updated content type configurations to prevent comment rendering
  
- **Manual Steps**: None

- **Testing Notes**:
  - Verify users cannot add comments to News articles
  - Verify users cannot add comments to Blog articles
  - Verify comment functionality remains active on Our People widget
  - Verify no errors or display issues occur on existing News or Blog pages
  - Verify Event detail pages do not show comment controls

---

### Highest Priority - Catch-up Tickets (1 ticket)

#### **[JMSMUC-138](https://akumina.atlassian.net/browse/JMSMUC-138) - PROD - language switcher is stuck on English**
- **Type**: Bug
- **Priority**: Highest
- **Status**: Done
- **Description**: 
  
  **Issue**: When users attempt to switch languages from the Employee profile widget, the page appears to reload but content remains in English. Upon reopening the language switcher, English is still selected.
  
  **Steps to Reproduce**:
  1. Go to homepage
  2. Open "Switch language" in Employee profile
  3. Select French Canadian or Spanish
  4. Click "Switch language"
  5. Observe page seemingly loads but nothing is translated (not even OOTB tokens)
  6. Re-open language switcher and notice English is still selected
  
  **Expected Behavior**: Page should display in selected language with at least translated language tokens visible, even if custom content hasn't been translated yet by content authors.

- **Technical Changes**: 
  - Fixed language switcher persistence logic
  - Corrected language token loading mechanism
  - Updated multi-language support for French Canadian and Spanish
  
- **Manual Steps**: None

- **Testing Notes**:
  - Verify language switching to French Canadian displays French tokens
  - Verify language switching to Spanish displays Spanish tokens
  - Verify selected language persists in user profile
  - Verify language preference is maintained across page reloads

---

### High Priority (3 tickets)

#### **[JMSMUC-142](https://akumina.atlassian.net/browse/JMSMUC-142) - OUR PEOPLE: Content Author needs to be able to format Display Message**
- **Type**: Bug
- **Priority**: High
- **Status**: Done
- **Description**: 
  
  **Issue**: Content authors cannot format the "Display Message" field in the OUR PEOPLE content type. The field currently appears as plain text input without rich text formatting capabilities (CKEditor).
  
  **Current State (DEV/PROD)**: Plain text field without formatting options
  
  **Expected State (AKBPS)**: CKEditor-enabled field with full rich text formatting capabilities including:
  - Bold, italic, underline text formatting
  - Font size and color options
  - Hyperlinks
  - Bulleted and numbered lists
  - Other standard rich text features
  
- **Technical Changes**: 
  - Enabled CKEditor for "Display Message" field in OUR PEOPLE content type
  - Configured editor toolbar with appropriate formatting options
  - Updated field rendering to support HTML content
  
- **Manual Steps**: 
  1. Navigate to Site Settings → OUR PEOPLE Content Type
  2. Locate "Display Message" field configuration
  3. Verify CKEditor is enabled for the field
  4. Test creating/editing content to confirm rich text formatting works
  
- **Testing Notes**:
  - Create new OUR PEOPLE item and verify rich text editor appears
  - Test all formatting options (bold, italic, colors, links, etc.)
  - Verify formatted content displays correctly on front-end
  - Confirm existing plain text content still displays properly

---

#### **[JMSMUC-144](https://akumina.atlassian.net/browse/JMSMUC-144) - Documentation needed for updating Spotlight type on DEV/PROD**
- **Type**: Task
- **Priority**: High
- **Status**: Done
- **Description**: 
  
  **Issue**: Content authors are seeing "Spotlight1", "Spotlight2", "Spotlight3" as options in dropdown fields, rather than meaningful spotlight type names. There is no documentation explaining:
  - The difference between Spotlight1, Spotlight2, and Spotlight3
  - How to connect spotlights to their corresponding Terms in taxonomy
  - How to update these to more user-friendly names
  
  **Current State (CLIENT DEV)**: Dropdown shows "Spotlight1", "Spotlight2", "Spotlight3"
  
  **Expected State (AKBPS)**: Clear, descriptive spotlight type names that content authors understand
  
- **Deliverables**: 
  - Documentation created in `deployments/JMSMUC/JMSMUC_Term_Set_Configuration_Guide.md`
  - Step-by-step instructions for connecting spotlight types to taxonomy terms
  - Best practices for naming spotlight types
  
- **Manual Steps**: 
  1. Review the created documentation: [JMSMUC_Term_Set_Configuration_Guide.md](JMSMUC_Term_Set_Configuration_Guide.md)
  2. Follow documentation to update Spotlight term set in Term Store Management
  3. Update site columns to reference correct term set
  4. Verify content authors see updated spotlight type names
  
- **Related Documentation**: See `JMSMUC_Term_Set_Configuration_Guide.md` for full configuration guide

---

#### **[JMSMUC-136](https://akumina.atlassian.net/browse/JMSMUC-136) - PROD - Curated News Bebas Neue needs to be added**
- **Type**: Bug
- **Priority**: High
- **Status**: Done
- **Description**: 
  
  **Issue**: The main article headline in the Curated News widget is not using the correct "Bebas Neue" font family, resulting in inconsistent typography with AKBPS sandbox.
  
  **Current State (PROD)**: Curated news headline uses default/fallback font
  
  **Expected State (AKBPS Sandbox)**: Headline displays in Bebas Neue font
  
  **Site URL**: https://neighborhood.jmsmucker.com/sites/neighborhooddelivery
  
- **Technical Changes**: 
  - Added Bebas Neue font import to site
  - Updated Curated News widget CSS to use Bebas Neue for main article headline
  - Ensured font fallbacks are properly configured
  
- **Manual Steps**: None

- **Testing Notes**:
  - Navigate to page with Curated News widget
  - Verify main article headline displays in Bebas Neue font
  - Test across different browsers (Chrome, Edge, Firefox)
  - Compare with AKBPS sandbox to ensure visual consistency

---

### Medium Priority (5 tickets)

#### **[JMSMUC-169](https://akumina.atlassian.net/browse/JMSMUC-169) - CDN - static files**
- **Type**: Sub-task (Parent: JMSMUC-63 - Performance Tuning)
- **Priority**: Medium
- **Status**: Done
- **Description**: 
  
  **Setup**: Verify if site is using a CDN for static files (CSS and JS). If not, perform baseline test, enable CDN, and perform test again.
  
  **Test**: Measure average difference in load times with and without CDN
  
  **Remediation**: Ensure a CDN is enabled and in use for the production site for CSS and JS files.
  
  **Reference**: https://akumina.github.io/docs/Akumina-Framework-Performance-Considerations#cdn
  
- **Technical Changes**: 
  - Configured CDN endpoints for static file delivery
  - Updated asset references to use CDN URLs
  - Implemented caching strategies for CSS and JavaScript files
  - Added CDN fallback mechanisms for reliability
  
- **Manual Steps**: 
  1. Verify CDN configuration in App Manager Settings
  2. Check that CSS and JS files are being served from CDN
  3. Run performance tests to validate load time improvements
  4. Monitor CDN usage and hit rates
  
- **Expected Impact**: 
  - Reduced page load times (target: 20-30% improvement)
  - Lower server bandwidth usage
  - Improved global content delivery
  - Better user experience especially for remote users

---

#### **[JMSMUC-187](https://akumina.atlassian.net/browse/JMSMUC-187) - Minified Js and Css**
- **Type**: Sub-task (Parent: JMSMUC-63 - Performance Tuning)
- **Priority**: Medium
- **Status**: Done
- **Description**: 
  
  **Objective**: Ensure all JavaScript and CSS files are minified to reduce file sizes and improve page load performance.
  
  **Commit Reference**: 
  https://akuminadev.visualstudio.com/Smuckers/_git/Smuckers/commit/aa2a700102690498a7777a9851f79341d28ecec1?refName=refs%2Fheads%2Fmaster
  
- **Technical Changes**: 
  - Configured build pipeline to minify all JS and CSS files
  - Implemented source map generation for debugging
  - Updated deployment process to include minification step
  - Verified minified files are being deployed to environment
  
- **Manual Steps**: 
  1. Inspect page source in DEV environment
  2. Verify .min.js and .min.css files are being loaded
  3. Check file sizes are significantly reduced vs. non-minified versions
  4. Test all functionality to ensure minification didn't break any features
  
- **Expected Impact**: 
  - Reduced file sizes (typical reduction: 40-60%)
  - Faster file download times
  - Lower bandwidth consumption
  - Improved initial page load performance

---

#### **[JMSMUC-116](https://akumina.atlassian.net/browse/JMSMUC-116) - Update Global social icons from purple to teal**
- **Type**: Task
- **Priority**: Medium
- **Status**: Done
- **Description**: 
  
  **Issue**: Social media icons throughout the site use purple color (#purple-brand-color), but brand guidelines require teal color (#teal-brand-color).
  
  **Affected Components**:
  - Global footer social icons
  - Social sharing widgets
  - Employee profile social links
  - Any other social media icon instances
  
- **Technical Changes**: 
  - Updated CSS variables for social icon colors
  - Changed icon SVG fill colors from purple to teal
  - Updated hover states to use teal color variants
  - Verified color contrast ratios meet accessibility standards
  
- **Manual Steps**: None

- **Testing Notes**:
  - Check global footer social icons display in teal
  - Verify social sharing links use teal color
  - Test hover states for proper teal highlighting
  - Confirm across all page templates and layouts

---

#### **[JMSMUC-102](https://akumina.atlassian.net/browse/JMSMUC-102) - Change All News and All Blogs tabs to match hive tab widget titles**
- **Type**: Story
- **Priority**: Medium
- **Status**: Done
- **Description**: 
  
  **Issue**: The filter labels and CTA buttons on the home page tab widget don't match the actual widget titles, causing confusion for users.
  
  **Current State**: Generic "All News" and "All Blogs" labels
  
  **Expected State**:
  
  **For "All Corporate News" Widget**:
  - Tab title: "Corporate News"
  - Default filter: "All Corporate News"
  - Additional filters: My interests, Top reacted, Popular
  - CTA label: "View ALL Corporate News"
  
  **For "All Featured News" Widget**:
  - Tab title: "Featured News"
  - Default filter: "All Featured News"
  - Additional filters: My interests, Top reacted, Popular
  - CTA label: "View ALL Featured News"
  
  **Expected Tab Order** (as of 2/4 update):
  1. Corporate News
  2. Featured News
  3. ~~Events~~ (removed - replaced with custom Events widget in right column)
  
- **Technical Changes**: 
  - Updated tab labels in widget configuration
  - Modified filter dropdown options
  - Changed CTA button text dynamically based on tab
  - Updated language tokens for new labels
  - Removed Events tab from tabbed widget
  
- **Manual Steps**: 
  1. Navigate to homepage
  2. Verify tab widget shows "Corporate News" and "Featured News" tabs
  3. Click each tab and verify:
     - Correct filter options appear
     - CTA buttons have appropriate text
     - Filter selections work correctly
  4. Verify Events tab is removed (Events widget should be in right column)
  
- **Testing Notes**:
  - Test filter functionality for each tab
  - Verify CTA links redirect to correct pages
  - Check mobile responsive behavior
  - Confirm language token translations work in French/Spanish

---

#### **[JMSMUC-137](https://akumina.atlassian.net/browse/JMSMUC-137) - PROD - Add personas to Events widget**
- **Type**: Task
- **Priority**: Medium
- **Status**: Done
- **Description**: 
  
  **Issue**: Content authors need the ability to target Events to specific personas, but the Personas tab is not appearing when creating/editing structured Events.
  
  **Current State**: No Personas tab available when editing Events in Site Settings
  
  **Expected Behavior**: Personas tab should be displayed to content authors when entering new structured Events, similar to other content types.
  
  **Known Complication**: When "Enable personas" is activated from site settings, an "Add New" slider appears that cannot be turned off. However, users need to be able to add New Events without seeing a required Event Title field appearing below the content section.
  
- **Technical Changes**: 
  - Enabled personas for Events content type
  - Configured persona targeting tab in Events form
  - Fixed form layout to prevent duplicate/unwanted fields
  - Ensured persona filtering works for Events display
  
- **Manual Steps**: 
  1. Navigate to Site Settings → Events Content Type
  2. Enable Personas if not already enabled
  3. Verify Personas tab appears in "Add New Event" form
  4. Test creating events with persona targeting
  5. Verify targeted events display correctly to appropriate persona groups
  6. Confirm no duplicate or unexpected fields appear in the form
  
- **Testing Notes**:
  - Create event with specific persona targeting
  - Log in as user with that persona and verify event is visible
  - Log in as user without that persona and verify event is hidden
  - Test persona combinations (multiple personas per event)
  - Verify backward compatibility with existing events (no persona targeting)

---

## Pre-Deployment Checklist

### Repository Preparation
- [ ] Create feature branch: `TBD (will be promoted from DEV after successful testing)`
- [ ] Merge all ticket branches into deployment branch
- [ ] Verify all 9 tickets are included in the branch
- [ ] Run local build and tests successfully
- [ ] Resolve any merge conflicts
- [ ] Update version numbers if applicable

### Code Review
- [ ] Code review completed for all changes
- [ ] Security review completed (especially for language switcher changes)
- [ ] Performance testing completed (CDN and minification)
- [ ] Accessibility review completed (color changes, font changes)
- [ ] Browser compatibility testing completed

### Documentation
- [ ] Release notes reviewed and approved
- [ ] Spotlight configuration guide created and reviewed
- [ ] Manual deployment steps documented
- [ ] Rollback procedures documented
- [ ] All ticket descriptions updated with deployment notes

### Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Performance tests show expected improvements
- [ ] UAT completed for critical bugs (JMSMUC-138, JMSMUC-142)
- [ ] Cross-browser testing completed
- [ ] Mobile responsive testing completed
- [ ] Language switching tested in all supported languages

### Deployment Prerequisites
- [ ] Deployment ticket JMSMUC-193 created and approved
- [ ] All related tickets tagged with `prod-mar-10-2026` label
- [ ] Pull request created and approved
- [ ] Deployment window scheduled and communicated
- [ ] Rollback plan prepared and tested

### Pipeline Configuration
- [ ] JMSmuckers-Headless-Prod pipeline ready
- [ ] Environment variables verified
- [ ] CDN configuration validated
- [ ] Minification settings confirmed
- [ ] Deployment credentials verified

---

## Deployment Steps

### 1. Pre-Deployment
```bash
# Verify branch status
git checkout TBD (will be promoted from DEV after successful testing)
git pull origin TBD (will be promoted from DEV after successful testing)
git log --oneline -10

# Verify all changes are committed
git status

# Create pull request to DEV environment
```

### 2. Execute Pipeline Deployment
1. Navigate to Azure DevOps: https://akuminadev.visualstudio.com/Smuckers
2. Go to Pipelines → JMSmuckers-Headless-Prod
3. Click "Run pipeline"
4. Select branch: `TBD (will be promoted from DEV after successful testing)`
5. Verify pipeline stages:
   - Source checkout
   - Build and minification
   - CDN asset upload
   - Deployment to DEV environment
   - Health checks
6. Monitor pipeline execution for errors
7. Review deployment logs

### 3. Post-Deployment Configuration

#### CDN Verification (JMSMUC-169)
1. Open browser developer tools → Network tab
2. Navigate to JM Smuckers DEV site
3. Verify CSS and JS files are loading from CDN URLs
4. Check response headers for cache-control settings
5. Verify CDN cache hit rates in Azure Portal

#### Spotlight Configuration (JMSMUC-144)
1. Follow steps in `JMSMUC_Term_Set_Configuration_Guide.md`
2. Update Term Store Management
3. Connect spotlight types to taxonomy
4. Verify content authors see updated names

#### Events Personas Configuration (JMSMUC-137)
1. Navigate to Site Settings → Events Content Type
2. Verify "Enable Personas" is activated
3. Test creating new event with persona targeting
4. Verify form layout is correct (no duplicate fields)

#### Content Type Updates (JMSMUC-142)
1. Navigate to Site Settings → OUR PEOPLE Content Type
2. Verify "Display Message" field has CKEditor enabled
3. Test creating/editing content with rich text formatting
4. Verify formatted content renders correctly

---

## Post-Deployment Verification

### Functional Testing

#### Language Switcher (JMSMUC-138) - **CRITICAL**
1. Navigate to homepage
2. Open Employee profile → Switch language
3. Select "French Canadian"
   - Expected: Page reloads with French tokens visible
   - Verify language preference persists
4. Select "Spanish"
   - Expected: Page reloads with Spanish tokens visible
   - Verify language preference persists
5. Switch back to English
   - Expected: Page reloads in English
6. Refresh page and verify language selection persists

#### Display Message Formatting (JMSMUC-142) - **HIGH PRIORITY**
1. Navigate to OUR PEOPLE content management
2. Create new item or edit existing
3. Verify CKEditor appears for "Display Message" field
4. Test formatting options:
   - Bold, italic, underline
   - Colors and font sizes
   - Hyperlinks
   - Lists (bulleted and numbered)
5. Save and verify formatted content displays on front-end

#### Curated News Font (JMSMUC-136) - **HIGH PRIORITY**
1. Navigate to page with Curated News widget
2. Inspect main article headline
3. Verify font-family is "Bebas Neue"
4. Compare with AKBPS sandbox for visual consistency
5. Test across browsers (Chrome, Edge, Firefox)

### Performance Testing

#### CDN Static Files (JMSMUC-169)
```bash
# Network performance test
1. Open DevTools → Network tab
2. Hard refresh page (Ctrl+Shift+R)
3. Check "Disable cache" option
4. Reload and measure:
   - Total page load time (target: 20-30% improvement)
   - CSS load time
   - JS load time
5. Verify all static assets load from CDN
6. Check CDN cache hit rate > 90%
```

#### Minified Files (JMSMUC-187)
```bash
# File size verification
1. Open DevTools → Network tab
2. Filter by JS and CSS files
3. Verify .min.js and .min.css files are loaded
4. Compare file sizes:
   - Expect 40-60% size reduction
5. Verify site functionality is not broken
6. Check browser console for any errors
```

### Visual/UI Testing

#### Social Icons Color (JMSMUC-116)
1. Check global footer social icons
2. Verify teal color (#teal-brand-color)
3. Test hover states
4. Check social sharing widgets
5. Verify employee profile social links

#### News/Blogs Tabs (JMSMUC-102)
1. Navigate to homepage
2. Verify tab order: Corporate News, Featured News
3. Click "Corporate News" tab:
   - Verify filters: My interests, All Corporate News, Top reacted, Popular
   - Verify CTA: "View ALL Corporate News"
4. Click "Featured News" tab:
   - Verify filters: My interests, All Featured News, Top reacted, Popular
   - Verify CTA: "View ALL Featured News"
5. Verify Events tab is removed
6. Check right column for custom Events widget

#### Events Personas (JMSMUC-137)
1. Navigate to Site Settings → Events
2. Click "Add New Event"
3. Verify Personas tab is visible
4. Create event with persona targeting
5. Login as targeted persona user → verify event is visible
6. Login as non-targeted persona user → verify event is hidden

### Smoke Tests
- [ ] Homepage loads without errors
- [ ] All widgets render correctly
- [ ] No console errors in browser DevTools
- [ ] No 404 errors for assets
- [ ] Navigation menu works
- [ ] Search functionality works
- [ ] User authentication works
- [ ] Language switcher works

### Performance Benchmarks
- [ ] Page load time < 3 seconds (3G connection)
- [ ] Time to Interactive < 5 seconds
- [ ] CDN cache hit rate > 90%
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Lighthouse Performance score > 85

---

## Rollback Plan

### If Critical Issues Are Discovered

#### Immediate Rollback Steps
1. **Stop Pipeline** (if deployment in progress)
   - Navigate to Azure DevOps pipeline
   - Click "Cancel" on running deployment
   
2. **Revert to Previous Branch**
```bash
# Identify last stable deployment commit
git log --oneline origin/master

# Create rollback branch
git checkout -b rollback/emergency-mar-10-2026

# Revert to previous stable commit
git revert <previous-stable-commit-sha>

# Push rollback branch
git push origin rollback/emergency-mar-10-2026
```

3. **Re-run Pipeline with Previous Version**
   - Run pipeline on last known good branch
   - Monitor deployment completion
   - Verify site functionality

4. **Communication**
   - Notify stakeholders of rollback
   - Update JMSMUC-193 ticket with rollback details
   - Schedule post-mortem meeting

### Partial Rollback (Single Feature)

If only one ticket is causing issues, consider reverting that specific change:

```bash
# Find commits related to problematic ticket
git log --grep="JMSMUC-XXX" --oneline

# Create revert commit
git revert <commit-sha>

# Test locally
npm run build
npm test

# Push fix
git push origin TBD (will be promoted from DEV after successful testing)

# Re-run deployment pipeline
```

### Rollback Decision Criteria

**Full Rollback Required If:**
- Language switcher completely broken (JMSMUC-138)
- Site fails to load or critical functionality broken
- Security vulnerabilities discovered
- Data loss or corruption detected
- Multiple high-priority features broken

**Partial Rollback/Forward Fix If:**
- Single feature has minor issue
- Issue affects low-traffic feature
- Fix can be implemented within 1 hour
- Issue doesn't impact core functionality

---

## Known Issues & Limitations

### Events Personas (JMSMUC-137)
- **Issue**: Enabling personas may show "Add New" slider that cannot be hidden
- **Workaround**: Form layout has been adjusted to minimize impact
- **Status**: Functional, minor UX quirk remains

### Language Switcher (JMSMUC-138)
- **Limitation**: Translation tokens must be pre-configured for French Canadian and Spanish
- **Impact**: Content not yet translated will remain in English even after language switch
- **Action Required**: Content team to complete translations for priority pages

### CDN Configuration (JMSMUC-169)
- **Note**: First-time CDN access may have slight delay for cache population
- **Expected**: Cache hit rate improves to >90% within 24 hours of deployment

---

## Support & Contacts

### Deployment Team
- **Lead**: Diego Rosa (diego.rosa@akumina.com)
- **QA Lead**: TBD
- **DevOps Contact**: Akumina DevOps Team

### Escalation Path
1. **Level 1**: Deployment team reviews issues
2. **Level 2**: Technical lead investigates
3. **Level 3**: Rollback decision and execution

### Communication Channels
- **Jira**: https://akumina.atlassian.net/browse/JMSMUC-193
- **Teams**: JM Smuckers Deployment Channel
- **Email**: jmsmuckers-dev-team@akumina.com

---

## Success Criteria

The deployment is considered successful when:

1. ✅ All 9 tickets are deployed without errors
2. ✅ Language switcher functions correctly in all languages
3. ✅ CKEditor is enabled for Display Message field
4. ✅ CDN is serving static files with >90% hit rate
5. ✅ Minified files load correctly with no functionality issues
6. ✅ Social icons display in teal color
7. ✅ News/Blogs tabs show correct labels and filters
8. ✅ Events personas targeting works correctly
9. ✅ Spotlight documentation is available and accurate
10. ✅ Curated News uses Bebas Neue font
11. ✅ All smoke tests pass
12. ✅ Performance benchmarks meet targets
13. ✅ No critical errors in production logs
14. ✅ Stakeholder sign-off received

---

## Post-Deployment Tasks

### Immediate (Within 2 hours)
- [ ] Monitor application logs for errors
- [ ] Verify CDN cache warming is complete
- [ ] Run full regression test suite
- [ ] Update JMSMUC-193 ticket with deployment results
- [ ] Notify stakeholders of successful deployment

### Short-term (Within 24 hours)
- [ ] Verify CDN hit rate reaches >90%
- [ ] Collect performance metrics and compare with baseline
- [ ] Complete UAT testing with content team
- [ ] Review and close all 9 included tickets
- [ ] Update documentation with any deployment notes

### Medium-term (Within 1 week)
- [ ] Schedule demo session for new features
- [ ] Train content team on CKEditor and spotlight configuration
- [ ] Monitor user feedback and bug reports
- [ ] Conduct performance review meeting
- [ ] Plan next deployment cycle

---

## Appendix

### Related Documentation
- [JMSMUC Term Set Configuration Guide](JMSMUC_Term_Set_Configuration_Guide.md)
- [Performance Optimization Strategy](../../scripts/PERFORMANCE_OPTIMIZATIONS.md)
- [Akumina Framework Performance Considerations](https://akumina.github.io/docs/Akumina-Framework-Performance-Considerations)

### Ticket Links
- [JMSMUC-193 (Deployment Ticket)](https://akumina.atlassian.net/browse/JMSMUC-193)
- [JMSMUC-138 (Language Switcher)](https://akumina.atlassian.net/browse/JMSMUC-138)
- [JMSMUC-142 (Display Message Formatting)](https://akumina.atlassian.net/browse/JMSMUC-142)
- [JMSMUC-144 (Spotlight Documentation)](https://akumina.atlassian.net/browse/JMSMUC-144)
- [JMSMUC-136 (Curated News Font)](https://akumina.atlassian.net/browse/JMSMUC-136)
- [JMSMUC-169 (CDN Static Files)](https://akumina.atlassian.net/browse/JMSMUC-169)
- [JMSMUC-187 (Minified JS/CSS)](https://akumina.atlassian.net/browse/JMSMUC-187)
- [JMSMUC-116 (Social Icons Color)](https://akumina.atlassian.net/browse/JMSMUC-116)
- [JMSMUC-102 (News/Blogs Tabs)](https://akumina.atlassian.net/browse/JMSMUC-102)
- [JMSMUC-137 (Events Personas)](https://akumina.atlassian.net/browse/JMSMUC-137)

### Repository
- **Azure DevOps**: https://akuminadev.visualstudio.com/Smuckers
- **Git Repository**: https://akuminadev.visualstudio.com/_git/Smuckers
- **Branch**: TBD (will be promoted from DEV after successful testing)

---

**Document Version**: 1.0  
**Last Updated**: March 10, 2026  
**Author**: Diego Rosa  
**Reviewed By**: TBD  
**Approved By**: TBD
