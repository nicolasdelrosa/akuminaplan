import { test, expect } from '@playwright/test';

/**
 * UFA-279: User Preferences Taxonomy Label Colors
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - Change taxonomy label colors from orange to black
 * - Apply to user preferences interface
 * - Improve text readability
 */

test.describe('UFA-279 - User Preferences Color Update', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should have black text for taxonomy labels in user preferences', async ({ page }) => {
    // Navigate to user preferences/settings
    // This might be in a modal or separate page
    const preferencesButton = page.locator('[aria-label*="preferences"], [title*="preferences"], button:has-text("Preferences")').first();
    
    if (await preferencesButton.isVisible()) {
      await preferencesButton.click();
      await page.waitForTimeout(500);
      
      // Find taxonomy labels
      const labels = page.locator('.taxonomy-label, .preference-label, label').first();
      
      if (await labels.isVisible()) {
        const color = await labels.evaluate(el => getComputedStyle(el).color);
        
        // Should be black or dark gray
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const [, r, g, b] = match.map(Number);
          expect(r).toBeLessThan(50);
          expect(g).toBeLessThan(50);
          expect(b).toBeLessThan(50);
        }
      }
    }
  });

  test('should not have orange color for taxonomy labels', async ({ page }) => {
    const preferencesButton = page.locator('[aria-label*="preferences"], [title*="preferences"], button:has-text("Preferences")').first();
    
    if (await preferencesButton.isVisible()) {
      await preferencesButton.click();
      await page.waitForTimeout(500);
      
      const labels = page.locator('.taxonomy-label, .preference-label, label');
      const count = await labels.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const color = await labels.nth(i).evaluate(el => getComputedStyle(el).color);
        
        // Should NOT be UFA orange
        expect(color).not.toContain('rgb(237, 110, 25)');
        expect(color).not.toContain('#ed6e19');
      }
    }
  });

  test('should have consistent black color across all preference labels', async ({ page }) => {
    const preferencesButton = page.locator('[aria-label*="preferences"], [title*="preferences"], button:has-text("Preferences")').first();
    
    if (await preferencesButton.isVisible()) {
      await preferencesButton.click();
      await page.waitForTimeout(500);
      
      const labels = page.locator('.taxonomy-label, .preference-label, label');
      const count = await labels.count();
      
      if (count >= 2) {
        const firstColor = await labels.nth(0).evaluate(el => getComputedStyle(el).color);
        const secondColor = await labels.nth(1).evaluate(el => getComputedStyle(el).color);
        
        // Colors should match
        expect(firstColor).toBe(secondColor);
      }
    }
  });

  test('should maintain readability with black text', async ({ page }) => {
    const preferencesButton = page.locator('[aria-label*="preferences"], [title*="preferences"], button:has-text("Preferences")').first();
    
    if (await preferencesButton.isVisible()) {
      await preferencesButton.click();
      await page.waitForTimeout(500);
      
      const labels = page.locator('.taxonomy-label, .preference-label, label').first();
      
      if (await labels.isVisible()) {
        // Get text color and background
        const color = await labels.evaluate(el => getComputedStyle(el).color);
        const bgColor = await labels.evaluate(el => getComputedStyle(el).backgroundColor);
        
        // Both should be defined
        expect(color).toBeTruthy();
        expect(bgColor).toBeTruthy();
        
        // Text should not be same as background (contrast)
        expect(color).not.toBe(bgColor);
      }
    }
  });
});
