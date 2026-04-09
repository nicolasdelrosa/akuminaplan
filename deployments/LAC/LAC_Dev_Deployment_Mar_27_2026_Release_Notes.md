# LA Courts DEV Deployment Release Notes
## March 27, 2026

---

## Deployment Information

| **Item** | **Details** |
|----------|-------------|
| **Deployment Date** | March 27, 2026 |
| **Environment** | Development |
| **Repository** | https://akuminadev.visualstudio.com/_git/LACourts |
| **Branch** | `dev_2026.03.27.01` (planned) |
| **Pull Request** | TBD |
| **Pipeline** | LACourts-Headless-Dev |
| **Deployment Ticket** | [LAC-255](https://akumina.atlassian.net/browse/LAC-255) |
| **Total Tickets** | 4 |
| **Manual Steps Required** | Yes (LAC-244) |
| **Release Label** | `dev-mar-27-2026` |

---

## Executive Summary

This DEV deployment draft is prepared for LA Courts using the standard Akumina deployment workflow. Live Jira confirmation shows **4 tickets** currently in **Ready for Dev Deploy** and those are the only tickets included in this release draft.

The confirmed scope centers on Resource Directory behavior updates plus employee phone display in PeopleSync-backed profile rendering.

**Included tickets confirmed from live Jira:**
- LAC-239: Mobile Resource Directory clear filters visibility
- LAC-244: Resource Directory tile ordering by ABC
- LAC-245: Favorite star support in Resource Directory list view
- LAC-251: Employee phone mapping for profile display

---

## Release Gates

- [x] Confirm included LAC tickets from live Jira.
- [x] Confirm every included ticket is in **Ready for Dev Deploy**.
- [ ] Confirm the last successful `LACourts-Headless-Dev` run and derive the next branch name.
- [x] Create or identify the Jira deployment tracking ticket.
- [x] Confirm whether manual deployment steps exist in any included ticket description.
- [ ] Confirm required secondary pipelines based on final changed-path scope.

---

## Provisional Scope From Current Repo State

The current LAC working tree and changed-path artifacts suggest the following technical areas may be part of this release:

### Search and Widget Changes

- `project/main/src/js/widgets/GenericSearchListWidget/config/config.json`
- `project/main/src/js/widgets/GenericSearchListWidget/js/widgets/GenericSearchListWidget.js`
- `project/main/src/js/widgets/GenericSearchListWidget/views/tileview.html`
- `project/main/src/js/library/digitalworkplace.custom.js`

### View and Template Changes

- `project/main/src/js/widgets/EmployeeDetailWidget/views/lasc-employedetailhive.html`
- `project/main/src/content/templates/CourtResources/TileView.html`
- `project/main/src/content/templates/curatednewswidget/curatednews.html`
- `project/main/src/masterpage/lasc-virtualmasterpagehivedeptvisiblemenu.html`
- `project/main/src/masterpage/lasc-virtualmasterpagehivevisiblemenu.html`

### Build and Site Definition Changes

- `project/main/build/sitedefinitions/Delivery/ContentApps/CourtResources_AK.json`
- `project/main/build/sitedefinitions/Delivery/VirtualPages/CourtResources.json`
- `project/main/build/sitedefinitions/digitalworkplacewidgets/widgetpackages/CourtResources/TileView.html`
- `project/main/sitedefinitions/digitalworkplacewidgets/widgetpackages/CourtResources/TileView.html`

---

## Pipeline Requirements

### Required

- [ ] `LACourts-Headless-Dev`

### Candidate Additional Pipelines

- [ ] **Delivery Pipeline review required**
  - Reason: current changed paths include `Delivery/VirtualPages` artifacts.
- [ ] **Central Site Widgets pipeline review required**
  - Reason: current changed paths include widget package and widget source artifacts.

Final pipeline requirements must be confirmed after the live Jira-backed release scope is locked.

---

## Tickets Included in This Deployment

### **[LAC-239](https://akumina.atlassian.net/browse/LAC-239) - LOE: Mobile version of Resource directory does NOT show the Clear Filters link**
- **Type**: Bug
- **Priority**: High
- **Status**: Ready for Dev Deploy
- **Labels**: None
- **Description**:
  - Resource Directory filters are visible in desktop view but missing on tablet and mobile layouts.
- **Technical Scope**:
  - Restore filter visibility and usability for iPad/tablet and phone/mobile views.
- **Manual Steps**: None identified in Jira description.
- **Testing Notes**:
  - Verify filters appear and function in tablet and mobile breakpoints.

---

### **[LAC-244](https://akumina.atlassian.net/browse/LAC-244) - LOE: Resource Directory - Tile ordering by ABC**
- **Type**: Task
- **Priority**: High
- **Status**: Ready for Dev Deploy
- **Labels**: manualdeployment
- **Description**:
  - Resource Directory items need deterministic alphabetical ordering with support for explicit sort order.
- **Technical Scope**:
  - Update sorting behavior for Resource Directory content and align it with a managed property-backed sort key.
- **Manual Steps**: Required. See Manual Deployment Steps section.
- **Testing Notes**:
  - Verify alphabetical ordering and Sort Order precedence on Resource Directory results.

---

### **[LAC-245](https://akumina.atlassian.net/browse/LAC-245) - Resource directory - card view has favorite star - Enable “Favorite” (star) functionality in Resource Directory list view**
- **Type**: Task
- **Priority**: High
- **Status**: Ready for Dev Deploy
- **Labels**: None
- **Description**:
  - Bring favorite star behavior from card view into list view for Resource Directory items.
- **Technical Scope**:
  - Add favorite toggle behavior to list view and preserve state consistency with card view.
- **Manual Steps**: None identified in Jira description.
- **Testing Notes**:
  - Verify star visibility, toggle behavior, and cross-view consistency.

---

### **[LAC-251](https://akumina.atlassian.net/browse/LAC-251) - Integrate and map employee phone numbers into PeopleSync for profile display**
- **Type**: Task
- **Priority**: Medium
- **Status**: Ready for Dev Deploy
- **Labels**: None
- **Description**:
  - Employee phone numbers must be mapped into PeopleSync and displayed on profile pages.
- **Technical Scope**:
  - Surface mapped phone data on employee profile rendering while handling missing values safely.
- **Manual Steps**: None identified in Jira description.
- **Testing Notes**:
  - Verify phone display for users with source data and no regression for users without it.

---

## Manual Deployment Steps

### LAC-244

1. Create new column.
2. Create a calculated field with:

```text
=IF(ISBLANK([Sort Order]),"999999",TEXT([Sort Order],"000000"))&"|"&LOWER(TRIM([Resource Title]))
```

3. Create new managed property:

```json
[{"PropertyName": "LACCOURTSORTORDERTITLE", "DisplayName": "Sort Order"}]
```

4. Re-index `CourtResources_AK`.

---

## Pre-Deployment Checklist

- [ ] Confirm the final included ticket set from live Jira.
- [ ] Confirm branch name and source/base branch from Azure DevOps.
- [ ] Create or validate pull request for DEV deployment.
- [ ] Confirm all included tickets remain in **Ready for Dev Deploy**.
- [ ] Confirm deployment owner and QA owner.
- [ ] Confirm `LACourts-Headless-Dev` is green for latest run.
- [ ] Confirm any Delivery Pipeline and Central Site Widgets pipeline requirements.
- [ ] Record current widget/page configuration if manual steps are required.

---

## Deployment Steps

1. Create the dated DEV deployment branch `dev_2026.03.27.01` from the correct Azure DevOps source branch.
2. Create the pull request and link all included LAC work items.
3. Run `LACourts-Headless-Dev` for the deployment branch.
4. Run any additional required pipelines if the final scope includes Delivery or widget-package changes.
5. Apply documented manual deployment steps, if any.
6. Execute smoke and targeted verification for all included features.

---

## Post-Deployment Verification

### General Smoke

- [ ] DEV headless site loads: `https://cloud-dev-fe-lacourts.onakumina.com/`
- [ ] No blocking JavaScript console errors on affected pages.
- [ ] No obvious asset load failures for changed pages or widgets.

### Targeted Functional Verification

- [ ] Generic Search List changes behave as expected for the affected instances.
- [ ] Court Resources tile and ordering behavior is correct where applicable.
- [ ] Employee Detail page renders work phone correctly for a known user record.
- [ ] Any curated news or masterpage updates render correctly.
- [ ] Any VirtualPages-backed experiences reflect the deployed changes.

### Cross-Environment Checks

- [ ] Delivery site integration remains functional.
- [ ] Central site integration remains functional.
- [ ] No regression in mobile rendering for touched widgets/views.

---

## Rollback Plan

1. Revert the deployment commit set or redeploy the previous known-good branch.
2. Re-run `LACourts-Headless-Dev` against the rollback target.
3. Re-run any secondary pipelines affected by this release if they were part of the deployment.
4. Reverse any manual deployment steps using the pre-deployment configuration record.
5. Update deployment ticket [LAC-255](https://akumina.atlassian.net/browse/LAC-255) with rollback reason, scope, and timestamp.

---

## Contacts

- **Tech Lead**: Diego Rosa
- **PM**: Theresa Ferris
- **QA**: Ren Teutrault
- **Designer**: Luke Shuck

Environment references sourced from `c:/Git/LACourt/LACourts/runbookenv.md`.
