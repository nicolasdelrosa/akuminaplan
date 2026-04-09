---
name: akumina-widget-custom-view
description: "Create or update Akumina widget custom views and instance config safely. Use when adding a new widget view, wiring a callback, or deploying widget instance updates across client projects."
---

# Akumina Widget Custom View

Use this skill when a project needs a custom widget view and callback behavior that must deploy reliably through widget packaging.

## When To Use

- User asks to add a custom view/template for an existing widget.
- User asks to wire a callback method in widget instance config.
- User asks to make a widget instance deploy-safe without creating duplicate instances.
- User asks to modify widget data at template-render time (Handlebars helpers).
- User needs to understand widget callback timing and architecture.

## Standard Source Layout (CRITICAL)

For widget `XWidget`, the COMPLETE required structure is:

```
src/js/widgets/XWidget/
├── config/
│   └── config.json          # Widget definition, views, instances
├── js/
│   └── widgets/
│       └── XWidget.js       # REQUIRED placeholder (can be empty)
├── views/
│   └── custom-view.html     # Custom template files
└── README.md                # Documentation (optional)
```

**BUILD REQUIREMENT**: The `js/widgets/XWidget.js` file is REQUIRED by akumina-widget-builder even if empty. Build will fail without this file structure.

**Common Pattern**: Most client widgets use `partialdefinition: true` and have empty .js files because they extend core widget functionality via custom views and callbacks only.

Do not place new widget view source files under `src/content/templates/...`.

## Widget Architecture Understanding

### Callback Timing (Critical for Implementation Decisions)

Widget callbacks execute in this order:
1. **Render()** - Widget initializes and fetches data
2. **callbackmethod** - User callback runs (line ~424-432 in typical widgets)
3. **Success()** - Widget processes data and adds URL parameters
4. **Template rendering** - Handlebars processes template with final data

**Key Insight**: If widget modifies data in Success() (e.g., adding `?web=1` to URLs at line 790), callbacks run TOO EARLY to intercept that change.

### Pattern Decision Matrix

| Use Case | Solution | When to Use |
|----------|----------|-------------|
| Modify data BEFORE widget processing | `callbackmethod` property | Need to transform raw data from API |
| Modify data AFTER widget processing | Handlebars helper in template | Widget adds parameters/transforms data in Success() |
| Add UI interactivity | Custom view + callback | Need both data transformation and event handlers |
| Check for GenericSearchWidget | Inspect widget inheritance | Need `uiCallbackMethod` (post-render callback) |

### GenericSearchWidget Inheritance Check

Before planning callback approach, check if widget inherits from GenericSearchWidget:
- If YES: Can use `uiCallbackMethod` for post-render callbacks
- If NO: Limited to `callbackmethod` (pre-Success timing) or Handlebars helpers

**How to check**: Search widget source in Core for `GenericSearchWidget` references.

## Handlebars Helper Pattern (Template-Level Processing)

When widget modifies data in Success() that you need to reverse/transform:

1. **Register helper in `digitalworkplace.custom.js`**:
```javascript
Handlebars.registerHelper('cleanPdfUrl', function (url) {
    if (!url || typeof url !== 'string') {
        return url;
    }
    // Check condition and transform
    const isPdf = url.toLowerCase().indexOf('.pdf') !== -1;
    if (isPdf && url.indexOf('?web=1') !== -1) {
        return url.replace('?web=1', '');
    }
    return url;
});
```

2. **Apply in custom view template**:
```html
<a href="{{cleanPdfUrl Url}}">{{Title}}</a>
<div data-url="{{cleanPdfUrl ../Url}}">...</div>
```

**Critical**: Helper must be registered before any widget templates render. Place in file loaded early in page load sequence.

## config.json Structure

### Complete Widget Definition with Custom View

