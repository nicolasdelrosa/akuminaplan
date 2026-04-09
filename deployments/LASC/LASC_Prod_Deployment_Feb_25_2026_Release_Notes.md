# LA Courts (LAC) - PROD Environment Deployment
## Release 1.26.02.25 - February 25, 2026

### Deployment Information
- **Environment**: PRODUCTION
- **Date**: TBD (After DEV validation)
- **Branch**: 1.26.02.25
- **Deployment Ticket**: LAC-231

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

**Impact**: Users will see video search results sorted by creation date in descending order.

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

**Impact**: Users will no longer see Resource Directory items in global search results, providing a cleaner and more focused search experience.

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

**Impact**: Cleaner header interface with simplified user experience. Bookmark functionality remains accessible.

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

**Impact**: Users will no longer see non-functional fields when editing their profile, reducing confusion.

---

## Pre-Deployment Checklist
- [ ] All features successfully validated in DEV environment
- [ ] UAT sign-off received for all tickets
- [ ] Change Control Board (CCB) approval obtained
- [ ] Stakeholders notified of deployment schedule
- [ ] Backup of current PROD environment completed
- [ ] Rollback plan reviewed and approved
- [ ] Deployment window scheduled and communicated
- [ ] Support team briefed on changes

## Deployment Steps
1. Create backup of PROD environment
2. Deploy branch 1.26.02.25 to PROD
3. Execute manual configuration steps:
   - LAC-226: Configure StreamChannelWidget properties for video search sorting
   - LAC-227: Add lacourtsearchquerycallback to typeahead and global search widgets
4. Verify all deployments
5. Execute post-deployment verification steps

## Post-Deployment Verification
- [ ] Verify video search sort configuration (LAC-226)
  - Verify widget properties are correctly configured
  - Search for videos
  - Confirm results are sorted by creation date (descending)
  
- [ ] Verify Resource Directory is removed from global search (LAC-227)
  - Perform global search and verify Resource Directory results are excluded
  - Test typeahead search excludes Resource Directory items
  - Verify lacourtsearchquerycallback is properly configured on both widgets
  
- [ ] Verify notification bell and settings are hidden from header (LAC-228)
  - Check desktop view across all sites
  - Check mobile view across all sites
  - Confirm bookmark flag is positioned correctly
  
- [ ] Verify employee profile fields are removed from edit page (LAC-229)
  - Log in as test user
  - Navigate to employee profile
  - Click Edit
  - Confirm Birthday, Mobile phone, and Fax fields are not displayed
  
- [ ] Smoke test all critical functionality
- [ ] Monitor application logs for errors
- [ ] Notify stakeholders of deployment completion

## Rollback Plan
If critical issues are encountered:
1. Revert to pre-deployment backup
2. Restore previous application version
3. Notify all stakeholders immediately
4. Document issues and create incident report
5. Schedule post-mortem meeting

## Communication Plan
- **Pre-Deployment**: Email to all users 24 hours prior
- **During Deployment**: Status updates via internal communication channels
- **Post-Deployment**: Confirmation email with summary of changes
- **Support**: Help desk briefed and ready for questions

---

**Prepared by**: Automated Release Notes Generator  
**Date**: February 25, 2026  
**Requires DEV Validation**: Yes
