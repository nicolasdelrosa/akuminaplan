# LAC Dev Deployment Execution Tracking
## March 27, 2026

---

## Deployment Summary

| Item | Details |
|------|---------|
| **Project** | LA Courts (LAC) |
| **Environment** | Development |
| **Deployment Date** | March 27, 2026 |
| **Branch Created** | `dev_2026.03.27.01` (planned) |
| **Source Branch** | TBD after Azure DevOps baseline check |
| **Deployment Ticket** | [LAC-255](https://akumina.atlassian.net/browse/LAC-255) |
| **Pull Request** | TBD |
| **Status** | Planning |

---

## Preconditions

- [ ] Live Jira query completed for LAC deployment-ready tickets
- [ ] Final ticket list approved
- [ ] Last successful `LACourts-Headless-Dev` run identified
- [ ] Next deployment branch naming pattern confirmed
- [x] Deployment tracking ticket created or found
- [ ] Manual deployment steps extracted from Jira

---

## Pipeline Impact Review

- [ ] Headless DEV pipeline required
- [ ] Delivery Pipeline requirement confirmed
- [ ] Central Site Widgets pipeline requirement confirmed

### Current Evidence

- `project/main/build/sitedefinitions/Delivery/VirtualPages/CourtResources.json`
- `project/main/build/sitedefinitions/digitalworkplacewidgets/widgetpackages/CourtResources/TileView.html`
- `project/main/src/js/widgets/GenericSearchListWidget/config/config.json`

---

## Confirmed Included Tickets

- [x] LAC-239 - Mobile Resource Directory clear filters visibility
- [x] LAC-244 - Resource Directory tile ordering by ABC
- [x] LAC-245 - Favorite star support in Resource Directory list view
- [x] LAC-251 - Employee phone mapping for profile display

---

## Deployment Execution Log

### Step 1: Lock Release Scope
**Status:** Pending  
**Owner:** TBD  
**Notes:**
```
Use live Jira, not the stale local CSV, to determine the final included tickets.
```

### Step 2: Create Deployment Branch
**Status:** Pending  
**Owner:** TBD  
**Notes:**
```
Derive the branch from the last successful LACourts-Headless-Dev run.
Preserve the existing DEV branch naming convention.
```

### Step 3: Create Pull Request
**Status:** Pending  
**Owner:** TBD  
**Notes:**
```
Link every included LAC ticket to the PR and deployment ticket.
```

### Step 4: Run Pipelines
**Status:** Pending  
**Owner:** TBD  
**Notes:**
```
Run LACourts-Headless-Dev first.
Run Delivery and Central Site Widgets only if confirmed by final scope.
```

### Step 5: Execute Manual Steps
**Status:** Pending  
**Owner:** TBD  
**Notes:**
```
Only execute steps copied verbatim from included Jira tickets.
```

### Step 6: Verify Deployment
**Status:** Pending  
**Owner:** TBD  
**Notes:**
```
Validate targeted search, widget, template, and VirtualPages behavior in DEV.
```

---

## Functional Verification Checklist

### Search and Widget Verification

- [ ] Generic Search List instances load and render expected sort/order behavior
- [ ] Search interactions do not regress on targeted pages
- [ ] Court Resources tiles render correctly
- [ ] Widget package changes are visible where expected

### People and Detail View Verification

- [ ] Employee Detail view shows work phone for a known user with data
- [ ] Existing employee detail fields still render correctly

### Page and Template Verification

- [ ] Curated news template changes render correctly
- [ ] Masterpage changes do not break layout or navigation
- [ ] VirtualPages-backed content reflects deployed updates

### Technical Verification

- [ ] No blocking console errors
- [ ] No broken static assets
- [ ] No failed critical network requests
- [ ] Mobile rendering is acceptable on affected pages

---

## Issues Found

| # | Issue | Severity | Status | Resolution |
|---|-------|----------|--------|-----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Rollback Decision

**Rollback Required?** [ ] Yes  [ ] No

**Reason (if yes):**
```
[Document rollback trigger and impacted scope]
```

**Rolled Back By:** TBD  
**Rollback Time:** TBD  
**Rollback Target:** TBD

---

## Sign-Off

| Role | Name | Date | Time | Status |
|------|------|------|------|--------|
| QA Tester | Ren Teutrault | | | [ ] Approved [ ] Rejected |
| Tech Lead | Diego Rosa | | | [ ] Approved [ ] Rejected |
| PM | Theresa Ferris | | | [ ] Approved [ ] Rejected |

---

## Notes

```
This execution sheet intentionally blocks on live Jira and Azure DevOps verification.
Do not convert this into an active deployment record until the final ticket set is confirmed.
```