```json
{
  "Definition": {
    "Name": "XWidget",
    "Class": "Akumina.AddIn.XWidget",
    "Version": "6.2.2405.1310",
    "Dependencies": [],
    "Views": [
      {
        "Name": "default",
        "Path": "/{AssetLibraryName}/digitalworkplace/content/templates/xwidget/default.html",
        "Id": "003e3539-ec3a-4992-abe6-e6b8a5497016"
      },
      {
        "Name": "Custom Client View",
        "Path": "/{AssetLibraryName}/digitalworkplace/content/templates/xwidget/client-custom.html",
        "Id": "a7f3c8d9-4b2e-4f91-9c6a-8e5d71b3f2a4"
      }
    ],
    "JS": {
      "Default": "/{AssetLibraryName}/digitalworkplace/js/widgets/xwidget.min.js"
    }
  },
  "Instances": [
    {
      "Name": "Client Custom Instance",
      "Id": "2c8f4a6b-7d3e-4c92-a1b5-9f8e3d6c2b4a",
      "IsPartialDefinition": true,
      "SelectedView": "a7f3c8d9-4b2e-4f91-9c6a-8e5d71b3f2a4",  // ← REQUIRED: must match view Id
      "Properties": {
        "callbackmethod": "CustomCallback",
        "pagesize": 25,
        "selectfields": "Title,Path,Author,...",
        "displayfields": [
          {"name": "Title", "colspan": "large-5", "defaultsort": "true"},
          {"name": "Author", "colspan": "large-3"}
        ]
      }
    }
  ]
}
```

Important:
- `Path` in Views points to CDN destination (build deploys view from `views/` to this location)
- `Id` for view must be unique GUID
- `IsPartialDefinition: true` prevents replacing entire widget definition
- **`SelectedView` property is REQUIRED** - must match view `Id` from Definition.Views
- **CRITICAL**: Missing `SelectedView` causes packaging failure with "Cannot read properties of undefined (reading 'toLowerCase')" error

### JSON Validation Methods

Before committing config.json, validate syntax:

**PowerShell**:
```powershell
Get-Content config.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Node.js**:
```javascript
const config = require('./config.json');
console.log('Valid JSON');
```

**VS Code**: Open file, check for syntax errors in Problems panel.

## Instance Deployment Rule (Critical)

When updating an instance already rendered in master pages or virtual pages:

1. **Find the existing widget instance ID** used on pages:
   - Check page source or AppManager for current instance GUID
   - Export page widget configuration if needed

2. **Reuse that same `Id`** in `config/config.json` under `Instances`:
   - DO NOT generate new instance ID
   - Match existing ID exactly to update in-place

3. **Match existing properties** from page widget:
   - Copy `pagesize`, `selectfields`, `displayfields`, `refiners`, etc.
   - Only change properties needed for new functionality
   - Use `IsPartialDefinition: true` to merge with existing config

**WHY**: Creating new instance ID causes duplicate widget instances in AppManager. Pages reference widgets by instance ID, so reusing ID updates existing widgets cleanly.

### Property Matching Workflow

When page already has widget configured:

1. **Export current widget properties** (from page or AppManager)
2. **Copy to new config.json instance**
3. **Add only new property changes** (callbackmethod, SelectedView, etc.)
4. **Set `IsPartialDefinition: true`**
5. **Deploy** - AppManager merges new properties into existing instance

Example - if page widget has:
```json
{
  "pagesize": 25,
  "selectfields": "Title,Path,Author",
  "displayfields": [{"name": "Title", "colspan": "large-5"}]
}
```

Your new instance MUST include these same properties plus your changes:
```json
{
  "Id": "<existing-page-widget-id>",
  "IsPartialDefinition": true,
  "SelectedView": "<new-view-id>",
  "Properties": {
    "callbackmethod": "NewCallback",
    "pagesize": 25,
    "selectfields": "Title,Path,Author",
    "displayfields": [{"name": "Title", "colspan": "large-5"}]
  }
}
```

## Complete Workflow: Creating Custom Widget View

### Step 1: Create Directory Structure

```powershell
# If widget folders don't exist
New-Item -ItemType Directory -Path "src/js/widgets/XWidget/config" -Force
New-Item -ItemType Directory -Path "src/js/widgets/XWidget/js/widgets" -Force
New-Item -ItemType Directory -Path "src/js/widgets/XWidget/views" -Force

