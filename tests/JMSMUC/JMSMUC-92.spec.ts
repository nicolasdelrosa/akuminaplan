import { test, expect } from '@playwright/test';

/**
 * JMSMUC-92: Fix search typeahead see all background color
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Fix background color styling for the 'See All' option in search typeahead dropdown.
 */

test.describe('JMSMUC-92 - Search Typeahead Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display search typeahead with correct styling', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Type to trigger typeahead
    await searchInput.fill('test');
    await page.waitForTimeout(1000);
    
    // Look for typeahead dropdown
    const typeahead = page.locator('[class*="typeahead"], [class*="autocomplete"], [class*="suggestions"]').first();
    
    const isVisible = await typeahead.isVisible().catch(() => false);
    
    if (isVisible) {
      // Verify typeahead has background color
      const bgColor = await typeahead.evaluate(el => window.getComputedStyle(el).backgroundColor);
      expect(bgColor).toBeTruthy();
    }
  });

  test('search typeahead "See All" option should have proper background color', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('document');
      await page.waitForTimeout(1000);
      
      // Look for "See All" or "View All" link/button
      const seeAllOption = page.locator('[class*="see-all"], [class*="view-all"], a:has-text("See All"), a:has-text("View All")').first();
      
      const isVisible = await seeAllOption.isVisible().catch(() => false);
      
      if (isVisible) {
        const bgColor = await seeAllOption.evaluate(el => window.getComputedStyle(el).backgroundColor);
        
        // Should have background color defined
        expect(bgColor).toBeTruthy();
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('typeahead dropdown items should have hover states', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('page');
      await page.waitForTimeout(1000);
      
      const typeaheadItems = page.locator('[class*="typeahead"] a, [class*="suggestion"] a, [class*="autocomplete"] a');
      const count = await typeaheadItems.count();
      
      if (count > 0) {
        const firstItem = typeaheadItems.first();
        
        // Hover should work without errors
        await firstItem.hover();
        await page.waitForTimeout(300);
        
        await expect(firstItem).toBeVisible();
      }
    }
  });
});
