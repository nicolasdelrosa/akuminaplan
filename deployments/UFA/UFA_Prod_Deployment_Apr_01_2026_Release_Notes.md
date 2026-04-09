# UFA Production Deployment
## Release Notes - April 1, 2026

---

### Deployment Information

**Date:** April 1, 2026  
**Environment:** Production (UFA)  
**Branch:** prod_2026.04.01.01  
**Pipeline:** UFA Production - Headless Pipeline  
**Source DEV Releases:** March 18, 2026; March 19, 2026; March 26, 2026  
**Ticket:** UFA-328 - Production Deploy

---

## Summary

This production release includes all DEV tickets released after the previous PROD release on February 25, 2026 (UFA-298).

- Previous PROD baseline: UFA_Prod_Deployment_Feb_25_2026_Release_Notes.md
- Included DEV releases checked:
  - UFA_DEV_Deployment_2026-03-18_Release_Notes.md
  - UFA_DEV_Deployment_2026-03-19_Release_Notes.md
  - UFA_DEV_Deployment_2026-03-26_Release_Notes.md
  - UFA_DEV_Deployment_Jan_22_2026.md (UFA-286 manual inclusion)
- Total unique tickets promoted: 20

---

## Source Release Coverage

| DEV Release | Deployment Ticket | Included Tickets |
|-------------|-------------------|------------------|
| 2026-01-22 | N/A | UFA-286 |
| 2026-03-18 | UFA-313 | UFA-301, UFA-299, UFA-304 |
| 2026-03-19 | UFA-314 | UFA-301, UFA-269, UFA-302, UFA-312, UFA-310, UFA-308, UFA-304, UFA-299, UFA-296, UFA-295, UFA-294, UFA-291, UFA-290 |
| 2026-03-26 | UFA-327 | UFA-324, UFA-325, UFA-321, UFA-318, UFA-315, UFA-323 |

---

## Included Tickets (Unique)

### Search Enhancements

#### UFA-301: Search - Header should not be indexed for search results
- Excludes header elements from search indexing
- Reduces duplicate and irrelevant search results

#### UFA-299: SEARCH - Display Short Description for document content type
- Displays Short Description when available
- Displays nothing when Short Description is empty

#### UFA-304: Search - Searched words should be highlighted on the result set
- Enables visual highlight styling for search terms in results
- Applies styling to SharePoint highlight tags

#### UFA-269: Search results showing multiple links to same content
- Removes duplicate search result entries for the same content
- Cleans and normalizes search indexing data

#### UFA-302: Search - Longer URL should be used within search results
- Uses full URL format in search results
- Removes short/default.aspx URL indexing patterns

#### UFA-312: Search - Typeahead box staying expanded over the search results
- Fixes overlay behavior when users submit search quickly
- Ensures typeahead closes correctly on results load

#### UFA-310: Search Result icons - Need to be the same size
- Standardizes icon dimensions across content types
- Aligns news and non-news result icons

#### UFA-323: Search box is only about 30% active
- Fixes search box click target and input behavior
- Resolves text scrolling/interaction issue in Tools and Systems context

#### UFA-286: Search add SLW results in typeahead and global search
- Adds Summary Links Widget (SLW) items to typeahead and global search results
- Uses managed property mapping to support searchable SummaryLinks node metadata
- Ensures SLW search integration is available in production

### UI/UX and Theme Updates

#### UFA-308: Update to footer
- Updates footer copy to UFA branding text
- Adds social links (X, LinkedIn, Facebook, YouTube, Instagram)
- Removes undesired policy links for this footer variant

#### UFA-296: All links to match link styling
- Standardizes inline link color and hover behavior
- Applies consistent orange/hover style across content types

#### UFA-295: Update Theme manager To include UFA change
- Updates theme variable `fs-featured-card-bg-color` to `495965`

#### UFA-315: DEV: font color regression, should be white font color
- Fixes tab/button text color regression
- Restores expected white font behavior

### Widget and View Updates

#### UFA-294: Updates to Tools and Systems Cards
- Hides group title
- Sets icon size to 50x50
- Aligns icon/title in top-left layout

#### UFA-291: Summary Links widget View - 4/5 across
- Fixes card-per-row behavior
- Restores consistent card sizing in featured box view

#### UFA-290: Remove icon background color for POC view and fix tool detail size
- Removes unwanted icon background
- Fixes sizing behavior for multi-paragraph descriptions

#### UFA-321: FAQ- Drop Shadows on SLW FAQ view
- Adds/normalizes drop shadow rendering in FAQ SLW view

#### UFA-318: SLW expanding list inline links should be orange
- Fixes inline quicklink color and hover behavior in expanding list view

### Content and News Behavior

#### UFA-324: Marketing calendar events are not loading when clicked on
- Fixes event detail visibility from new marketing calendar
- Corrects event click-through behavior

#### UFA-325: Related News departments are not showing related news
- Restores related news behavior on impacted department/news pages
- Applies template correction to affected subsites

---

## Manual Deployment Steps (Consolidated)

### Required Manual Steps

#### UFA-269
1. Visit PageData_AK from delivery and department sites and delete home.aspx entries.
2. Add central site App Manager search configuration for home.aspx.
3. Verify global typeahead search configuration has the typeahead view selected, then save.

