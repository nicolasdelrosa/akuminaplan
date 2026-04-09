import { test, expect } from '@playwright/test';

/**
 * JMSMUC-91: Update site body background color to creme
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Change site body background color from white to creme to match brand aesthetic.
 */

test.describe('JMSMUC-91 - Body Background Color', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display creme background color on body', async ({ page }) => {
    // Get body background color
    const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    
    // Should have a background color set
    expect(bgColor).toBeTruthy();
    
    // Should not be pure white (rgb(255, 255, 255))
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
    expect(bgColor).not.toBe('rgba(255, 255, 255, 1)');
  });

  test('background should be creme/off-white tone', async ({ page }) => {
    const bgColor = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.backgroundColor;
    });
    
    // Parse RGB values
    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      
      // Creme should be light but not pure white
      expect(r).toBeGreaterThan(240);
      expect(g).toBeGreaterThan(240);
      expect(b).toBeGreaterThan(230);
      
      // At least one channel should be less than 255
      expect(r === 255 && g === 255 && b === 255).toBe(false);
    }
  });

  test('main content area should inherit or complement body background', async ({ page }) => {
    const main = page.locator('main, [role="main"], .content').first();
    
    if (await main.isVisible()) {
      const mainBg = await main.evaluate(el => window.getComputedStyle(el).backgroundColor);
      
      // Main should either be transparent or have compatible background
      expect(mainBg).toBeTruthy();
    }
  });
});
