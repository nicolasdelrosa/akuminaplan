# LA Courts (LASC) Production Deployment
## Release Notes - January 16, 2026

---

### Deployment Information

**Date:** January 16, 2026  
**Environment:** Production (LASC)  
**Source Branch:** 1.26.01.14.01  
**Source Build:** 2601.1401 (Build ID 107996)  
**Reference DEV Deployment:** LAC-216 (Dev Deployment 1/9)  
**Related Production Ticket:** LAC-215

---

## Summary

This production deployment includes 5 tickets with 44 commits from the DEV environment, covering custom widget implementation, PeopleSync improvements, and performance optimizations for images and UI components.

**Deployment Period:** December 22, 2025 - January 14, 2026  
**Contributors:** Saikiran Puramsetti, Diego Rosa, Scott Kearney

---

## Features & Enhancements

### LAC-213: Custom Tiles Widget
**Priority:** Medium  
**Status:** Ready for Production  
**Commits:** 40

**Description:**  
Implementation of a new Custom Tiles Widget with multi-language support for displaying court resources in a tiled layout.

**What Changed:**
- Custom Tiles Widget implementation with GenericSearchListWidget framework
- Widget configuration and multiple view templates
- Multi-language support (English, Spanish, French)
- CourtResources TileView templates with responsive design
- Custom CSS and JavaScript libraries
- Language files: en-us.js, es-es.js, fr-fr.js

**Technical Details:**
- Widget: GenericSearchListWidget
- View: TileView
- Custom templates for Court Resources
- Responsive tile layout with search functionality

**Affected Files:**
- GenericSearchListWidget config, JS, and views
- CourtResources TileView templates (EN, ES, FR)
- Custom CSS and JS libraries
- Site deployer configurations

**Testing Status:** ✅ Verified in DEV (sandbox) - January 14, 2026

---

### LAC-219: PeopleSync - Filter Corrections
**Priority:** Medium  
**Status:** Ready for Production  
**Commits:** 1

**Description:**  
Fixed issue where PeopleSync filters were populated with incorrect entries.

**What Changed:**
- Updated CustomFilter logic
- Refined filter population rules
- Task Guide documentation updates

**Affected Files:**
- PeopleSync.Customization/CustomFilter.cs
- Tasks/Guide.txt

**Testing Status:** ✅ Verified in DEV - January 9, 2026

---

### LAC-207: CustomFilter Refactor
**Priority:** Medium  
**Status:** Ready for Production  
**Commits:** 1

**Description:**  
Refactored CustomFilter implementation to use employeeType instead of customfieldstring3 for improved user filtering logic.

**What Changed:**
- Changed filter attribute from customfieldstring3 to employeeType
- Improved data accuracy for user filtering
- Better alignment with data model

**Affected Files:**
- PeopleSync.Customization/CustomFilter.cs

**Testing Status:** ✅ Verified in DEV - January 3, 2026

---

### Performance Optimizations

#### LAC-193 / BPS-205: Lazy Loading Images
**Priority:** Medium  
**Status:** Ready for Production  
**Commits:** 1

**Description:**  
Implemented lazy loading for images across multiple widgets and master pages to improve page load performance.

**What Changed:**
- Lazy loading implementation on 6+ images
- Progressive image loading on scroll
- Performance improvement for initial page load
- Reduced bandwidth usage

**Affected Widgets/Components:**
- Employee Detail Widget views
- LaunchPad Widget views
- MyOrgTree Widget views
- QuickLinks Widget views
- Curated News Widget template
- Virtual masterpage templates (3 files)
- Custom CSS

**Performance Impact:**
- Faster initial page load times
- Reduced initial bandwidth consumption
- Improved user experience on slower connections

**Testing Status:** ✅ Verified in DEV - December 22, 2025  
**Deployment Verification:** ✅ Confirmed in sandbox - January 15, 2026

---

#### LAC-194 / BPS-225: Footer and Header Default Height
**Priority:** Medium  
**Status:** Ready for Production  
**Commits:** 1

**Description:**  
Adjusted default heights for footer and header components to optimize layout and visual consistency.

**What Changed:**
- Header height: 58px
- Footer min-height: 525px
- Improved layout stability
- Consistent spacing across pages

**Affected Files:**
- digitalworkplace.custom.css

**Testing Status:** ✅ Verified in DEV - December 22, 2025  
**Deployment Verification:** ✅ Confirmed in sandbox - January 15, 2026

