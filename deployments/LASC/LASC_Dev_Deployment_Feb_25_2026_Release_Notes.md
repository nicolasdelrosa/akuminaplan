# LA Courts (LAC) - DEV Environment Deployment
## Release 1.26.02.25 - February 25, 2026

### Deployment Information
- **Environment**: DEV
- **Date**: February 25, 2026
- **Branch**: 1.26.02.25
- **Deployment Ticket**: LAC-230

---

## Included Tickets

### LAC-226: Video Change Sort Configuration - Search
**Type**: Task  
**Priority**: Medium  
**Status**: In Progress  
**Assignee**: Diego Rosa

**Description**:
Change sort configuration for video search.

**Manual Steps**:
1. Add 2 new properties to Akumina.AddIn.StreamChannelWidget:
   - `spsortfield` - `{propertyfriendlynames.friendlyname_sortfield}` - `{"PropertyName":"","DisplayName":""}`
   - `spsortorder` - `{propertyfriendlynames.friendlyname_sortorder}` - `{"Ascending":"asc","Descending":"desc"}`

2. Set the widget instance the sortfield and sortorder, for LAC is:
   - `spsortfield`: `[{"PropertyName": "FileName", "DisplayName": "Created Date"}]`
   - `spsortorder`: `desc`

---

### LAC-227: Remove Resource Directory from Global Search
**Type**: Task  
**Priority**: Medium  
**Status**: Client Validation  
**Assignee**: Diego Rosa

**Description**:
Remove Resource Directory results from global search.

**Manual Steps**:
1. Add to typeahead widget the following querycallback: `lacourtsearchquerycallback`
2. Add to global search widget the following querycallback: `lacourtsearchquerycallback`

---

### LAC-228: Hide notification bell and notification settings from header across all delivery and subsites
**Type**: Task  
**Priority**: Medium  
**Status**: Ready for Dev Deploy  
**Assignee**: Theresa Ferris

**Description**:
Remove notification bell and notification settings from header across all delivery and subsites.

**Changes**:
- Remove notification bell from header
- Remove notification settings from header
- Shift bookmark flag closer to profile image (in notification bell's place)
- Leave Search box where it is
- Includes mobile views

---

### LAC-229: Employee Profile - Birthday and mobile phone not pulling in data
**Type**: Task  
**Priority**: Medium  
**Status**: Ready for Dev Deploy  
**Assignee**: Theresa Ferris

**Description**:
Remove Birthday, Mobile phone, and Fax fields when a user edits their own employee detail page to eliminate confusion for the user.

**Changes**:
- Remove Birthday field from employee edit page
- Remove Mobile phone field from employee edit page
- Remove Fax field from employee edit page

---

## Pre-Deployment Checklist
- [ ] Branch 1.26.02.25 is ready for deployment
- [ ] All tickets have been tested and approved
- [ ] Backup of current DEV environment completed
- [ ] Deployment window scheduled

## Post-Deployment Verification
- [ ] Verify video search sort configuration (LAC-226)
  - Verify widget properties are correctly configured
  - Test video search results are sorted by creation date (descending)
- [ ] Verify Resource Directory is removed from global search (LAC-227)
  - Perform global search and verify Resource Directory results are excluded
  - Test typeahead search excludes Resource Directory items
- [ ] Verify notification bell and settings are hidden from header (LAC-228)
  - Check desktop and mobile views
  - Confirm bookmark flag is correctly positioned
- [ ] Verify employee profile fields are removed from edit page (LAC-229)
  - Test editing employee profile
  - Confirm Birthday, Mobile phone, and Fax fields are not displayed
- [ ] Smoke test all critical functionality
- [ ] Notify stakeholders of deployment completion

## Rollback Plan
If issues are encountered:
1. Restore from pre-deployment backup
2. Notify stakeholders
3. Document issues for resolution

---

**Prepared by**: Automated Release Notes Generator  
**Date**: February 25, 2026