# Create required placeholder file (can be empty)
New-Item -ItemType File -Path "src/js/widgets/XWidget/js/widgets/XWidget.js" -Force
```

### Step 2: Create Custom View Template

File: `src/js/widgets/XWidget/views/client-custom.html`

- Copy default widget view as starting point
- Apply Handlebars helpers where needed: `{{helperName propertyName}}`
- Test template syntax (no unclosed tags, proper Handlebars syntax)

### Step 3: Register Handlebars Helpers (if needed)

File: `src/js/library/digitalworkplace.custom.js` or equivalent

```javascript
Handlebars.registerHelper('helperName', function(value) {
    // Transform value
    return transformedValue;
});
```

Place before widget initialization code.

### Step 4: Create/Update config.json

File: `src/js/widgets/XWidget/config/config.json`

1. Add new view to `Definition.Views` with unique GUID
2. Add/update instance in `Instances`:
   - Use existing page instance ID if updating
   - Set `IsPartialDefinition: true`
   - **Set `SelectedView` to new view ID (REQUIRED - always include this)**
   - Copy existing properties + add changes
3. Validate JSON syntax (see validation methods above)

**Critical**: The `SelectedView` property is MANDATORY when using custom views. Omitting it causes packaging to fail with "Cannot read properties of undefined (reading 'toLowerCase')" error.

### Step 5: Build and Package

```powershell
npm run clean
npm run build:minify
npm run package
```

Verify output:
- `dist/{WidgetName}.zip` created
- Contains `views/`, `js/`, `config.json`
- No build errors about missing files

### Step 6: Deploy to Environment

```powershell
npm run deploy
# Or: npm run all (combines clean, build, package, deploy)
```

Verify in AppManager:
- Widget definition has new view
- Instance exists with correct ID
- Properties match expectation

### Step 7: Add to Page & Test

1. **If new widget**: Add widget instance to page using instance ID
2. **If updating existing**: Widget auto-updates on page (same instance ID)
3. Test functionality:
   - Data displays correctly
   - Callbacks execute
   - URLs/links work as expected
   - No console errors

## Breadcrumb Cross-Site Navigation Rule

If the breadcrumb Home link must navigate cross-site:

- Do not rely on SPA helpers that rewrite routes for cross-site links.
- In the custom breadcrumb template, use plain anchor href and `data-interception="off"`.

Example:

```html
<a href="{{route}}" data-interception="off">{{name}}</a>
```

## Callback Wiring Checklist

- Add callback function in client custom JS (`digitalworkplace.custom.js` or equivalent).
- Set instance property `callbackmethod` to that function name (lowercase property name).
- **Set `SelectedView` property to the new custom view ID (REQUIRED - packaging will fail without it)**.
- Keep `IsPartialDefinition: true` unless the project explicitly needs full definition replacement.
- **Understand callback timing**: Runs BEFORE Success(), cannot modify Success() transformations.

## Validation Checklist

Before deployment:
- [ ] Build succeeds (`npm run build:minify`)
- [ ] Package succeeds (`npm run package`)
- [ ] Widget structure includes `js/widgets/{WidgetName}.js` file (even if empty)
- [ ] config.json is valid JSON (test with validation methods)
- [ ] **Instance has `SelectedView` property set (REQUIRED for custom views)**
- [ ] View ID in instance `SelectedView` matches view ID in `Definition.Views`
- [ ] Instance ID matches existing page widget ID (if updating)
- [ ] All existing widget properties preserved in new config

After deployment:
- [ ] Widget package includes the view under the widget package `views` folder
- [ ] Deployed instance ID matches the page-rendered widget ID
- [ ] Callback executes (if configured)
- [ ] Handlebars helpers execute and transform data correctly
- [ ] Routes/URLs resolve as expected
- [ ] No console errors in browser

## Troubleshooting

### Build Fails: "Cannot find widget file"

**Cause**: Missing `js/widgets/{WidgetName}.js` placeholder file.

**Fix**: Create empty file at `src/js/widgets/{WidgetName}/js/widgets/{WidgetName}.js`

### Widget Shows Old View After Deployment

**Causes**:
1. Instance `SelectedView` doesn't match new view ID
2. Cache not cleared
3. Deployed to wrong environment

**Fix**:
1. Verify `SelectedView` value matches view `Id` in Definition.Views
2. Clear browser cache / hard refresh
3. Check deployment logs for correct environment

### Callback Not Executing

**Causes**:
1. Property name wrong (use `callbackmethod` lowercase, not `callbackMethod`)
2. Function not defined before widget loads
3. Widget doesn't support callbacks (core architecture limitation)

**Fix**:
1. Check property name spelling in config.json
2. Verify function exists in `digitalworkplace.custom.js`
3. Use Handlebars helper instead if callback timing doesn't work

### Handlebars Helper Not Working

**Causes**:
1. Helper not registered before template renders
2. Helper name misspelled in template
3. Helper function has error

**Fix**:
1. Move helper registration to file loaded early (digitalworkplace.custom.js)
2. Check spelling: `{{helperName value}}` matches `Handlebars.registerHelper('helperName', ...)`
3. Add console.log in helper to debug values and execution

### Duplicate Widget Instances in AppManager

**Cause**: Created new instance ID instead of reusing existing page widget ID.

**Fix**:
1. Find correct instance ID from page
2. Update config.json to use that ID

### Packaging Fails: "Cannot read properties of undefined (reading 'toLowerCase')"

**Cause**: Widget instance is missing the `SelectedView` property when using custom views.

**Error Example**:
```
TypeError: Cannot read properties of undefined (reading 'toLowerCase')
    at C:\...\node_modules\akumina-widget-builder\lib\awb.js:9:169272
