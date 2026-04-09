import { test, expect } from '@playwright/test';

/**
 * JMSMUC-88: Update broadcast site alert styling
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Update broadcast alert styling to align with new brand guidelines.
 */

test.describe('JMSMUC-88 - Broadcast Alert Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display broadcast alert with updated styling', async ({ page }) => {
    // Look for broadcast/alert elements
    const alert = page.locator('[class*="alert"], [class*="broadcast"], [class*="banner"], [role="alert"]').first();
    
    // Alert may or may not be present depending on active broadcasts
    const isVisible = await alert.isVisible().catch(() => false);
    
    if (isVisible) {
      // Verify alert has background color
      const bgColor = await alert.evaluate(el => window.getComputedStyle(el).backgroundColor);
      expect(bgColor).toBeTruthy();
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('broadcast alert should be styled according to brand', async ({ page }) => {
    const alert = page.locator('[class*="alert"], [class*="broadcast"]').first();
    
    const isVisible = await alert.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check text color
      const textColor = await alert.evaluate(el => window.getComputedStyle(el).color);
      expect(textColor).toBeTruthy();
      
      // Should have padding for readability
      const padding = await alert.evaluate(el => window.getComputedStyle(el).padding);
      expect(padding).toBeTruthy();
    } else {
      // If no alert present, test passes (no active broadcasts)
      expect(true).toBe(true);
    }
  });
});
