# Runbook

*JM Smuckers*

---

## Table of Contents
1. [Change Log](#change-log)
2. [Introduction](#introduction)
3. [Source Control](#source-control)
   - [Main](#main)
4. [Environments](#environments)
   - [SANDBOX](#sandbox)
   - [DEV](#dev)
   - [PROD](#prod)
5. [Project Team](#project-team)
6. [Project Customizations](#project-customizations)
   - [Custom Views](#custom-views)
   - [Widget Callbacks](#widget-callbacks)
   - [Libraries And Global Scripts](#libraries-and-global-scripts)
   - [Master Pages](#master-pages)
7. [Known Issues](#known-issues)

---

## Change Log

| User | Date | Version | Comment |
|------|------|---------|---------|
| Diego Rosa | 03/20/2026 | 1.2 | Updated runbook format to emphasize support-relevant customizations and removed deployment section |
| Diego Rosa | 03/20/2026 | 1.1 | Completed JMS runbook using `runbookenv.md` and current deployment artifacts |
| Diego | 03/19/2026 | 1.0 | Initial version |
|  |  |  |  |

---

## Introduction

The purpose of this document is to provide a concise operational reference for the JM Smuckers project, including source control, environment endpoints, deployment guidance, project contacts, and major custom solution areas. This document should be updated whenever environment details, deployment conventions, or ownership change.

---

## Source Control

### Main

The project source is located at:

| Location |
|----------|
| https://akuminadev.visualstudio.com/_git/Smuckers |

**Local Path:**
- `C:/Git/smuckers/smuckers/project/main`

**Jira Project:**
- https://akumina.atlassian.net/browse/JMSMUC

**Suggested Branch Usage:**
- Production branch: `main`
- Development branch: `dev`
- Sandbox branch: `sandbox`

---

## Environments

### SANDBOX

| Component | URL |
|-----------|-----|
| Headless | https://akbps-smuckers-sandbox-headless.onakumina.com |
| App Manager | https://akbps-smuckers-sandbox-am.onakumina.com |
| Delivery Site | https://akbps.sharepoint.com/sites/smuckers-sandbox-delivery |
| Central Site | https://akbps.sharepoint.com/sites/smuckers-sandbox-central |

**Purpose:**
- Sandbox and validation environment

### DEV

| Component | URL |
|-----------|-----|
| Headless | https://cloud-dev-fe-jmsmucker.onakumina.com |
| App Manager | https://cloud-dev-jmsmucker.onakumina.com |
| Delivery Site | https://jmscollabdev.sharepoint.com/sites/neighborhooddeliverydev |
| Central Site | https://jmscollabdev.sharepoint.com/sites/NeighborhoodCentralDev |

**Purpose:**
- Active development and QA validation

**Current Deployment Pipeline:**
- `JMSmuckers-Headless-Dev`

### PROD

| Component | URL |
|-----------|-----|
| Headless | https://neighborhood.jmsmucker.com |
| App Manager | https://neighborhoodcentral.jmsmucker.com |
| Delivery Site | https://jmsmucker.sharepoint.com/sites/neighborhooddelivery |
| Central Site | https://jmsmucker.sharepoint.com/sites/NeighborhoodCentral |

**Purpose:**
- Production environment

**Current Deployment Pipeline:**
- `JMSmuckers-Headless-Prod`

---

## Project Team

| Role | Name |
|------|------|
| PM | Theresa Ferris |
| Tech Lead | Diego Rosa |
| Designer | Luke Shuck |
| QA | Ren Tetrault |

---

## Project Customizations

The following sections identify support-relevant customization points confirmed in the Smuckers source tree and widget configs.

### Custom Views

Client-specific widget views currently configured in source:

- **EmployeeSpotlightWidget**
  View: `smuckers-homepage.html`
  Purpose: Custom homepage presentation for spotlighted people content.
- **EmployeeSpotlightWidget**
  View: `smuckers-listview.html`
  Purpose: Custom list presentation for spotlight/persona content.
- **EventsWidget**
  View: `smuckers-eventshomepage.html`
  Purpose: Custom events homepage rendering for JM Smuckers.
- **GenericItemWidget**
  View: `smuckers-spotlight-detail.html`
  Purpose: Custom spotlight detail page template.
- **GenericListWidget**
  View: `smuckers-ourpeoplehomepage.html`
  Purpose: Custom homepage experience for the SmuckersTeam list.
- **GenericListWidget**
  View: `smuckers-ourpeopleviewlist.html`
  Purpose: Custom list page experience for the SmuckersTeam list.
- **QuickLinksWidget**
  View: `SmuckersMegaMenuDefaultVisible.html`
  Purpose: Custom mega menu/top navigation template.

### Widget Callbacks

Configured widget callbacks that support should know about:

- **EventsWidget**
  Data callback: `EventCallback`
  UI callback: `EventUICallback`
  Support note: Marks events as current-day versus upcoming and injects section headers while reordering DOM output.
- **EmployeeSpotlightWidget**
  Data callback: `SmuckerEmployeeSpotlightCallback`
  UI callback: `SmuckerEmployeeSpotlightUICallback` on the homepage instance
  Support note: Normalizes spotlight/person data, applies fallbacks, and initializes the homepage spotlight carousel with an added View All card.
- **GenericListWidget**
  Data callback: `SmuckerEmployeeSpotlightCallback`
  UI callback: `SmuckerEmployeeSpotlightUICallback` on the homepage instance only
  Support note: Shapes SmuckersTeam list data for homepage/list rendering and shares the same spotlight callback behavior as EmployeeSpotlightWidget.
- **GenericItemWidget**
  Data callback: `SmuckersSpotlightItemDetailCallback`
  UI callback: none configured
  Support note: Shapes detail-page data, resolves image fallback behavior, maps tag/category presentation, and formats publish date/output fields for the spotlight detail template.
- **QuickLinksWidget**
  Data callback: none configured
  UI callback: `Smuckersglobalnavcallbackui`
  Support note: The widget config references this callback, but no implementation was found in the current source tree. Treat this as a support risk when troubleshooting top navigation behavior.

### Libraries And Global Scripts

Important support-relevant behaviors found in `src/js/library/digitalworkplace.custom.js`:

- `AdditionalSteps.MoreSteps.Init` adds the `ak-theme-smuckers` body class, which is a prerequisite for theme-specific behavior.
- `FireWhen` provides delayed callback execution and is used to wait for dependencies such as Slick carousel initialization.
- `EventCallback` and `EventUICallback` customize event categorization and DOM grouping for the events homepage widget.
- `SmuckerEmployeeSpotlightCallback` transforms people/spotlight data, including image resolution and fallback handling, before widget binding.
- `SmuckersSpotlightItemDetailCallback` remaps detail-page fields, derives display metadata, and resolves image sources for spotlight detail rendering.
- `SmuckerEmployeeSpotlightUICallback` initializes the key contacts carousel and appends a View All card for homepage spotlight content.
- `JMSLazyLoading` implements desktop-only lazy loading for selected image areas using `IntersectionObserver`, listens for Akumina page events, and rebinds on DOM mutations.

### Master Pages

Client-specific master page assets present in source:

- `smuckermasterpagedelivery.html`: Delivery-site master page layout and shared page chrome.
- `smuckermasterpagedept.html`: Department-site master page layout and shared page chrome.

---

## Known Issues

No standing known issues were provided in `runbookenv.md`.

Operational note:
- `QuickLinksWidget` references `Smuckersglobalnavcallbackui` in config, but that callback implementation was not found in the current source tree.

Add new issues in this section using:

1. Issue summary
2. Impacted environment
3. Workaround
4. Status

---

*Last Updated: 03/20/2026*  
*Version: 1.2*
