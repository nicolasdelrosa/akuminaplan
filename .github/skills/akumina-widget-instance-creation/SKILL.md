---
name: akumina-widget-instance-creation
description: "Complete guide for creating new Akumina widget instances including folder structure, config.json setup, JavaScript class patterns, and build configuration. Use when creating new widgets or troubleshooting widget build failures."
---

# Akumina Widget Instance Creation

Use this skill when creating new Akumina widgets from scratch, fixing widget structure issues, or understanding project-specific widget conventions.

## When To Use

- User asks to create a new widget
- User encounters widget build failures with "Entry module not found" errors
- User asks about correct widget folder structure
- User needs to understand widget config.json format
- User asks about widget JavaScript class patterns
- User encounters webpack configuration issues with widgets
- User needs to migrate widgets between projects with different structures

## Critical: Project-Specific Widget Structures

**WARNING**: Widget folder structures vary by project. ALWAYS check the existing project structure before creating new widgets.

### Standard Akumina Structure (Most Client Projects)

```
src/js/widgets/MyWidget/
├── config/
│   └── config.json
├── js/
│   └── widgets/
│       └── MyWidget.js    ← Widget file in /widgets/ subfolder
└── views/
    └── default.html
```

**Webpack Entry Path**: `./src/js/widgets/MyWidget/js/widgets/MyWidget.js`

### Alternative Structure (Some Legacy Projects)

```
src/js/widgets/MyWidget/
├── config/
│   └── config.json
├── js/
│   └── MyWidget.js        ← Widget file directly in /js/
└── views/
    └── default.html
```

**Webpack Entry Path**: `./src/js/widgets/MyWidget/js/MyWidget.js`

### How to Determine Project Structure

**BEFORE creating a new widget**, run this check:

```powershell
Get-ChildItem "src/js/widgets" -Directory | ForEach-Object {
    $widgetName = $_.Name
    $hasSubfolder = Test-Path "src/js/widgets/$widgetName/js/widgets/$widgetName.js"
    $hasDirect = Test-Path "src/js/widgets/$widgetName/js/$widgetName.js"
    
    [PSCustomObject]@{
        Widget = $widgetName
        UsesSubfolder = $hasSubfolder
        DirectInJs = $hasDirect
    }
} | Select-Object -First 3 | Format-Table -AutoSize
```

**Create new widgets matching the existing pattern** in the project.

## Webpack Configuration Check

Widget entry paths are defined in `webpack.config.js`. Look for this pattern:

```javascript
var genWidgetsConfig = function (widgetName) {
    return {
        name: "core",
        entry: widgetSrcDir + '/' + widgetName + '/js/widgets/' + widgetName + ext,
        // OR
        entry: widgetSrcDir + '/' + widgetName + '/js/' + widgetName + ext,
        // ...
    };
};
```

The `entry` path determines where webpack looks for widget files. **New widgets must match this path exactly**.

### Common Build Error: Entry Module Not Found

**Error Pattern**:
```
ERROR in Entry module not found: Error: Can't resolve
'./src/js/widgets/MyWidget/js/widgets/MyWidget.js' in 'C:\Git\Project\main'
```

**Root Cause**: Widget file location doesn't match webpack entry path.

**Fix**:
1. Check webpack.config.js for the entry path pattern
2. Verify existing widgets use the same structure
3. Move widget file to match the expected path
4. Ensure no extra nested folders exist

**DO NOT modify webpack.config.js** unless you're intentionally changing the entire project's widget structure pattern.

## Widget JavaScript File Patterns

### Minimal Widget (Placeholder for Custom Views Only)

For widgets that only use custom views and callbacks without custom JavaScript, create an **empty or minimal placeholder** file:

```javascript
// src/js/widgets/MyWidget/js/widgets/MyWidget.js
// Placeholder for widget builder - widget uses custom views and callbacks only
```

**Why Required**: The `akumina-widget-builder` package tool requires the `.js` file to exist even if it's empty. Build will fail without this file.

**Common Use Case**: Widgets with `partialdefinition: true` that extend core widget functionality via templates and instance configuration only.

### Full Widget Implementation Pattern

For widgets with custom logic:

