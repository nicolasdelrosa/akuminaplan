import { test, expect } from '@playwright/test';

/**
 * JMSMUC-82: Missed Branding Changes
 * Type: Bug
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Fix missed branding elements that were not updated in initial branding pass.
 */

test.describe('JMSMUC-82 - Branding Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should have consistent branding throughout the site', async ({ page }) => {
    // Verify company logo is present
    const logo = page.locator('img[alt*="logo" i], img[alt*="Company" i]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
    
    // Verify logo has valid src
    const logoSrc = await logo.getAttribute('src');
    expect(logoSrc).toBeTruthy();
    expect(logoSrc).not.toContain('placeholder');
  });

  test('should display updated branding colors', async ({ page }) => {
    // Check header branding
    const header = page.locator('header, [role="banner"], .header').first();
    await expect(header).toBeVisible({ timeout: 10000 });
    
    // Verify header has background color set
    const headerBg = await header.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(headerBg).toBeTruthy();
    expect(headerBg).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
  });

  test('should have branded footer content', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible({ timeout: 5000 });
    
    // Footer should contain copyright or company name
    const footerText = await footer.textContent();
    expect(footerText).toMatch(/smucker|©|copyright/i);
  });
});
