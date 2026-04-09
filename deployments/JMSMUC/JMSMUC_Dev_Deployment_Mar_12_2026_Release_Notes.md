# JM Smuckers DEV Deployment Release Notes
## March 12, 2026

---

## Deployment Information

| **Item** | **Details** |
|----------|-------------|
| **Deployment Date** | March 12, 2026 |
| **Environment** | Development |
| **Repository** | https://akuminadev.visualstudio.com/Smuckers |
| **Branch** | `feature/dev-deployment-mar-12-2026` |
| **Pull Request** | TBD (Create after branch push) |
| **Pipeline** | JMSmuckers-Headless-Dev |
| **Deployment Ticket** | [JMSMUC-196](https://akumina.atlassian.net/browse/JMSMUC-196) |
| **Total Tickets** | 3 |
| **Manual Steps Required** | Yes (JMSMUC-195) |
| **Release Label** | `dev-mar-12-2026` |

---

## Executive Summary

This DEV deployment includes **3 fresh items** currently in **Ready for Dev Deploy** status for JMSMUC. The release focuses on Our People widget reliability and UX consistency, plus a loading UI cleanup.

**Included today:**
- **JMSMUC-194**: Fix photo mismatch on Our People detail page
- **JMSMUC-195**: Constrain Our People results by publish date (requires manual deployment steps)
- **JMSMUC-176**: Remove loading bars via CSS remediation

---

## Tickets Included in This Deployment

### **[JMSMUC-194](https://akumina.atlassian.net/browse/JMSMUC-194) - Our People detail page not using the same photo defined in Our People content app**
- **Type**: Bug
- **Priority**: Medium
- **Status**: Ready for Dev Deploy
- **Labels**: None
- **Description**:
  - Detail page image does not match the `ImageUrl` configured in the SmuckersTeam content app item.
  - Expected behavior is consistent image rendering across home page, list view, and detail page.
- **Technical Scope**:
  - Ensure detail page binds to `ImageUrl` from SmuckersTeam list item.
  - Preserve existing select fields used by GenericListWidget.
- **Manual Steps**: None
- **Testing Notes**:
  - Compare same person card across home/list/detail views.
  - Verify detail page uses identical image asset as content app item.

---

### **[JMSMUC-195](https://akumina.atlassian.net/browse/JMSMUC-195) - Update Our People Query to only return items with SpotlightPublishDate <= Today**
- **Type**: Bug
- **Priority**: Medium
- **Status**: Ready for Dev Deploy
- **Labels**: manualdeployment
- **Description**:
  - Current query returns all active items without publish-date gating.
  - Required logic: `ItemActive = 1` AND `SpotlightPublishDate <= Today`.
- **Technical Scope**:
  - Update ViewXML logic used by Our People widget query in `src/js/widgets/GenericListWidget/config/config.json`.
  - Validate behavior for home page and list view instances.
- **⚠️ Manual Deployment Steps**:
  1. Remove GenericListWidget instances.
  2. Add SpotlightWidget instances to Home page and News List page.
- **Testing Notes**:
  - Confirm future-dated records do not render.
  - Confirm active records with publish date <= today render in expected order.

---

### **[JMSMUC-176](https://akumina.atlassian.net/browse/JMSMUC-176) - Loading bars**
- **Type**: Sub-task
- **Priority**: Medium
- **Status**: Ready for Dev Deploy
- **Labels**: dev-mar-09-2026
- **Description**:
  - Validate presence of loading bars and apply CSS remediation to remove them.
- **Technical Scope**:
  - Include and verify stylesheet update that removes loading bars.
- **Manual Steps**: None
- **Testing Notes**:
  - Validate loading bars are no longer visible in affected pages/components.

---

## Pre-Deployment Checklist

- [ ] Confirm branch `feature/dev-deployment-mar-12-2026` is up to date with target commits.
- [ ] Create/validate pull request for DEV deployment.
- [ ] Confirm all included tickets remain in **Ready for Dev Deploy**.
- [ ] Confirm manual deployment owner is assigned for JMSMUC-195.
- [ ] Confirm pipeline `JMSmuckers-Headless-Dev` is available and green for latest run.
- [ ] Backup/record current page widget configuration before manual widget swap.

---

## Deployment Steps

1. Deploy branch `feature/dev-deployment-mar-12-2026` to DEV via `JMSmuckers-Headless-Dev`.
2. Perform manual steps for JMSMUC-195:
   - Remove GenericListWidget instances.
   - Add SpotlightWidget instances to Home page and News List page.
3. Validate smoke tests for home page, list page, and Our People detail page.
4. Validate loading UI behavior where JMSMUC-176 applies.

---

## Post-Deployment Verification

- [ ] Our People detail page image matches content app `ImageUrl`.
- [ ] Future-dated Our People records are hidden.
- [ ] Eligible active records display correctly.
- [ ] Loading bars are removed in targeted areas.
- [ ] No JavaScript console errors for affected widgets/pages.
- [ ] Content authors confirm expected behavior in DEV.

---

## Rollback Plan

1. Revert deployment commit(s) and re-run `JMSmuckers-Headless-Dev` pipeline to previous known-good build.
2. Restore previous widget configuration if manual steps were applied:
   - Remove newly added SpotlightWidget instances.
   - Re-add prior GenericListWidget instances with previous settings.
3. Re-validate home/list/detail page rendering after rollback.
4. Update deployment ticket `JMSMUC-196` with rollback reason and timeline.
