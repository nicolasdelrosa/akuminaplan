import { test, expect } from '@playwright/test';

/**
 * JMSMUC-87: Update footer site information
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Update footer site information content and layout.
 */

test.describe('JMSMUC-87 - Footer Site Information', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
  });

  test('should display updated footer information', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
    
    const footerText = await footer.textContent();
    
    // Footer should contain company information
    expect(footerText).toBeTruthy();
    expect(footerText!.length).toBeGreaterThan(0);
  });

  test('should show copyright information', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    const footerText = await footer.textContent();
    
    // Should have copyright symbol and current year
    expect(footerText).toMatch(/©|copyright/i);
    expect(footerText).toContain('2026');
  });

  test('should display company name in footer', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    const footerText = await footer.textContent();
    
    // Should contain J.M. Smucker reference
    expect(footerText).toMatch(/smucker/i);
  });
});