```javascript
var MyWidget = function () {
    var _cur = this;
    
    // Property helper to extract values from widget properties
    this.GetPropertyValue = function (requestIn, key, defaultValue) {
        var propertyValue = "";
        for (var prop in requestIn) {
            if (key.toLowerCase() == prop.toLowerCase()) {
                propertyValue = requestIn[prop];
                break;
            }
        }
        return (propertyValue == undefined || propertyValue.toString().trim() == "") 
            ? defaultValue 
            : propertyValue;
    };
    
    // Set default property values
    this.SetDefaultsProperties = function (requestIn) {
        var requestOut = requestIn;
        requestOut.SenderId = _cur.GetPropertyValue(requestIn, "id", "");
        requestOut.DisplayTemplateUrl = _cur.GetPropertyValue(requestIn, "displaytemplateurl", "");
        // Add widget-specific properties here
        requestOut.PageSize = _cur.GetPropertyValue(requestIn, "pagesize", "10");
        return requestOut;
    };
    
    // Main entry point called by Akumina framework
    this.Init = function (properties) {
        _cur.properties = _cur.SetDefaultsProperties(properties);
        _cur.properties.EditMode = Akumina.AddIn.Utilities.getEditMode();
        _cur.Prerender();
    };
    
    // Subscribe to framework events
    this.Prerender = function () {
        var targetDiv = _cur.properties.SenderId;
        $("#" + targetDiv).html(Akumina.Digispace.ConfigurationContext.LoadingTemplateHtml);
        
        // Wait for page loader to complete
        Akumina.Digispace.AppPart.Eventing.Subscribe(
            '/loader/completed/', 
            _cur.Render, 
            _cur.properties.SenderId
        );
        
        // Handle widget refresh from Widget Manager
        Akumina.Digispace.AppPart.Eventing.Subscribe(
            '/widget/updated/', 
            _cur.RefreshWidget, 
            _cur.properties.SenderId
        );
    };
    
    // Fetch data and render template
    this.Render = function () {
        var request = {
            listName: "YourList_AK",
            selectFields: "Title,Author,Created",
            isRoot: true
        };
        
        var dataFactory = new Akumina.Digispace.Data.DataFactory();
        dataFactory.GetList(request).then(function (data) {
            _cur.BindTemplate(_cur.properties.DisplayTemplateUrl, data.response, targetDiv);
        }).catch(function (error) {
            console.error("MyWidget: Error fetching data", error);
        });
    };
    
    // Bind data to Handlebars template
    this.BindTemplate = function (templateUrl, data, targetDiv) {
        Akumina.Digispace.AppPart.Data.Templates.ParseTemplate(templateUrl, data)
            .then(function (html) {
                $("#" + targetDiv).html(html);
            });
    };
    
    // Handle widget refresh event
    this.RefreshWidget = function (updatedProperties) {
        _cur.Init(updatedProperties);
    };
};

// Register widget class with Akumina namespace
if (typeof Akumina.AddIn === 'undefined') {
    Akumina.AddIn = {};
}
Akumina.AddIn.MyWidget = MyWidget;
```

**Key Components**:
- `Init()` - Framework entry point (REQUIRED)
- `GetPropertyValue()` - Helper for property extraction
- `SetDefaultsProperties()` - Property defaults and validation
- `Prerender()` - Event subscription and loading state
- `Render()` - Data fetching and template binding
- Namespace registration - Makes widget discoverable by framework

## config.json Structure

### Complete Widget Definition

```json
{
  "Definition": {
    "Name": "MyWidget",
    "Class": "Client.Widgets.MyWidget",
    "Version": "1.0.0",
    "Dependencies": [],
    "Views": [
      {
        "Name": "default",
        "Path": "/{AssetLibraryName}/digitalworkplace/content/templates/mywidget/default.html",
        "Id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d"
      }
    ],
    "JS": {
      "Default": "/{AssetLibraryName}/digitalworkplace/js/widgets/MyWidget.js"
    }
  },
  "Instances": [
    {
      "Name": "MyWidget Default Instance",
      "Id": "f1e2d3c4-b5a6-4978-9c8b-7a6e5d4c3b2a",
      "partialdefinition": true,
      "SelectedView": "default",
      "Properties": [
        {
          "name": "displaytemplateurl",
          "value": "{AssetsUrlDev}/digitalworkplace/content/templates/mywidget/default.html"
        },
        {
          "name": "pagesize",
          "value": "10"
        },
        {
          "name": "selectfields",
          "value": "Title,Author,Created,Modified"
        }
      ]
    }
  ],
  "Options": {
    "IsPartialDefinition": true,
    "IsDashboardWidget": false,
    "IsAppManagerWidget": false
  }
}
```

### Critical config.json Fields

