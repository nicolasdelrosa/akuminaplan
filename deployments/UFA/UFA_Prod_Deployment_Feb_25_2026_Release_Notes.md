# UFA Production Deployment
## Release Notes - February 25, 2026

---

### Deployment Information

**Date:** February 25, 2026  
**Environment:** Production (UFA)  
**Branch:** prod_2026.02.25.01  
**Pipeline:** UFA Production - Headless Pipeline  
**Source Branch:** Development (Jan 20, 2026 Release)  
**Ticket:** UFA-298 - Production Deploy

---

## Summary

This production deployment includes 10 tickets from the January 20, 2026 development release (UFA-274 through UFA-283) focusing on search functionality improvements, UI/UX enhancements, and frontend optimizations for the Tools & Systems page.

---

## Features & Enhancements

### Search Improvements

#### UFA-274: Update Document Search Results
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Updated document search results to display the Short Description field instead of SharePoint document preview for improved accuracy and consistency.

**What Changed:**
- Search results now pull from the Short Description field
- Required field validation ensures search quality
- Improved search result display consistency

---

#### UFA-275: Contents of the Preferences & Interests Dialog is Indexed in pagedata_AK
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Resolved issue where user preferences modal content was being incorrectly indexed in search results.

**What Changed:**
- Added configuration to exclude specific widgets from search indexing
- User preferences content no longer appears in page search results
- Created search-exclude-widgets configuration in DigiSpaceConfig list

**Manual Deployment Steps:**
- Created entry in DigiSpaceConfig list with key: `search-exclude-widgets`
- Value includes widget IDs: `["4b096a68-3706-4e4c-875e-167badd119bd","e2c73690-81d5-76d9-3ded-a641ddadf70e","773e4981-04ea-4042-8bbf-23f5bf42e189","382a6e81-6f3b-42f8-ba97-f5758b8ac2c8","6c9c2fd5-323e-4c25-9364-bd0903ef589c"]`

---

### UI/UX Improvements

#### UFA-276: Custom Tools and Resources Widget
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Implemented a customized widget with searchable 4-column grid layout for the Tools & Systems page.

**What Changed:**
- Created new custom view: `ufa-search-grid`
- 4-column grid layout with consistent tile sizing (180px image height)
- Real-time search functionality filtering items by title and summary
- Mobile-responsive design with automatic group hiding when filtered
- 20 items across 4 categories (Core Systems, Safety, Ordering Services, Other)

**Technical Details:**
- Widget: SummaryLinksWidget
- View: ufa-search-grid
- List: SummaryLinks_AK
- Collection: tools&system (25a4d484-025c-f7c1-957d-41cbe043e6e1)

---

#### UFA-277: Change Cards to Use Drop Shadow Instead of Orange Border
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Updated card styling throughout the site to use drop shadows instead of orange borders for a more modern look.

**What Changed:**
- Removed orange border from cards
- Applied drop shadow styling to card elements
- Improved visual consistency across the site

---

#### UFA-278: Change Top Nav and Header Colors to Black with Orange Hover
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Updated navigation and header styling to improve readability and brand consistency.

**What Changed:**
- Top navigation text changed to black
- Header text changed to black
- Added orange hover state for navigation elements
- Improved accessibility and contrast

---

#### UFA-279: Change User Preference Text Color to Black
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Updated user preferences taxonomy labels for better readability.

**What Changed:**
- Changed taxonomy label colors from orange to black
- Improved text readability in user preferences modal
- Consistent color scheme across user interface

---

#### UFA-280: POC Tools & System
**Priority:** Medium  
**Status:** Done

**Description:**  
Proof of concept for Tools & Systems page with searchable 4-column grid layout combining image thumbnails with summary links widget.

**What Changed:**
- Created ufa-search-grid.html and ufa-search-grid.source.html views
- Combined layouts from linkedlistwiththumbnails and tiledgroupwithlink
- Implemented inline CSS for consistent styling
- Added real-time search filtering on titles and summaries
- Populated 20 sample items using PnP PowerShell script

---

#### UFA-281: Hide Date from User Greetings Widget
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Removed date display from user greetings widget to optimize space on homepage.

**What Changed:**
- Date no longer displayed in user greetings
- More room available on homepage for other content
- Cleaner, more focused greeting display

---

#### UFA-282: Reduce the Height of the Banner Carousel View on the Homepage
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Optimized banner carousel height to improve homepage layout and user experience.

