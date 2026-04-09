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

## Standard Source Layout

For widget `XWidget`, use:

- `src/js/widgets/XWidget/config/config.json`
- `src/js/widgets/XWidget/js/widgets/XWidget.js`
- `src/js/widgets/XWidget/views/<view-file>.html`

Do not place new widget view source files under `src/content/templates/...`.

## View Path Rule In config.json

In `Definition.Views`, keep the CDN template path format:

```json
{
  "Name": "CustomViewName",
  "Path": "/{AssetLibraryName}/digitalworkplace/content/templates/xwidget/<view-file>.html",
  "Id": "<guid>"
}
```

Important:
- The `Path` points to CDN destination.
- The source file still lives under widget `views/`.

## Instance Deployment Rule (Critical)

When updating an instance already rendered in master pages or virtual pages:

1. Find the existing widget instance id used on pages (for example in master page markup).
2. Use that same `Id` in `config/config.json` under `Instances`.
3. Do not generate a new instance id unless a second instance is intentionally required.

This prevents creating orphaned duplicate instances in AppManager.

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
- Set instance property `callbackmethod` to that function name.
- Set `SelectedView` to the new custom view.
- Keep `IsPartialDefinition: true` unless the project explicitly needs full definition replacement.

## Validation Checklist

- Build succeeds.
- Widget package includes the view under the widget package `views` folder.
- Deployed instance id matches the page-rendered widget id.
- Callback executes and routes resolve as expected.
