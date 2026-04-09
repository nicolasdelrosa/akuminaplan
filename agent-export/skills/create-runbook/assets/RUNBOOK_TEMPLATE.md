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
   - [Custom Views](#custom-views)
   - [Widget Callbacks](#widget-callbacks)
   - [Libraries And Global Scripts](#libraries-and-global-scripts)
   - [Master Pages](#master-pages)
7. [Known Issues](#known-issues)

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

### Custom Views

Document the client-specific widget views that are actually present in source and configured in widget configs:

- **WidgetName1**
  View: `client-example.html`
  Purpose: Brief support-oriented description

### Widget Callbacks

Document widget callbacks from config, even when the widget uses a standard/default view:

- **WidgetName1**
  Data callback: `CallbackName`
  UI callback: `UICallbackName`
  Support note: What the callback changes in rendered behavior or data shaping

### Libraries And Global Scripts

Summarize important support-relevant logic in global scripts:

- **digitalworkplace.custom.js**: Theme hooks, callback implementations, DOM manipulation, or other client logic support should know about

### Master Pages

Document client-specific master pages or other layout-level HTML assets when present:

- `clientmasterpage.html`: Brief purpose

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
