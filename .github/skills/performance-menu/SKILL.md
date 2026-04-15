---
name: performance-menu
description: "Optimize QuickLinksWidget instances for performance by ensuring featuredlist property is empty when featured content is not used. Apply this pattern to TopMenu and Footer menu instances across client projects."
---

# Performance Menu Optimization

Use this skill when implementing performance optimization for menu widgets (QuickLinksWidget) by removing or clearing the `featuredlist` property when featured content is not utilized.

## When To Use

- User asks to optimize menu performance for QuickLinksWidget
- Performance tuning tasks require menu widget optimization
- Featured content is not being used in navigation menus
- Following performance checklist for client deployments
- Implementing CS-20 pattern across projects

## Performance Impact

**Problem**: When `featuredlist` property contains a value (even if the list doesn't exist), QuickLinksWidget makes an additional API call to fetch featured content data. This increases page load time unnecessarily when featured content is not being displayed.

**Solution**: Explicitly set `featuredlist` to empty string (`""`) to prevent the widget from making the extra API request.

## Standard Implementation Pattern

### Widget Instances to Check

For optimal performance, ensure these QuickLinksWidget instances have empty `featuredlist` values:

1. **TopMegaMenuBar** (or similar top navigation instance)
2. **FooterMenuNavLinks** (or similar footer menu instance)

### Configuration Location

`src/js/widgets/QuickLinksWidget/config/config.json`

### Required Property Addition

For each menu widget instance that doesn't use featured content, ensure the `featuredlist` property exists and is set to empty:

```json
{
  "Instances": [
    {
      "Name": "TopMegaMenuBar",
      "Properties": [
        {
          "name": "listname",
          "value": "FoundationTopNavigation_AK"
        },
        {
          "name": "featuredlist",
          "value": ""
        },
        {
          "name": "isroot",
          "value": true
        }
        // ... other properties
      ]
    },
    {
      "Name": "FooterMenuNavLinks",
      "Properties": [
        {
          "name": "listname",
          "value": "FooterLinks_AK"
        },
        {
          "name": "featuredlist",
          "value": ""
        },
        {
          "name": "isroot",
          "value": true
        }
        // ... other properties
      ]
    }
  ]
}
```

## Implementation Workflow

### Step 1: Identify QuickLinksWidget Instances

Search for QuickLinksWidget configuration in the project:
```
{PROJECT_ROOT}/main/src/js/widgets/QuickLinksWidget/config/config.json
```

### Step 2: Check for Featured Content Usage

Review each instance's properties to determine if featured content is being used:
- Check if `featuredlist` property exists
- Check if `featuredlistselectfields` has meaningful values
- Verify with client/site if featured content panel is displayed in navigation

### Step 3: Add or Update Property

If featured content is NOT used:
1. Add `featuredlist` property if missing
2. Set value to empty string: `"value": ""`
3. Place property after `listname` and before `isroot` for consistency

### Step 4: Verify Other Performance Properties

While updating the configuration, also verify these performance-related properties:

- **cacheinterval**: Set to `-1` for infinite caching (reduces API calls)
- **lazyload**: Consider setting to `false` for critical navigation (improves perceived performance)
- **callbackmethod**: Should be empty if no custom processing is needed

## Common Patterns Across Projects

### UFA Pattern (Reference Implementation)
```json
{
  "name": "featuredlist",
  "value": ""
}
```

### City of Surrey Pattern (CS-20)
Added `featuredlist` property to both TopMegaMenuBar and FooterMenuNavLinks instances.

### Best Practices

1. **Consistency**: Apply the optimization to BOTH top menu and footer menu instances
2. **Explicit over Implicit**: Always add the property explicitly rather than relying on defaults
3. **Documentation**: Note the performance optimization in deployment release notes
4. **Verification**: After deployment, verify network requests to ensure featured list API call is eliminated

## Expected Performance Improvement

**Before Optimization:**
- 2 API calls per menu widget (list data + featured content)
- Additional ~100-300ms per menu load (depending on list size)

**After Optimization:**
- 1 API call per menu widget (list data only)
- Reduced initial page load time
- Lower server load

## Testing Verification

After implementing the change:

1. **Browser DevTools Network Tab:**
   - Filter by XHR/Fetch requests
   - Look for SharePoint list queries
   - Verify NO requests to featured content list
   - Should see only main navigation list requests

2. **Performance Metrics:**
   - Compare page load times before/after
   - Monitor Time to Interactive (TTI)
   - Check Largest Contentful Paint (LCP)

## Related Performance Optimizations

This optimization is typically part of a larger performance tuning effort. Consider these related optimizations:

- CDN implementation for static assets
- Widget lazy loading for below-the-fold content
- HTTP/2 or HTTP/3 protocol upgrades
- Image optimization and WebP conversion
- Minification and bundling
- Cache-Control headers optimization

## Cross-Project Application

This pattern has been validated and applied across:
- ✅ UFA (University of Florida Athletics)
- ✅ City of Surrey (CS-20)
- LA Courts (LAC)
- JM Smuckers (JMSMUC)
- Ball Corp (BCRS)
- WCB
- Pomerleau (POM)

## Troubleshooting

### Issue: Property Not Taking Effect

**Symptom**: Widget still makes featured content API call after setting `featuredlist` to empty.

**Solutions:**
1. Clear browser cache and AppManager cache
2. Verify widget package was deployed successfully
3. Check if widget instance on page has `partialdefinition: true`
4. Ensure config.json has `Options.IsPartialDefinition: true`

### Issue: Navigation Breaks After Change

**Symptom**: Menu items don't display or JavaScript errors occur.

**Solutions:**
1. Verify JSON syntax is correct (no trailing commas, proper quotes)
2. Check that `listname` property still points to correct SharePoint list
3. Ensure `isroot` property is set correctly for hierarchy
4. Review browser console for specific error messages

## Reference Implementation Files

- **Skill Definition**: `.github/skills/performance-menu/SKILL.md`
- **UFA Reference**: `c:\Git\UFA\UFA\main\src\js\widgets\QuickLinksWidget\config\config.json`
- **City of Surrey**: `c:\Git\CityOfSurrey\CityOfSurrey\project\main\src\js\widgets\QuickLinksWidget\config\config.json`
- **Widget Custom View Guide**: `.github/skills/akumina-widget-custom-view/SKILL.md`

## Integration with Other Skills

This skill works in conjunction with:
- **akumina-widget-custom-view**: For understanding widget instance configuration structure
- **performance-rollout-smuckers-patterns**: For broader performance optimization patterns
- **create-runbook**: For documenting performance changes in client runbooks

---

## Quick Reference Checklist

When implementing performance-menu optimization:

- [ ] Locate QuickLinksWidget config.json in project
- [ ] Identify TopMenu widget instance (usually TopMegaMenuBar)
- [ ] Identify Footer widget instance (usually FooterMenuNavLinks)
- [ ] Add `featuredlist` property with empty value to both instances
- [ ] Verify `cacheinterval` is set to `-1`
- [ ] Build and deploy widget package
- [ ] Test navigation functionality
- [ ] Verify API calls in browser DevTools
- [ ] Document changes in release notes
- [ ] Update project runbook with optimization notes