```

**Fix**:
1. Add `SelectedView` property to the instance in config.json
2. Set value to the custom view's `Id` from `Definition.Views` array
3. Re-run `npm run package`

**Example**:
```json
{
  "Instances": [
    {
      "Name": "My Custom Instance",
      "Id": "2c8f4a6b-7d3e-4c92-a1b5-9f8e3d6c2b4a",
      "partialdefinition": true,
      "SelectedView": "a7f3c8d9-4b2e-4f91-9c6a-8e5d71b3f2a4",  // ← REQUIRED
      "Properties": { ... }
    }
  ]
}
```

**Root Cause**: The Akumina widget packager expects `SelectedView` to reference which template the instance uses. Without it, the packager tries to call `.toLowerCase()` on undefined during view name processing.
3. Redeploy (old duplicate may need manual cleanup)

## Real-World Example: DocumentViewerWidget PDF Download Fix

**Problem**: Widget adds `?web=1` to PDF URLs, causing inline preview instead of download.

**Investigation**:
1. Checked widget source - adds `?web=1` at line 790 in Success()
2. Tested callback approach - runs too early (line 424-432, before Success())
3. Checked for GenericSearchWidget inheritance - widget doesn't inherit
4. Concluded: Need template-level processing

**Solution**:
1. Created Handlebars helper `cleanPdfUrl` in digitalworkplace.custom.js
2. Created custom view applying helper to all URL references
3. Created instance with `IsPartialDefinition: true` and existing properties
4. **Added required `SelectedView` property** pointing to new custom view (UFA-333 fix)
5. Added required `js/widgets/DocumentViewerWidget.js` placeholder for build
6. Deployed successfully

**Code**:
```javascript
// digitalworkplace.custom.js
Handlebars.registerHelper('cleanPdfUrl', function (url) {
    if (!url || typeof url !== 'string') return url;
    const isPdf = url.toLowerCase().indexOf('.pdf') !== -1;
    if (isPdf && url.indexOf('?web=1') !== -1) {
        return url.replace('?web=1', '');
    }
    return url;
});
```

**Template** (ufa-documentviewer.html):
```html
<a href="{{cleanPdfUrl Url}}">{{Title}}</a>
<div data-url="{{cleanPdfUrl ../Url}}">Preview</div>
```

**Key Lesson**: Widget architecture determines solution approach. Callbacks can't fix Success() transformations - use Handlebars helpers instead.
