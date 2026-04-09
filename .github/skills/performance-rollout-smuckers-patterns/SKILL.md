# Performance Rollout (Smuckers Patterns)

## When to use
Use this skill when you need to apply proven Smuckers performance optimizations to another Akumina site (new branch or new client).

Typical triggers:
- Reduce initial render jank and layout shifts
- Add image lazy loading for desktop views
- Improve profile image fallback behavior
- Hide noisy widget loading spinners/bars
- Minify custom JS/CSS after build

## Verified source patterns
The following patterns were verified from Smuckers source code and git history.

### Pattern A: Baseline performance hardening (JMS-63)
Purpose:
- Reduce perceived load time and visual instability
- Avoid showing incomplete spotlight cards before carousel init

Implementation files:
- src/css/digitalworkplace.custom.css
- src/js/library/digitalworkplace.custom.js

What was implemented:
1. Add min-height guards for heavy homepage sections in CSS:
   - curated/news row
   - key contacts container
   - events/tab containers
   - greeting area
2. Hide key-contact item wrappers by default until ready.
3. In JS UI callback, explicitly show cards after slick initialization and before appending extra cards.

Reference commits:
- 7c894e0 (JMS-63 reducing image sizes and adding min heights for performance)

### Pattern B: Lazy loading images (JMS-172, BPS-205)
Purpose:
- Defer below-the-fold image fetches and improve initial render
- Prevent repeated image work while scrolling in SPA scenarios

Implementation file:
- src/js/library/digitalworkplace.custom.js

What was implemented:
1. Theme-gated lazy-load IIFE for desktop only.
2. IntersectionObserver-based loading with a placeholder SVG.
3. Selector list targeting publisher images, thumbnails, profile images, and footer images.
4. Robustness fixes:
   - isInitialized guard to prevent duplicate setup
   - observer reuse (do not recreate each pass)
   - skip if image already lazy-loading/lazy-loaded
   - MutationObserver debounce for SPA reflows
   - scoped query under #ak-master or #s4-workspace
5. Accessibility:
   - aria-busy while loading
   - aria-label loading suffix cleanup
6. Debug switch in config (debug false by default).

Reference commits:
- f0a31b0 (initial lazy-load implementation)
- fcd4b60 (fixes for duplicate initialization and repeated processing)

### Pattern C: Profile image preload fallback in master pages (JMS-179)
Purpose:
- Prevent profile-image flash/blank states during initial render

Implementation files:
- src/masterpage/smuckermasterpagedelivery.html
- src/masterpage/smuckermasterpagedept.html

What was implemented:
1. Replace userImageDisplay src placeholder URL with base64 image preload.
2. Keep alt text and presence indicator logic unchanged.

Reference commit:
- f048e1f

### Pattern D: Hide loading bars/spinners (JMS-180, BPS-226)
Purpose:
- Remove noisy loading artifacts from themed pages

Implementation file:
- src/css/digitalworkplace.custom.css

What was implemented:
1. Suppress spinner pseudo-element visuals for loading panels/widget loaders.
2. Suppress loading-state wrappers where needed.
3. Keep page-edit-mode-specific behavior exceptions.
4. Keep loading overlay transparent in normal mode.

Reference commit:
- 87ad6f9

### Pattern E: Build-time minification workflow (JMSMUC-187)
Purpose:
- Ensure deployable custom assets are minified without manual edits

Implementation files:
- package.json
- scripts/minify.js

What was implemented:
1. Add npm scripts:
   - build:minify
   - minify
2. Add dependencies:
   - terser
   - clean-css
3. Minify output assets:
   - build/sitedefinitions/Client/CDNAssets/js/digitalworkplace.custom.js
   - build/sitedefinitions/Client/CDNAssets/css/digitalworkplace.custom.css
4. Log original/minified sizes and savings.

Reference commit:
- aa2a700

### Pattern F: Spotlight detail fallback callback (JMSMUC-179 usage request)
Purpose:
- Ensure Employee Spotlight detail always has a valid profile image and normalized fields

Implementation file:
- src/js/library/digitalworkplace.custom.js

What was implemented:
1. SmuckersSpotlightItemDetailCallback resolves image by priority:
   - ImageUrl
   - FeaturedPerson_userPhoto
   - derived user picture URL from available email fields
   - base64Fallback as final fallback
2. Normalizes detail fields used by templates:
   - PublishDate, tagLabel/tagColor, DisplayName, Message
   - FeaturedPerson nested object compatibility mapping

## JMSMUC-171 note (requires branch/ticket confirmation)
Requested intent:
- Remove featuredlist property from top nav/footer quicklinks if featured content is not used.
- Create separate widget instances for TopNav and FooterLinks with new GUIDs.
- Update both delivery and department master pages to use those new IDs.

Current Smuckers source observation:
- The repository currently exposes a TopNav QuickLinks instance in src/js/widgets/QuickLinksWidget/config/config.json.
- Master pages reference distinct widget IDs for TopNav and FooterLinks.
- A definitive JMSMUC-171-tagged commit was not found in this branch history.

Action before rollout:
- Confirm final source branch/commit where JMSMUC-171 was completed.
- Then replicate exact instance/property configuration from that source.

## Rollout checklist for a new site branch
1. Identify target theme class and master page files.
2. Port Pattern A CSS/JS hardening with selectors adjusted to target theme.
3. Port Pattern B lazy loading block and verify no duplicate initialization.
4. Port Pattern C profile preload base64 in master pages.
5. Port Pattern D loading-spinner CSS policy.
6. Port Pattern F spotlight detail callback if Employee Spotlight is present.
7. Add Pattern E minification scripts and dependencies.
8. Build and run minify.
9. Validate in browser:
   - no repeated image requests on scroll
   - below-the-fold images lazy load correctly
   - no spinner artifacts in view mode
   - spotlight detail always shows an image
10. Commit each pattern separately (small, traceable commits).

## Validation commands (example)
- npm run build
- npm run minify

## Handoff output expected
For each new site rollout, produce:
1. Mapping table: ticket-pattern -> changed files
2. Exact commit list
3. Validation evidence (screenshots/network behavior summary)
4. Risks and follow-up items
