# Runbook

*[CLIENT_NAME]*

---

## Table of Contents
1. [Change Log](#change-log)
2. [Introduction](#introduction)
3. [Testing Requirements](#testing-requirements)
   - [Web browser](#web-browser)
4. [Source Control](#source-control)
   - [Main](#main)
5. [Site](#site)
   - [DEV - Central](#dev-central)
   - [PROD - Central](#prod-central)
6. [Project Customizations](#project-customizations)
   - [Widgets](#widgets)
   - [Libraries](#libraries)

---

## Change Log

| User | Date | Version | Comment |
|------|------|---------|---------|
| [AUTHOR] | [DATE] | 1.0 | Initial version |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

---

## Introduction

The purpose of this document is to provide detailed information regarding the [CLIENT_NAME] project. This document should be kept current whenever implementation details change.

---

## Testing Requirements

### Web browser

1. Responsive breakpoints are:
   - a. Desktop LG 1600px +
   - b. Desktop MD 1200px - 1599px
   - c. Desktop SM 992px - 1199px
   - d. Tablet 768px - 991px
   - e. Mobile 576px - 767px
   - f. Note: for sizes above 1600px, margins on side will get bigger but content size stays the same

2. Following are supported browsers:
   - a. Google Chrome: latest full version
   - b. Mozilla Firefox: latest 2 versions
   - c. Apple Safari: latest 2 versions
   - d. Microsoft Edge (Chromium): latest full version

---

## Source Control

### Main

The project source is located at:

| Location |
|----------|
| [REPOSITORY_URL] |

**Branch Strategy:**
- Main branch: `main`
- Development branch: `dev`
- Release branches: `release/*`

---

## Site

### DEV - Central

| Field | Value |
|-------|-------|
| **URL** | [DEV_URL] |
| **Framework Version** | Core: [CORE_VERSION] \| Headless: [HEADLESS_VERSION] |
| **App Manager Version** | [APPMANAGER_VERSION] |

### PROD - Central

| Field | Value |
|-------|-------|
| **URL** | [PROD_URL] |
| **Framework Version** | Core: [CORE_VERSION] \| Headless: [HEADLESS_VERSION] |
| **App Manager Version** | [APPMANAGER_VERSION] |

---

## Project Customizations

### Widgets

List of custom widgets developed for this project:

- **WidgetName1**: Brief description
- **WidgetName2**: Brief description

### Libraries

Custom JavaScript libraries:

- **digitalworkplace.custom.js**: Custom extensions and helper functions
- **customlibrary.js**: Description of custom library

---

## Deployment

### Pipeline Information

| Environment | Pipeline Name | Branch |
|-------------|---------------|--------|
| DEV | [CLIENT]-Dev-Pipeline | dev |
| PROD | [CLIENT]-Prod-Pipeline | main |

### Deployment Steps

1. Merge changes to target branch
2. Run pipeline from Azure DevOps
3. Verify deployment in target environment
4. Update this runbook if configuration changed

---

## Known Issues

[Document any known issues, workarounds, or limitations]

1. Issue description
   - **Workaround**: Steps to work around the issue
   - **Status**: Open/In Progress/Resolved

---

## Contact Information

| Role | Name | Email |
|------|------|-------|
| Project Lead | [Name] | [email] |
| Technical Lead | [Name] | [email] |
| Client Contact | [Name] | [email] |

---

*Last Updated: [DATE]*
*Version: 1.0*
