# LA Courts (LASC) Development Deployment
## January 26, 2026

---

## Deployment Overview

| Property | Value |
|----------|-------|
| **Deployment Date** | January 26, 2026 |
| **Environment** | Development |
| **Branch** | `dev_2026.01.26.01` |
| **Pipeline** | LACourts-Headless-Dev |
| **Status** | Ready for Deployment |

---

## Tickets Included

### LAC-213: CUSTOM TILES WIDGET
**Type:** Story  
**Priority:** Medium  
**Status:** Ready for Dev Deploy  
**Assignee:** Jenna Lee  
**Created:** December 24, 2025  
**Updated:** January 6, 2026

#### Description

Create a custom widget with a view that works similar to the People Directory. Each of the tiles would be a list item with data to use for filtering. This would replace the need for having multiple pages with tabs. The Subscriber desires the user to be brought directly to the content associated with the search, prepopulating the filters if feasible.

#### Bookmark in Tile

From one of these tiles, the Subscriber would like to have a way to create a bookmark for the link destination associated to the tile. For example, the tile that says "Forms" links to a specific form. There would be a star or other button that would open the Akumina bookmark modal with the title and URL prepopulated.

#### Functional Requirements

1. **Tile-based Interface** - Display Court Resources as clickable tiles (similar to People Directory layout)
2. **Multi-faceted Filtering** - Filter by Litigation Type, Resource Type, and Department
3. **Search Functionality** - Keyword search across title and content
4. **Deep Linking** - Prepopulate filters from URL parameters for direct access
5. **Bookmark Feature** - Star button on each tile to add to Akumina Favorites
6. **Single Page Experience** - Replace multiple tabbed pages with one filtered view
7. **User-Managed Taxonomy** - Allow users to add new filter terms without code changes

#### Issues Resolved

1. **Widget Title Not Showing** - Fixed rendering issue where the widget title was not displaying in the custom tiles view. Widget now properly displays the configured title at the top of the component.

2. **Icons Not Showing in Widget** - Resolved icon display issues where Font Awesome and custom Akumina icons were not rendering correctly. Icons now display properly for all tile items with proper styling and sizing.

#### QA Notes

When creating items, add appropriate icons. Common icon classes:
- `fa fa-file` - Default file icon
- `fa fa-file-pdf` - PDF documents
- `fa fa-calendar` - Calendar
- `fa fa-calendar-check` - Calendar with checkmark
- `fa fa-folder-open` - Open folder
- `fa fa-folder` - Folder
- `ia-court-rules` - Custom court rules icon

---

## Deployment Steps

### Pre-Deployment
- [ ] Review all code changes in pull request
- [ ] Ensure branch `dev_2026.01.26.01` is created from `main`
- [ ] Link work items to pull request (LAC-213)

### Deployment Execution
- [ ] Create Pull Request from `main` to `dev_2026.01.26.01`
- [ ] Run pipeline: LACourts-Headless-Dev
- [ ] Monitor build execution for errors
- [ ] Verify pipeline completion status

### Post-Deployment Verification

#### Widget Verification
- [ ] Navigate to Widget Manager
- [ ] Confirm Custom Tiles Widget is available
- [ ] Add widget to a test page
- [ ] Verify widget renders correctly with custom tiles

#### Functional Testing
- [ ] Test tile click interactions and navigation
- [ ] Verify multi-faceted filtering (Litigation Type, Resource Type, Department)
- [ ] Test keyword search functionality
- [ ] Verify deep linking with URL parameters
- [ ] Test bookmark feature (star button)
- [ ] Verify responsive behavior on mobile/tablet
- [ ] Check styling and layout consistency
- [ ] Verify icon display on items

#### Performance Testing
- [ ] Monitor page load time with widget
- [ ] Check network requests
- [ ] Verify no console errors

---

## Rollback Plan

If deployment causes issues:

1. Identify the last stable branch
2. Re-run pipeline with previous branch
3. Document issues and findings
4. Update LAC-213 with issue details
5. Schedule remediation work

---

## Related Documentation

- **Widget:** Custom Tiles Widget for Court Resources
- **Similar Widget:** People Directory (reference implementation)
- **Feature:** Akumina Favorites/Bookmarking System

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | | | Pending |
| Dev Lead | Jenna Lee | | Pending |
| Client Approval | | | Pending |

---

**Generated:** January 26, 2026  
**Deployment Branch:** `dev_2026.01.26.01`