**What Changed:**
- Reduced image height in slick carousel to 300px
- Removed additional unused whitespace
- More content visible above the fold
- Improved homepage performance

---

#### UFA-283: Change --fs-widgets-bottom-spacing to 48px
**Priority:** Medium  
**Status:** Client Validation

**Description:**  
Reduced widget bottom spacing to optimize page layout and reduce scrolling.

**What Changed:**
- Changed `--fs-widgets-bottom-spacing` from 96px to 48px
- Tighter, more compact widget layout
- Improved content density on all pages

---

## Deployment Details

### Pre-Deployment Checklist
- [x] All tickets tested in Development environment
- [x] UFA-298 Production Deploy ticket created and assigned
- [x] Client validation completed for all tickets
- [x] Release notes prepared and reviewed
- [x] Production environment backup completed
- [x] Stakeholders notified of deployment window

### Deployment Steps
1. Create production branch `prod_2026.02.25.01` from development
2. Generate pull request merging development changes
3. Execute UFA Production - Headless Pipeline
4. Apply manual configuration changes (DigiSpaceConfig)
5. Refresh SharePoint search index
6. Clear application cache
7. Verify all changes in production environment

### Manual Configuration Required
- DigiSpaceConfig list entry for search-exclude-widgets
- Cache refresh across all site collections
- Verify custom view deployment for Tools & Systems

---

## Post-Deployment Verification

### Critical Tests
- [ ] Tools & Systems page loads with new 4-column grid layout
- [ ] Search functionality works on Tools & Systems page
- [ ] User preferences modal content not appearing in search
- [ ] Document search displays Short Description correctly
- [ ] Navigation colors display correctly (black with orange hover)
- [ ] Banner carousel height reduced to 300px
- [ ] Widget spacing updated to 48px
- [ ] User greeting widget displays without date

### Search Functionality Tests
- [ ] Search excludes user preferences content
- [ ] Document search shows correct descriptions
- [ ] Tools & Systems search filters correctly
- [ ] No JavaScript errors in browser console

### UI/UX Verification
- [ ] Cards display with drop shadow (no orange border)
- [ ] Header and navigation colors are correct
- [ ] User preferences text is black
- [ ] Homepage banner carousel is 300px tall
- [ ] Widget spacing is consistent (48px)

---

## Environment URLs

**Production:** https://cloud-prod-fe-ufa.onakumina.com/  
**Development:** https://cloud-dev-fe-ufa.onakumina.com/ (reference)

---

## Rollback Plan

If critical issues occur:
1. Stop any in-progress deployments
2. Revert to previous production branch: `prod_2026.XX.XX.XX` (last stable)
3. Execute rollback pipeline
4. Remove manual DigiSpaceConfig entry if deployed
5. Clear cache and verify rollback success
6. Document issues in affected Jira tickets
7. Communicate rollback to stakeholders

---

## Known Issues & Monitoring

### Active Issues (Not in This Deployment)
- **UFA-285:** Add System & Tools results in typeahead and global search (Future release)
- **UFA-286:** Search add SLW results in typeahead and global search (Future release)
- **UFA-287:** Global Search - Exclude SharePoint System Lists (Future release)
- **UFA-289:** Typeahead mixture of good/incorrect elements (To Do)
- **UFA-270:** Document search not displaying last modified by (In Progress)

### Monitoring Points
- Monitor search performance after deployment
- Watch for any styling inconsistencies with new color scheme
- Track user feedback on Tools & Systems page
- Monitor page load times with new carousel height
- Verify cache is properly cleared post-deployment

---

## Support Contacts

**Primary Contact:** Diego Rosa (diego.rosa@akumina.com)  
**Secondary Contact:** Luke Shuck (Luke.Shuck@akumina.com)  
**Requester:** Alison J Haynes  
**For Issues:** Create ticket in Jira under project UFA

---

## Release History

**Previous Deployments:**
- January 26, 2026: DEV - UFA-285, UFA-286
- January 22, 2026: DEV - UFA-285, UFA-286
- January 20, 2026: DEV - UFA-274 to UFA-283 (Source for this release)
- January 16, 2026: DEV - 27 commits, 15 tickets

**Next Scheduled:** TBD - Search enhancements (UFA-285, UFA-286, UFA-287)

---

_Release prepared and executed on February 25, 2026._  
_Deployment Ticket: UFA-298_  
_Source Release: UFA_Dev_Deployment_Jan_20_2026_Release_Notes_
