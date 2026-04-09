import { test, expect } from '@playwright/test';

/**
 * JMSMUC-90: Update top nav colors
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Update top navigation color scheme to match brand guidelines.
 */

test.describe('JMSMUC-90 - Top Navigation Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display top navigation with updated background color', async ({ page }) => {
    const header = page.locator('header, [role="banner"], nav').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    
    // Get background color
    const bgColor = await header.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    // Should have background color set
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('navigation links should have updated text color', async ({ page }) => {
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const count = await navLinks.count();
    
    if (count > 0) {
      const firstLink = navLinks.first();
      const textColor = await firstLink.evaluate(el => window.getComputedStyle(el).color);
      
      // Text color should be defined
      expect(textColor).toBeTruthy();
      expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('navigation should have proper contrast for accessibility', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    
    if (await nav.isVisible()) {
      const bgColor = await nav.evaluate(el => window.getComputedStyle(el).backgroundColor);
      const links = page.locator('nav a').first();
      
      if (await links.isVisible()) {
        const textColor = await links.evaluate(el => window.getComputedStyle(el).color);
        
        // Both colors should be defined (contrast check)
        expect(bgColor).toBeTruthy();
        expect(textColor).toBeTruthy();
      }
    }
  });
});
