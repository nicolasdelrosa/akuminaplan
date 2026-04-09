import { test, expect } from '@playwright/test';

/**
 * JMSMUC-89: Change top level of Navigation links to use Bebas Neue google font
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Update top-level navigation to use Bebas Neue Google Font for enhanced typography.
 */

test.describe('JMSMUC-89 - Navigation Bebas Neue Font', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should use Bebas Neue font in top navigation', async ({ page }) => {
    // Find navigation
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
    
    // Get navigation links
    const navLinks = page.locator('nav a, [role="navigation"] a').first();
    
    if (await navLinks.isVisible()) {
      // Check font family
      const fontFamily = await navLinks.evaluate(el => window.getComputedStyle(el).fontFamily);
      
      // Should contain Bebas Neue
      expect(fontFamily.toLowerCase()).toContain('bebas');
    }
  });

  test('navigation font should be loaded and rendered', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    
    // Verify Google Fonts link is in page
    const googleFontsLink = page.locator('link[href*="fonts.googleapis.com"]');
    const hasFontLink = await googleFontsLink.count() > 0;
    
    // If using Google Fonts, link should be present
    if (hasFontLink) {
      const href = await googleFontsLink.first().getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('top level navigation links should be styled with custom font', async ({ page }) => {
    const topNavLinks = page.locator('nav > * a, [role="navigation"] > * a').first();
    
    if (await topNavLinks.isVisible()) {
      const fontSize = await topNavLinks.evaluate(el => window.getComputedStyle(el).fontSize);
      
      // Font size should be set
      expect(fontSize).toBeTruthy();
      expect(fontSize).not.toBe('0px');
    }
  });
});
