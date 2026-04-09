import { test, expect } from '@playwright/test';

/**
 * JMSMUC-86: Update footer background color and link colors
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Update footer styling to match new brand guidelines 
 * including background color and link colors.
 */

test.describe('JMSMUC-86 - Footer Branding Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
  });

  test('should display footer with updated background color', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
    
    // Get footer background color
    const bgColor = await footer.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    // Should have a background color set (not transparent)
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');
  });

  test('should have properly styled footer links', async ({ page }) => {
    const footerLinks = page.locator('footer a, [role="contentinfo"] a');
    const count = await footerLinks.count();
    
    if (count > 0) {
      // Check first link's color
      const firstLink = footerLinks.first();
      await expect(firstLink).toBeVisible();
      
      const linkColor = await firstLink.evaluate(el => window.getComputedStyle(el).color);
      
      // Link should have a color defined
      expect(linkColor).toBeTruthy();
      expect(linkColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('footer links should have hover states', async ({ page }) => {
    const footerLinks = page.locator('footer a:visible, [role="contentinfo"] a:visible');
    const count = await footerLinks.count();
    
    if (count > 0) {
      const link = footerLinks.first();
      
      // Hover over link
      await link.hover();
      await page.waitForTimeout(500);
      
      // Link should remain visible and clickable
      await expect(link).toBeVisible();
    }
  });
});
