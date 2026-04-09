import { test, expect } from '@playwright/test';

/**
 * UFA-283: Change --fs-widgets-bottom-spacing to 48px
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirement: Reduce bottom margin of widgets from 96px to 48px
 * CSS Variable: --fs-widgets-bottom-spacing
 */

test.describe('UFA-283 - Widget Spacing Adjustment', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should verify --fs-widgets-bottom-spacing is 48px', async ({ page }) => {
    // Check the CSS variable value on the root or body element
    const spacing = await page.evaluate(() => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue('--fs-widgets-bottom-spacing').trim();
    });
    
    // Should be 48px
    expect(spacing).toBe('48px');
  });

  test('should verify widgets have 48px bottom spacing', async ({ page }) => {
    // Find all widgets on the page
    const widgets = page.locator('.ak-widget, [class*="widget"], .widget-container').first();
    
    // Wait for at least one widget to be visible
    await expect(widgets).toBeVisible({ timeout: 10000 });
    
    // Get the computed margin-bottom or spacing
    const bottomSpacing = await widgets.evaluate(el => {
      const styles = getComputedStyle(el);
      return styles.marginBottom || styles.paddingBottom;
    });
    
    // Parse the pixel value
    const spacingValue = parseInt(bottomSpacing, 10);
    
    // Should be approximately 48px (allow small variance for different widget types)
    expect(spacingValue).toBeGreaterThanOrEqual(40);
    expect(spacingValue).toBeLessThanOrEqual(56);
  });

  test('should verify compact layout with reduced spacing', async ({ page }) => {
    // Get multiple widgets
    const widgets = page.locator('.ak-widget, [class*="widget"], .widget-container');
    const count = await widgets.count();
    
    if (count >= 2) {
      // Get positions of first two widgets
      const firstBox = await widgets.nth(0).boundingBox();
      const secondBox = await widgets.nth(1).boundingBox();
      
      if (firstBox && secondBox) {
        // Calculate spacing between widgets
        const spacing = secondBox.y - (firstBox.y + firstBox.height);
        
        // Spacing should be around 48px, definitely less than old 96px
        expect(spacing).toBeLessThan(70);
        expect(spacing).toBeGreaterThan(30);
      }
    }
  });

  test('should verify spacing is consistent across different widget types', async ({ page }) => {
    // This test verifies the CSS variable is applied globally
    const rootSpacing = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--fs-widgets-bottom-spacing').trim();
    });
    
    expect(rootSpacing).toBe('48px');
    
    // Verify it's not the old 96px value
    expect(rootSpacing).not.toBe('96px');
  });
});