#### UFA-302
1. Remove default.aspx from search configuration.
2. Remove indexed short URLs from Page_AK.
3. Reindex Full URL.

#### UFA-299
1. Verify column exists: Short Description.
2. Verify internal name: Short_x0020_Description.
3. Create the column if missing, matching the exact specification.

#### UFA-304
1. Add callbackUI to GenericSearchListWidget on central site.
2. Apply CSS styling for c0 highlight tags using UFA theme colors.

#### UFA-324
1. Add AkuminaSearch contenttype in calendar list.
2. Add TaxonomyRoute_AK instructions.

#### UFA-325
1. Run foundation4 site creator template on the subsites missing related news.

#### UFA-286
1. Navigate to SharePoint Admin Center > Search > Manage Search Schema.
2. Find an available RefinableString managed property (for example, RefinableString50).
3. Map crawled property `ows_NodeType` or `ows_q_CHCS_NodeType`.
4. Create alias `SPSUMMARYLINKNODETYPE`.
5. Enable property flags: Queryable, Retrievable, Refinable.
6. Trigger re-crawl of `SummaryLinks_AK` list.

### No Manual Steps Specified
- UFA-301, UFA-312, UFA-310, UFA-308, UFA-296, UFA-295, UFA-294, UFA-291, UFA-290, UFA-321, UFA-318, UFA-315, UFA-323

---

## Pre-Deployment Checklist

- [ ] Confirm UFA-328 production deployment ticket is in deployable state
- [ ] Confirm code baseline matches DEV releases from 2026-03-18, 2026-03-19, and 2026-03-26
- [ ] Validate all required manual steps and owners
- [ ] Confirm backup/snapshot of current production state
- [ ] Confirm stakeholder communication and deployment window

---

## Deployment Steps

1. Create production branch `prod_2026.04.01.01` from approved release baseline.
2. Execute UFA Production - Headless Pipeline.
3. Apply manual configuration/data updates listed above.
4. Trigger search reindex/crawl related to search configuration changes.
5. Clear application and CDN caches as required.
6. Run post-deployment validation checklist.

---

## Post-Deployment Verification

### Search Validation
- [ ] Header content excluded from search results (UFA-301)
- [ ] No duplicate results for same content (UFA-269)
- [ ] Full URLs displayed in search results (UFA-302)
- [ ] Typeahead no longer overlays result page (UFA-312)
- [ ] Search result icons are uniform (UFA-310)
- [ ] Search highlighting visible in content/summary where expected (UFA-304)
- [ ] Short Description behavior validated (UFA-299)
- [ ] Search box click area and typing behavior fixed (UFA-323)
- [ ] SLW results appear in typeahead and global search (UFA-286)
- [ ] Managed property alias `SPSUMMARYLINKNODETYPE` is populated after crawl (UFA-286)

### UI/UX Validation
- [ ] Footer content and social links match requirements (UFA-308)
- [ ] Inline link styling is consistent (UFA-296, UFA-318)
- [ ] Theme variable updates are visible and correct (UFA-295)
- [ ] Font color regression resolved (UFA-315)
- [ ] Tools and Systems card updates verified (UFA-294)
- [ ] Summary Links card layout is stable at expected columns (UFA-291)
- [ ] POC icon background and description sizing fixed (UFA-290)
- [ ] FAQ view drop shadows are visible (UFA-321)

### Content/News Validation
- [ ] Marketing calendar event details open correctly (UFA-324)
- [ ] Related News restored on impacted department/news pages (UFA-325)

### Technical Validation
- [ ] No critical console errors on key pages
- [ ] Smoke tests pass on desktop and mobile breakpoints

---

## Environment URLs

**Production:** https://cloud-prod-fe-ufa.onakumina.com/  
**Development:** https://cloud-dev-fe-ufa.onakumina.com/ (reference)

---

## Rollback Plan

If critical issues occur:
1. Stop in-progress deployment/release steps.
2. Roll back to previous stable production package/branch.
3. Revert manual changes applied in this release window.
4. Reindex/clear caches as needed for rollback consistency.
5. Validate key user journeys.
6. Update deployment ticket with rollback details.
7. Notify stakeholders and support contacts.

---

## Support Contacts

**Primary Contact:** Diego Rosa (diego.rosa@akumina.com)  
**Secondary Contact:** Luke Shuck (Luke.Shuck@akumina.com)  
**Project:** UFA Homestead  
**Jira Project:** UFA

---

## Release History

**Previous PROD Deployment:**
- February 25, 2026: UFA-298 (included UFA-274 to UFA-283)

**DEV Releases Included in This PROD:**
- January 22, 2026: UFA DEV release (UFA-286 included for PROD scope)
- March 18, 2026: UFA-313 (UFA-301, UFA-299, UFA-304)
- March 19, 2026: UFA-314 (13-ticket DEV release)
- March 26, 2026: UFA-327 (UFA-324, UFA-325, UFA-321, UFA-318, UFA-315, UFA-323)

---

_Release prepared on April 1, 2026._  
_Deployment Ticket: UFA-328_  
_Source baseline: UFA_Prod_Deployment_Feb_25_2026_Release_Notes_
