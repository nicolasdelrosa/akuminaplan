# Ball Corp (BCRS) DEV Deployment Release Notes
## April 7, 2026

---

## Deployment Information

| **Item** | **Details** |
|----------|-------------|
| **Deployment Date** | April 7, 2026 |
| **Environment** | Development |
| **Repository** | TBD |
| **Branch** | TBD |
| **Pull Request** | TBD |
| **Pipeline** | TBD |
| **Deployment Ticket** | [BCRS-23](https://akumina.atlassian.net/browse/BCRS-23) |
| **Total Tickets** | 3 |
| **Manual Steps Required** | No |
| **Release Label** | `1.26.04.06.01` |

---

## Executive Summary

This DEV deployment includes **3 items** in **Ready to Deploy to Client Dev** status.

**Included in this deployment:**
- **BCRS-20**: Remove Recognize button from Employee Profile pages
- **BCRS-22**: Move Toolbox icon to the left of Save Bookmark icon
- **BCRS-18**: Improve Calendar widget load performance

---

## Tickets Included in This Deployment

### **[BCRS-20](https://akumina.atlassian.net/browse/BCRS-20) - Remove "Recognize" Button from Employee Profile Pages**
- **Type**: Task
- **Priority**: Medium
- **Status**: Ready to Deploy to Client Dev
- **Labels**: `1.26.04.06.01`
- **Description**:
  - Remove the native Recognize entry point from employee profile pages.
  - Reduce UI confusion because the client uses a separate enterprise recognition platform.
- **Technical Scope**:
  - Confirm whether removal is configuration-based or requires CSS override.
  - Ensure profile layout remains stable after button removal.
- **Manual Steps**: None
- **Testing Notes**:
  - Validate button is removed in profile header.
  - Validate no layout shifts and no console errors.

---

### **[BCRS-22](https://akumina.atlassian.net/browse/BCRS-22) - Move toolbox icon to the left of the save bookmark icon on the navigation bar**
- **Type**: Task
- **Priority**: Medium
- **Status**: Ready to Deploy to Client Dev
- **Labels**: `1.26.04.06.01`
- **Description**:
  - Reorder navigation icons to improve usability and align with design expectations.
- **Technical Scope**:
  - Position Toolbox icon immediately to the left of Save Bookmark icon.
  - Preserve nav spacing and interaction behavior.
- **Manual Steps**: None
- **Testing Notes**:
  - Validate icon order on desktop and responsive breakpoints.
  - Validate no regressions in navigation interactions.

---

### **[BCRS-18](https://akumina.atlassian.net/browse/BCRS-18) - Calendar Widget - Slow Load Performance (10+ seconds)**
- **Type**: Bug
- **Priority**: Medium
- **Status**: Ready to Deploy to Client Dev
- **Labels**: `product-issue`, `1.26.04.06.01`
- **Description**:
  - Calendar widget load time is consistently 10+ seconds.
  - HAR capture was collected for root cause analysis.
- **Technical Scope**:
  - Apply remediation to reduce render/load time and remove bottlenecks.
  - Validate API/network/render performance after fix.
- **Manual Steps**: None
- **Testing Notes**:
  - Validate improved load time target under normal conditions.
  - Validate no JavaScript console errors and no duplicate network calls.

---

## Pre-Deployment Checklist

- [ ] Confirm all included tickets remain in **Ready to Deploy to Client Dev**.
- [ ] Confirm target DEV environment variables and storage settings.
- [ ] Confirm branch and PR are finalized for deployment.
- [ ] Confirm rollback package/reference is documented.
- [ ] Confirm deployment owner and validation owner are assigned.

---

## Deployment Steps

1. Deploy prepared package/branch to Client DEV.
2. Validate deployment completion in pipeline/log output.
3. Run smoke checks for profile page, navigation bar, and calendar widget.
4. Execute focused verification for BCRS-20, BCRS-22, and BCRS-18.
5. Document results in deployment ticket `BCRS-23`.

---

## Post-Deployment Verification

- [ ] BCRS-20: Recognize button is no longer visible on profile pages.
- [ ] BCRS-20: No profile layout regressions or console errors.
- [ ] BCRS-22: Toolbox icon is left of Save Bookmark icon across breakpoints.
- [ ] BCRS-22: Navigation functionality remains stable.
- [ ] BCRS-18: Calendar widget load time is improved from baseline.
- [ ] BCRS-18: No API/network regressions observed.
- [ ] Validation evidence is posted to `BCRS-23`.

---

## Rollback Plan

1. Redeploy previous known-good DEV artifact/package.
2. Restore prior configuration/styles for affected components if needed.
3. Re-validate profile page, nav bar, and calendar widget behavior.
4. Add rollback rationale, timestamp, and owner details to `BCRS-23`.