**Definition Section**:
- `Name` - Widget identifier (must match folder name)
- `Class` - Full namespace path (e.g., `Client.Widgets.MyWidget` or `Akumina.AddIn.MyWidget`)
- `Views.Name` - View identifier used in `SelectedView`
- `Views.Path` - Template deployment path (uses `{AssetLibraryName}` token)
- `Views.Id` - Unique GUID (generate new for each view)
- `JS.Default` - JavaScript bundle path

**Instances Section**:
- `Name` - Instance display name (shown in AppManager/Widget Manager)
- `Id` - Unique GUID (generate new for each instance)
- `partialdefinition` - Usually `true` for client widgets
- `SelectedView` - MUST match a `Views.Name` value exactly (case-sensitive)
- `Properties[]` - Instance-specific configuration values

**Options Section**:
- `IsPartialDefinition` - Usually `true` for client customizations
- `IsDashboardWidget` - Set to `true` if widget appears in dashboard layouts
- `IsAppManagerWidget` - Set to `true` if widget is AppManager-specific

### Generating GUIDs

For `Id` values, generate new GUIDs:

```powershell
# PowerShell
[guid]::NewGuid().ToString()

# Output: 2c8f4a6b-7d3e-4c92-a1b5-9f8e3d6c2b4a
```

**NEVER reuse IDs** from other widgets or instances - each must be unique.

### Class Naming Conventions

**Project-Specific Namespace**:
- Check existing widgets in the project for the namespace pattern
- Common patterns:
  - `Client.Widgets.WidgetName` (when jsClientName = "Client")
  - `Akumina.AddIn.WidgetName` (standard Akumina namespace)
  - `{ProjectName}.Widgets.WidgetName` (custom project namespace)

**Where jsClientName is defined**:
Look in `webpack.config.js`:
```javascript
var jsClientName = "Client"; // This determines the namespace prefix
```

The full class path becomes: `{jsClientName}.Widgets.{WidgetName}`

## Widget Views and Templates

### View Location Options

**1. Widget Package Source** (RECOMMENDED for client customizations):
```
src/js/widgets/MyWidget/views/default.html
```
- Deployed via widget packaging
- Version controlled with widget code
- Follows skill: akumina-widget-custom-view patterns

**2. Content Templates Source** (legacy pattern, avoid for new widgets):
```
src/content/templates/mywidget/default.html
```
- Deployed separately from widget
- Can cause deployment sync issues

**BEST PRACTICE**: Use widget package `views/` folder for all custom views.

### View Path Configuration

In `config.json`, the `Path` uses deployment token:

```json
"Path": "/{AssetLibraryName}/digitalworkplace/content/templates/mywidget/default.html"
```

The `{AssetLibraryName}` token is replaced during deployment with the actual SharePoint asset library name.

### Template Data Binding

Templates use Handlebars syntax:

```html
{{#if Items}}
  {{#each Items}}
    <div class="item">
      <h3>{{Title}}</h3>
      <p>{{Description}}</p>
      <a href="{{Url}}">View Details</a>
    </div>
  {{/each}}
{{else}}
  <p>No items found</p>
{{/if}}
```

**Data Context**: The `data` object passed to `BindTemplate()` becomes the template's root context.

## Build Process Integration

### package.json Dependencies

Ensure these packages are present:

```json
{
  "devDependencies": {
    "webpack": "^4.46.0",
    "webpack-cli": "^3.3.12",
    "cross-env": "^7.0.3",
    "terser": "^5.44.0"
  },
  "dependencies": {
    "akumina-widget-builder": "^2.0.5"
  }
}
```

**cross-env**: Required for Azure DevOps pipelines to set NODE_OPTIONS across platforms

### Build Scripts

Standard npm scripts for widget development:

```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--openssl-legacy-provider webpack --config webpack.config.js",
    "build:minify": "npm run build && node scripts/minify.js",
    "package": "akumina-widget-builder package",
    "deploy": "node ./tools/deploy.js",
    "all": "npm run clean & npm run build:minify & npm run package & npm run deploy"
  }
}
```

### Widget Packaging

The `akumina-widget-builder` tool:
1. Reads `config/config.json` from each widget folder
2. Bundles `.js` files from webpack output
3. Packages views, definitions, and instances
4. Creates deployment-ready `.zip` files

**Output Location**: `packages/{WidgetName}.zip`

## Common Pitfalls and Solutions

### 1. Wrong Folder Structure

