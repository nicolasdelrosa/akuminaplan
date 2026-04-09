# LA Courts (LASC) Development Deployment
## January 27, 2026

---

## Deployment Overview

| Property | Value |
|----------|-------|
| **Deployment Date** | January 27, 2026 |
| **Environment** | Development |
| **Branch** | `dev_2026.01.27.01` |
| **Pipeline** | LACourts-Headless-Dev |
| **Status** | Ready for Deployment |

---

## Tickets Included

### LAC-213: CUSTOM TILES WIDGET - Enhancements
**Type:** Story  
**Priority:** Medium  
**Status:** Ready for Dev Deploy  
**Assignee:** Jenna Lee / Diego Rosa  
**Created:** December 24, 2025  
**Updated:** January 27, 2026

#### Description

This deployment includes additional enhancements to the Custom Tiles Widget that was initially deployed on January 26, 2026. These improvements focus on user experience and filter functionality.

#### Modifications Included in This Release

##### 1. Sort Entries Alphabetically by RefinementName, with 'All' at the End
**Commit:** `a4278c0c`  
**Author:** Diego Rosa  
**Date:** January 27, 2026 @ 10:42 AM  
**Status:** ✅ Succeeded

**Description:**  
Enhanced the filter refinement display to sort entries alphabetically by RefinementName. The 'All' option is now consistently positioned at the end of the list for better user experience and predictable filter ordering.

**Benefits:**
- Improved filter discoverability through alphabetical ordering
- Consistent 'All' placement for intuitive user interaction
- Better organization of large filter lists

##### 2. Auto-trigger Apply Filters When Checkboxes Change
**Commit:** `2b489be0`  
**Author:** Diego Rosa  
**Date:** January 27, 2026 @ 10:40 AM  
**Status:** ✅ Succeeded

**Description:**  
Implemented automatic filter application when users select or deselect filter checkboxes. This eliminates the need to manually click an "Apply Filters" button, creating a more responsive and modern filtering experience.

**Benefits:**
- Immediate visual feedback when filters are changed
- Streamlined user workflow (no manual "Apply" button click required)
- More intuitive filtering behavior aligned with modern web applications
- Reduced clicks for end users

---

## Technical Details

### Components Modified
- Custom Tiles Widget filter refinement logic
- Filter UI event handlers
- Refinement sorting algorithm

### Testing Performed
- Verified alphabetical sorting of refinement names
- Confirmed 'All' option appears at the end consistently
- Tested auto-filter application on checkbox change
- Validated filter behavior with multiple selections
- Confirmed no performance degradation with automatic filtering

---

## Deployment Instructions

### Pre-Deployment Checklist
- [ ] Code review completed for commits `a4278c0c` and `2b489be0`
- [ ] Local testing verified for both enhancements
- [ ] No merge conflicts with main branch
- [ ] LAC-213 ticket updated with deployment details

### Deployment Steps
1. Create branch `dev_2026.01.27.01` from main
2. Ensure commits `a4278c0c` and `2b489be0` are included
3. Create pull request and link to LAC-213
4. Execute pipeline: **LACourts-Headless-Dev**
5. Verify deployment completion
6. Perform smoke testing on DEV environment

### Post-Deployment Validation
- [ ] Verify filter refinements are sorted alphabetically
- [ ] Confirm 'All' option appears at the end of filter lists
- [ ] Test checkbox auto-filter application
- [ ] Validate multiple filter selections work correctly
- [ ] Check for any console errors or warnings

---

## Rollback Plan

If issues are encountered:
1. Revert to previous deployment branch `dev_2026.01.26.01`
2. Re-run LACourts-Headless-Dev pipeline with previous branch
3. Document issues in LAC-213
4. Investigate and fix before re-deploying

---

## Known Limitations

None identified at this time.

---

## Support Contact

**Primary:** Diego Rosa (diego.rosa@akumina.com)  
**Secondary:** Jenna Lee (jenna.lee@akumina.com)

---

**Document Version:** 1.0  
**Last Updated:** January 27, 2026
