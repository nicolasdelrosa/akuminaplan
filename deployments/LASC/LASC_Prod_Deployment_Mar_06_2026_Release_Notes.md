# LA Courts (LAC) - PROD Environment Deployment
## Release 1.26.03.06.01 - March 6, 2026

### Deployment Information
- **Environment**: PROD
- **Date**: March 6, 2026
- **Branch**: 1.26.03.06.01
- **Deployment Ticket**: [LAC-241](https://akumina.atlassian.net/browse/LAC-241)
- **Total Tickets**: 11 (5 High Priority, 6 Medium Priority)

---

## Included Tickets

### High Priority Features & Fixes

#### LAC-235: Resource Directory - Hide "All" Filter from Filter Boxes
**Type**: Bug  
**Priority**: High  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Within the Resource Directory, when a user selects a filter from the left-hand filter panel, the results correctly update. However, when the user scrolls to the bottom of any filter box, an "All" checkbox appears. Clicking this "All" checkbox does not change the results, reset filters, or trigger any visible action, creating confusing UX.

**Changes**:
- Remove "All" checkbox from all Resource Directory filter panels
- No regression in existing filtering behavior
- Improved UX clarity for GO LIVE on Monday, March 9

**Impact**: Critical for GO LIVE - improves user experience and removes perceived broken functionality

---

#### LAC-233: Add "Clear Filters" Option to News/Listing Page Search
**Type**: Task  
**Priority**: High  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
On the News & Updates listing page, when a user types search criteria into the search field, the results dynamically filter. Currently, the only way to return to the full set of cards is to manually delete the typed search term, which is not intuitive.

**Changes**:
- Add visible "Clear Filters" button when search/filter state is active
- Clicking button resets search term, dropdown filters, and any applied toggles
- Button positioned to the right of the "My interests" filter button
- UI styling consistent with Resource Directory implementation
- Full listing reloads without page refresh

**Impact**: Improved usability and consistency with Resource Directory filtering behavior

---

#### LAC-234: Typeahead Search – Hide SharePoint Delivery Site Name
**Type**: Task  
**Priority**: High  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
When users type into the typeahead search, page results display the SharePoint Delivery site name (e.g., "courtspace-delivery"). This exposes internal site naming conventions and is not aligned with the branded experience.

**Solution Implemented**:
Modify display attribute to truncate or remove SharePoint site name from typeahead search results.

**Options Evaluated**:
1. Rename SharePoint site (High impact on URLs, links, integrations)
2. Modify display attribute to truncate after hyphen (Moderate impact, template change)
3. Remove site attribute from display entirely (Low impact, best UX)

**Impact**: Improved branding and user experience by hiding internal site naming

---

#### LAC-237: Fix Icons Disappearing Intermittently on Listing Pages
**Type**: Bug  
**Priority**: High  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
When users navigate to listing pages (e.g., Resource Directory) containing many icons, some icons intermittently disappear. This behavior does not affect all users, and the missing icons sometimes reappear after a refresh or revisit.

**Root Cause**:
Likely related to caching or performance issues.

**Changes**:
- Investigate and implement performance optimization or cache adjustment
- Ensure all icons consistently display for all users

**Impact**: Resolves visual inconsistency and improves site reliability

---

#### LAC-238: Change Browser Page Title to Show Courtspace - Home [or Name of Page]
**Type**: Task  
**Priority**: High  
**Status**: Client Validation  
**Assignee**: Diego Rosa

**Description**:
Change browser title to show "courtspace - name of page" instead of "courtspace - delivery - name of page". The word "delivery" is an internal SharePoint reference that should be hidden from end users.

**Changes**:
- Update browser page title format across all pages
- Remove "delivery" reference from page titles
- Format: "courtspace - [Page Name]" (e.g., "courtspace - Home")

**Impact**: Improved branding and professional appearance by removing internal site naming references

**Technical Note**: SharePoint site name was changed; domain cache clearance scheduled overnight

---

### Medium Priority Performance & UX Improvements

#### LAC-236: Add "Clear Filters" Option to People Search
**Type**: Task  
**Priority**: Medium  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Within the People search experience, when users type a name into the search field or use the quick-select letter menu, results dynamically filter. Currently, there is no visible "Clear Filters" option. Users must manually remove search text or re-select letters to reset results.

**Changes**:
- Add visible "Clear Filters" button when search term is entered or quick letter filter is selected
- Clicking button resets search text and letter selection
- Restores full People directory listing
- Consistent UX with Resource Directory and News/Listing pages

**Impact**: Improves usability and discoverability, reduces friction when refining searches

---

#### LAC-201: Add Static Files to Headless Environment
**Type**: Sub-task  
**Priority**: Medium  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Apply LA Courts styles to throttle.html static file for headless environment.

**Changes**:
- Update throttle.html with LA Courts branding/styling
- File deployed to headless static files directory

**Impact**: Consistent branding across all site pages including error/throttle pages

---

### Performance Optimization Tasks (BPS Series)

#### LAC-193: BPS-205 - Lazy Loading Images
**Type**: Sub-task  
**Priority**: Medium  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Implement lazy loading for images to enhance performance by loading images only when they are in the viewport.

**Changes**:
- Implement lazy loading for all images across the site
- Images load only when they come into view during scrolling
- Based on UFA implementation pattern

**Impact**: Improved page load performance and reduced initial bandwidth usage

**Reference**: [UFA Implementation Example](https://akuminadev.visualstudio.com/UFA/_git/UFA/commit/7a82fce0f8a9b9843a8fdc6031dfcbcfd2e320b4)

---

#### LAC-212: BPS-226 - Hide Loading Bars and Spinner
**Type**: Sub-task  
**Priority**: Medium  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Remove unnecessary loading indicators (bars and spinners) to improve user experience.

**Changes**:
- Hide loading bars and spinners across the application
- Cleaner, more modern loading experience

**⚠️ Manual Deployment Steps Required**:

1. Add the following lines to the `.env` file in the LAC PROD environment:

```
Akumina.Digispace.ConfigurationContext.CONSTANTS.LOADER_STEPS_ENABLE_GETLOADINGTEMPLATE = false;
Akumina.Digispace.ConfigurationContext.LoadingTemplateHtml = ''
```

**Impact**: Improved perceived performance and cleaner UI

**Reference**: [UFA Implementation Example](https://akuminadev.visualstudio.com/UFA/_git/UFA/commit/3ccf69fa3c29b554f49e48bd108dc1378dee8a1a)

---

#### LAC-194: BPS-225 - Footer and Header Default Height
**Type**: Sub-task  
**Priority**: Medium  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Adjust the default height of the footer and header to improve performance by preventing layout shifts.

**Changes**:
- Modify default height of footer and header
- Elements, especially in the header, do not load in different positions upon page refresh
- Reduces Cumulative Layout Shift (CLS)

**Impact**: Improved performance metrics and visual stability during page load

**Reference**: [UFA Implementation Example](https://akuminadev.visualstudio.com/UFA/_git/UFA/commit/db17330bf902c0e3b9091b9897ec21eddcb363fd)

---

#### LAC-196: BPS-220 - Profile Image Preload
**Type**: Sub-task  
**Priority**: Medium  
**Status**: Ready for Prod Deploy  
**Assignee**: Theresa Ferris

**Description**:
Preload profile images to improve loading time and enhance user experience.

**Changes**:
- Implement profile image preloading
- Applied to delivery and department masterpages
- Images available faster during page load

**Impact**: Improved perceived performance for user profiles

**References**: 
- [UFA Commit 1](https://akuminadev.visualstudio.com/UFA/_git/UFA/commit/5ba50be7b0b4085df890e49aa05b45ad781a41b5)
- [UFA Commit 2](https://akuminadev.visualstudio.com/UFA/_git/UFA/commit/0228f3d9c3825bed38b8c3981cd1ba8cc53fd441)

---

## Deployment Summary

### Code Deployment (Automated)
All 11 tickets will be deployed via the LACourts-Headless-Prod pipeline from branch `1.26.03.06.01`.

### Manual Configuration (Required)
**LAC-212**: Environment configuration updates required in PROD `.env` file (see ticket details above)

---

## Pre-Deployment Checklist

- [ ] All tickets verified in "Ready for Prod Deploy" status
- [ ] Release branch `1.26.03.06.01` tested successfully in DEV environment
- [ ] All tickets tagged with release version label: `1.26.03.06.01`
- [ ] Pipeline configuration validated for LACourts-Headless-Prod
- [ ] Backup of current PROD environment completed
- [ ] Deployment window scheduled for March 6, 2026
- [ ] Manual deployment steps documented and reviewed (LAC-212)
- [ ] Stakeholders notified of deployment
- [ ] DEV deployment validated (prerequisite)
- [ ] Rollback plan reviewed and understood

---

## Post-Deployment Verification

### Standard Validation
- [ ] Site loads without errors
- [ ] Console free of critical errors
- [ ] All widgets render correctly

### High Priority Feature Validation
- [ ] **LAC-235**: Verify "All" checkbox removed from Resource Directory filters
  - Navigate to Resource Directory
  - Select various filters
  - Scroll to bottom of filter groups
  - Confirm "All" checkbox is not displayed

- [ ] **LAC-233**: Verify "Clear Filters" button on News/Listing pages
  - Navigate to News & Updates page
  - Enter search term or apply filters
  - Confirm "Clear Filters" button appears
  - Click button and verify all filters reset

- [ ] **LAC-234**: Verify SharePoint site name hidden in typeahead search
  - Type search query in typeahead
  - Review page results
  - Confirm internal site name (courtspace-delivery) is not displayed

- [ ] **LAC-237**: Verify icons display consistently on listing pages
  - Navigate to Resource Directory and other listing pages
  - Verify all icons load properly
  - Refresh page multiple times
  - Test with different user accounts

- [ ] **LAC-238**: Verify browser page titles display correctly
  - Navigate to various pages (Home, News, Resource Directory, People Search)
  - Check browser tab titles
  - Confirm format is "courtspace - [Page Name]" (no "delivery" reference)
  - Test across different browsers

### Medium Priority Feature Validation
- [ ] **LAC-236**: Verify "Clear Filters" button on People Search
  - Navigate to People Directory
  - Enter name or select letter filter
  - Confirm "Clear Filters" button appears
  - Click button and verify search resets

- [ ] **LAC-201**: Verify static files in headless environment
  - Test throttle page displays with LA Courts styling

### Performance Optimization Validation
- [ ] **LAC-193**: Verify lazy loading images
  - Navigate to pages with multiple images
  - Open browser developer tools (Network tab)
  - Scroll down page
  - Confirm images load only as they enter viewport

- [ ] **LAC-212**: Verify loading bars and spinners hidden (⚠️ Manual config required)
  - Confirm PROD `.env` file updated with required configuration
  - Navigate between pages
  - Verify loading indicators are hidden

- [ ] **LAC-194**: Verify header/footer default height
  - Refresh multiple pages
  - Confirm header/footer elements don't shift position during load
  - Test on desktop and mobile views

- [ ] **LAC-196**: Verify profile image preload
  - Navigate to People Directory
  - Click on user profiles
  - Verify profile images load quickly without delay

---

## Rollback Plan

If critical issues are encountered:

1. **Immediate Actions**:
   - Document the specific issue(s) encountered
   - Notify stakeholders immediately
   - Assess impact severity
   
2. **Rollback Procedure**:
   - Redeploy previous stable branch via LACourts-Headless-Prod pipeline
   - If LAC-212 `.env` changes were applied, restore previous PROD configuration
   - Clear CDN cache if necessary
   - Verify rollback completed successfully
   
3. **Post-Rollback**:
   - Verify site functionality restored
   - Document root cause
   - Create plan for re-deployment
   - Schedule post-mortem meeting

4. **Stakeholder Communication**:
   - Notify team of rollback completion
   - Provide timeline for issue resolution
   - Update deployment ticket with details

---

## Notes

- **GO LIVE Preparation**: This release includes critical fixes for GO LIVE on Monday, March 9, 2026
- **Performance Focus**: 4 of 11 tickets focus on performance optimization (BPS series)
- **UX Consistency**: Multiple tickets address filter/search UX consistency across the site
- **Branding Improvements**: LAC-234 and LAC-238 remove internal SharePoint references for better branding
- **Manual Steps**: LAC-212 requires manual `.env` configuration changes in PROD
- **Testing Priority**: High priority tickets (LAC-235, LAC-233, LAC-234, LAC-237, LAC-238) should be tested first
- **DEV Prerequisite**: DEV deployment should be successfully validated before PROD deployment

---

## Contact Information

**Deployment Lead**: Diego Rosa  
**QA Lead**: Theresa Ferris  
**Project**: LA Courts (LAC)  
**Jira Deployment Ticket**: [LAC-241](https://akumina.atlassian.net/browse/LAC-241)  
**Related DEV Deployment**: [LAC-240](https://akumina.atlassian.net/browse/LAC-240)
