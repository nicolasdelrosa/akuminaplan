# Runbook

*LA Court*

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
5. [Deployment](#deployment)
   - [Deployment Steps](#deployment-steps)
   - [Post-Deployment Verification](#post-deployment-verification)
6. [Project Team](#project-team)
7. [Known Issues](#known-issues)

---

## Change Log

| User | Date | Version | Comment |
|------|------|---------|---------|
| Diego Rosa | 03/19/2026 | 1.0 | Initial version generated from `runbookenv.md` |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

---

## Introduction

The purpose of this document is to provide a concise operational reference for the LA Court project, including source control, environment endpoints, deployment guidance, and project contacts. This document should be updated whenever environment details or support ownership change.

---

## Source Control

### Main

The project source is located at:

| Location |
|----------|
| https://akuminadev.visualstudio.com/_git/LACourts |

**Local Path:**
- `C:/Git/LACourt/LACourts/project/main`

**Jira Project:**
- https://akumina.atlassian.net/browse/LAC

**Suggested Branch Usage:**
- Production branch: `main`
- Development branch: `dev`
- Sandbox branch: `sandbox`

---

## Environments

### SANDBOX

| Component | URL |
|-----------|-----|
| Headless | https://akbps-lacourts-sandbox-headless.onakumina.com |
| App Manager | https://cloud-dev-fe-lacourts.onakumina.com |
| Delivery Site | https://akbps.sharepoint.com/sites/lacourts-sandbox-delivery |
| Central Site | https://akbps.sharepoint.com/sites/lacourts-sandbox-central |

**Purpose:**
- Sandbox and validation environment

### DEV

| Component | URL |
|-----------|-----|
| Headless | https://cloud-dev-fe-lacourts.onakumina.com/ |
| App Manager | https://cloud-dev-fe-lacourts.onakumina.com/ |
| Delivery Site | https://lacourts.sharepoint.com/sites/devakumina-delivery |
| Central Site | https://lacourts.sharepoint.com/sites/DevAkumina-Central |

**Purpose:**
- Active development and QA validation

### PROD

| Component | URL |
|-----------|-----|
| Headless | https://courtspace.lacourt.ca.gov |
| App Manager | https://courtspace-appm.lacourt.ca.gov |
| Delivery Site | https://lacourts.sharepoint.com/sites/courtspace-delivery |
| Central Site | https://lacourts.sharepoint.com/sites/courtspace-central |

**Purpose:**
- Production environment

---

## Deployment

### Deployment Steps

1. Confirm the target environment and intended branch.
2. Merge or promote approved changes into the target branch.
3. Execute the deployment pipeline or standard release process for the target environment.
4. Validate the deployment by checking the corresponding Headless, App Manager, Delivery Site, and Central Site URLs.
5. Update this runbook if any environment endpoint, ownership, or release process detail has changed.

### Post-Deployment Verification

Verify the following after each deployment:

1. Headless site loads successfully in the target environment.
2. App Manager is reachable and expected changes are present.
3. SharePoint Delivery and Central sites are accessible.
4. Smoke tests or QA validation complete without blocking issues.
5. Any deployment notes are recorded in the related Jira ticket.

---

## Project Team

| Role | Name |
|------|------|
| Tech Lead | Diego Rosa |
| PM | Theresa Ferris |
| QA | Ren Teutrault |
| Designer | Luke Shuck |

---

## Known Issues

No known issues were provided in the source material.

Add new issues in this section using:

1. Issue summary
2. Impacted environment
3. Workaround
4. Status

---

*Last Updated: 03/19/2026*  
*Version: 1.0*
