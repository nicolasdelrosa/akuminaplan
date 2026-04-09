import { test, expect } from '@playwright/test';

/**
 * JMSMUC-77: Replace Meganav view with Simple Menu view
 * Type: Task
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Replace the Meganav navigation view with a simpler menu view 
 * for better performance and usability.
 */

test.describe('JMSMUC-77 - Simple Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display simple menu instead of meganav', async ({ page }) => {
    // Verify navigation menu is present
    const nav = page.locator('nav, [role="navigation"], .navigation, .menu').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
    
    // Simple menu should not have meganav indicators
    const navContent = await page.content();
    expect(navContent).not.toContain('meganav');
    expect(navContent).not.toContain('mega-nav');
    expect(navContent).not.toContain('megamenu');
  });

  test('should have navigation menu items visible', async ({ page }) => {
    // Find navigation links
    const navLinks = page.locator('nav a, [role="navigation"] a, .menu a');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify at least first few links are visible
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
    }
  });

  test('should use simple menu styling', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    
    if (await nav.isVisible()) {
      // Get navigation styles
      const classList = await nav.getAttribute('class');
      
      // Should have simple menu classes, not meganav
      if (classList) {
        expect(classList.toLowerCase()).not.toContain('mega');
      }
    }
  });

  test('navigation should be performant and load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForSelector('nav, [role="navigation"]', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // Simple menu should load faster than meganav (under 3 seconds)
    expect(loadTime).toBeLessThan(3000);
  });
});