---

## Deployment Checklist

### Pre-Deployment

- [ ] Verify all tickets are tested and approved
- [ ] Confirm production environment access
- [ ] Backup current production environment
- [ ] Review rollback procedures
- [ ] Notify stakeholders of deployment window
- [ ] Verify production pipeline configuration

### Deployment Steps

1. **Source Control**
   - [ ] Create production release branch from `1.26.01.14.01`
   - [ ] Tag release with version number
   - [ ] Document commit SHA: `ad7ce8958467eb28769dd6820196b245ae95fd7f`

2. **Pipeline Execution**
   - [ ] Trigger LASC PROD - Headless Pipeline
   - [ ] Monitor deployment progress
   - [ ] Verify successful build completion

3. **Post-Deployment Verification**
   - [ ] Verify Custom Tiles Widget displays correctly
   - [ ] Test PeopleSync filters functionality
   - [ ] Confirm lazy loading behavior on images
   - [ ] Validate header/footer heights (58px / 525px)
   - [ ] Test multi-language support (EN, ES, FR)
   - [ ] Verify responsive design on mobile devices

### Post-Deployment

- [ ] Update LAC-215 ticket status
- [ ] Document actual deployment time
- [ ] Capture screenshots of key features
- [ ] Notify stakeholders of successful deployment
- [ ] Monitor production logs for errors (first 24 hours)
- [ ] Close deployment ticket

---

## Risk Assessment

**Risk Level:** Low-Medium

**Potential Risks:**
1. **Custom Widget Integration** - New widget may have unexpected UI conflicts
   - **Mitigation:** Thoroughly tested in DEV, uses existing GenericSearchListWidget framework
   
2. **PeopleSync Filter Changes** - Data model changes could affect existing filters
   - **Mitigation:** Changes are isolated to CustomFilter.cs, tested with production-like data

3. **Performance Changes** - Lazy loading might affect existing scripts
   - **Mitigation:** Non-breaking change, progressive enhancement only

**Rollback Plan:**
- Previous production build available for immediate rollback
- Estimated rollback time: 15-30 minutes
- No database changes required

---

## Technical Summary

**Total Commits:** 44  
**Date Range:** December 22, 2025 - January 14, 2026  
**Primary Contributors:** Saikiran Puramsetti, Diego Rosa, Scott Kearney  
**Pipeline:** LASC PROD - Headless Pipeline  
**Source Commit:** ad7ce8958467eb28769dd6820196b245ae95fd7f

**Deployment Categories:**
- 🆕 New Features: 1 (Custom Tiles Widget)
- 🐛 Bug Fixes: 1 (PeopleSync Filters)
- ⚡ Performance: 2 (Lazy Loading, Header/Footer)
- 🔧 Refactoring: 1 (CustomFilter)

---

## Support Information

**Deployment Team:**
- Lead: Diego Rosa (diego.rosa@akumina.com)
- Development: Saikiran Puramsetti, Scott Kearney

**Support Contacts:**
- Technical Issues: Akumina Support
- Business Questions: LA Courts Project Manager

**Monitoring:**
- Production logs will be monitored for 24 hours post-deployment
- Performance metrics will be captured and compared to baseline

---

## References

- **DEV Deployment Ticket:** [LAC-216](https://akumina.atlassian.net/browse/LAC-216)
- **PROD Deployment Ticket:** [LAC-215](https://akumina.atlassian.net/browse/LAC-215)
- **DEV Build:** 2601.1401 (Build ID 107996)
- **DEV Deployment Date:** January 14, 2026
- **Source Branch:** 1.26.01.14.01

---

## Appendix: Ticket Details

### Included Tickets
1. **LAC-213** - Custom Tiles Widget (40 commits)
2. **LAC-219** - PeopleSync - Filters are populated with some incorrect entries (1 commit)
3. **LAC-207** - CustomFilter Refactor (1 commit)
4. **LAC-193/BPS-205** - Lazy loading images (1 commit)
5. **LAC-194/BPS-225** - Footer and Header - default height (1 commit)

### Verification History
- January 14, 2026: DEV deployment completed successfully
- January 15, 2026: LAC-193 and LAC-194 verified in sandbox
- January 16, 2026: Production deployment planned

---

*Document generated: January 16, 2026*  
*Last updated: January 16, 2026*