**Symptom**: Build fails with "Entry module not found"

**Cause**: Widget file location doesn't match webpack entry path

**Solution**: 
- Check existing widgets for structure pattern
- Verify webpack.config.js entry path
- Create widget matching the project's pattern exactly

### 2. Missing Placeholder .js File

**Symptom**: Widget packaging fails even though you only need custom views

**Cause**: `akumina-widget-builder` requires `.js` file to exist

**Solution**: Create empty placeholder file at correct path with comment explaining it's a placeholder

### 3. SelectedView Mismatch

**Symptom**: Widget shows blank or default view instead of custom view

**Cause**: `SelectedView` value doesn't match `Views.Name` exactly

**Solution**: Ensure exact case-sensitive match:
```json
"Views": [{"Name": "Custom View", ...}],
"Instances": [{"SelectedView": "Custom View", ...}]  // ← Must match exactly
```

### 4. Duplicate Widget Instances on Deployment

**Symptom**: Same widget instance appears multiple times after deployment

**Cause**: Instance `Id` conflicts or `partialdefinition` not set correctly

**Solution**: 
- Generate unique GUID for each instance
- Set `partialdefinition: true` for client-specific instances
- Review deployment logs for "duplicate instance" warnings

### 5. Class Namespace Not Found

**Symptom**: Widget doesn't initialize, console error "Class not found"

**Cause**: Mismatch between `Class` in config.json and actual JavaScript namespace registration

**Solution**: Verify match:
```json
// config.json
"Class": "Client.Widgets.MyWidget"
```
```javascript
// MyWidget.js
Akumina.AddIn.MyWidget = MyWidget;  // ← Must match namespace prefix
```

## Integration with Other Akumina Skills

### Custom Views and Callbacks
Once the widget structure is created, use **akumina-widget-custom-view** skill for:
- Adding custom view templates
- Wiring callback methods
- Understanding callback timing
- Implementing Handlebars helpers

### Performance Optimization
After widget creation, apply **performance-menu** skill patterns:
- Empty unused properties (e.g., `featuredlist`)
- Optimize API calls
- Minimize selectfields to only required columns

### Deployment
For production deployment, combine with **create-runbook** skill:
- Document widget customizations
- Include deployment steps
- Note instance configurations
- Capture rollback procedures

## Complete Widget Creation Workflow

1. **Check Project Structure**
   - Audit existing widgets to determine folder pattern
   - Verify webpack entry path configuration
   - Identify jsClientName for namespace

2. **Create Folder Structure**
   ```powershell
   $widget = "MyWidget"
   New-Item -ItemType Directory -Path "src/js/widgets/$widget/config"
   New-Item -ItemType Directory -Path "src/js/widgets/$widget/js/widgets"  # or /js/ directly
   New-Item -ItemType Directory -Path "src/js/widgets/$widget/views"
   ```

3. **Create JavaScript File**
   - Use placeholder for view-only widgets
   - Implement full pattern for custom logic widgets
   - Register in correct namespace

4. **Create config.json**
   - Generate new GUIDs for Ids
   - Configure views and paths
   - Define instances with properties
   - Set correct Class namespace

5. **Create Views**
   - Add default.html in views/ folder
   - Use Handlebars syntax for data binding
   - Test templates with sample data

6. **Build and Test**
   ```powershell
   npm run build:minify
   npm run package
   ```
   - Verify no webpack errors
   - Check packages/ output contains widget .zip

7. **Deploy and Verify**
   - Deploy to DEV environment
   - Verify widget appears in Widget Manager
   - Test instance configuration updates
   - Validate view rendering

## Quick Reference

| Task | Command/Location |
|------|------------------|
| Check widget structure | `Get-ChildItem src/js/widgets -Directory` |
| Generate GUID | `[guid]::NewGuid().ToString()` |
| Build widgets | `npm run build:minify` |
| Package widgets | `npm run package` |
| View webpack entry path | Check `webpack.config.js` line ~181 |
| Check jsClientName | `webpack.config.js` var declaration |
| Widget packages output | `packages/{WidgetName}.zip` |
| Build output | `dist/widgets/{WidgetName}.js` |

## Related Skills

- **akumina-widget-custom-view**: Custom views, callbacks, Handlebars helpers
- **performance-menu**: Widget performance optimization patterns
- **create-runbook**: Deployment documentation for widgets

---

**Created**: April 15, 2026  
**Last Updated**: April 15, 2026  
**Maintainer**: Coding Agent Learning System
