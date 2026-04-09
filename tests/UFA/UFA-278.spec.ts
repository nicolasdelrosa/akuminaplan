import { test, expect } from '@playwright/test';

/**
 * UFA-278: Update Top Navigation Text Colors
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - Header and top navigation should have black text by default
 * - Text should turn orange on hover
 * - Update from previous color scheme
 */

test.describe('UFA-278 - Top Navigation Text Color', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should have black text color in top navigation', async ({ page }) => {
    // Find top navigation elements
    const navLinks = page.locator('.ak-top-nav a, header nav a, .top-nav-link').first();
    
    if (await navLinks.isVisible()) {
      const color = await navLinks.evaluate(el => getComputedStyle(el).color);
      
      // Should be black or very dark gray
      // rgb(0, 0, 0) = black, close variants allowed
      expect(color).toMatch(/rgb\(0,\s*0,\s*0\)|rgb\([0-9]{1,2},\s*[0-9]{1,2},\s*[0-9]{1,2}\)/);
      
      // Parse RGB values to ensure darkness
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        // All values should be low (dark)
        expect(r).toBeLessThan(50);
        expect(g).toBeLessThan(50);
        expect(b).toBeLessThan(50);
      }
    }
  });

  test('should change to orange color on hover', async ({ page }) => {
    const navLinks = page.locator('.ak-top-nav a, header nav a, .top-nav-link').first();
    
    if (await navLinks.isVisible()) {
      // Hover over the link
      await navLinks.hover();
      await page.waitForTimeout(100);
      
      // Get hover color
      const hoverColor = await navLinks.evaluate(el => getComputedStyle(el).color);
      
      // Should be UFA orange: rgb(237, 110, 25) or similar
      const match = hoverColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        
        // Should have high red, moderate green, low blue (orange range)
        expect(r).toBeGreaterThan(200); // High red
        expect(g).toBeGreaterThan(80); // Moderate green
        expect(g).toBeLessThan(150);
        expect(b).toBeLessThan(50); // Low blue
      }
    }
  });

  test('should verify header text is also black', async ({ page }) => {
    // Find header elements
    const headerText = page.locator('header, .ak-header, .site-header').locator('text=UFA, text=Home, text=About').first();
    
    if (await headerText.isVisible()) {
      const color = await headerText.evaluate(el => getComputedStyle(el).color);
      
      // Parse to ensure black/dark
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        expect(r).toBeLessThan(50);
        expect(g).toBeLessThan(50);
        expect(b).toBeLessThan(50);
      }
    }
  });

  test('should maintain consistent text color across all nav items', async ({ page }) => {
    const navLinks = page.locator('.ak-top-nav a, header nav a, .top-nav-link');
    const count = await navLinks.count();
    
    if (count >= 2) {
      // Get colors of first two links
      const firstColor = await navLinks.nth(0).evaluate(el => getComputedStyle(el).color);
      const secondColor = await navLinks.nth(1).evaluate(el => getComputedStyle(el).color);
      
      // Should be the same
      expect(firstColor).toBe(secondColor);
    }
  });

  test('should not have the old color scheme', async ({ page }) => {
    const navLinks = page.locator('.ak-top-nav a, header nav a, .top-nav-link').first();
    
    if (await navLinks.isVisible()) {
      const color = await navLinks.evaluate(el => getComputedStyle(el).color);
      
      // Should NOT be orange by default (only on hover)
      expect(color).not.toContain('rgb(237, 110, 25)');
      expect(color).not.toContain('#ed6e19');
    }
  });
});
