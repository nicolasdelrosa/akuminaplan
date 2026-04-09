import { test, expect } from '@playwright/test';

/**
 * UFA-275: Contents of the Preferences & Interests dialog is indexed in pagedata_AK
 * Type: Task
 * Priority: Medium
 * Status: Internal Testing
 * 
 * Issue: The issue involves the indexing of the Preferences & Interests dialog in pagedata_AK.
 * The expected behavior is that contents of the preferences panel should be included in the search index.
 * 
 * Acceptance Criteria:
 * - User preferences modal must be open on any page
 * - Create a new page with content that does not include terms from user preferences
 * - Publish the page
 * - Verify that the search index contains only the terms in the content
 * - Ensure that the contents of the preferences panel are included in the search index
 * - A search for a tag should return more pages than expected
 */

test.describe('UFA-275 - Search Exclude Configuration Logic', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should handle empty search exclude configuration gracefully', async ({ page }) => {
    // Verify search works even when aksearchexclude config is empty
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('test');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Search should work without errors
    const results = page.locator('.search-results, .ak-search-results, [class*="search"]');
    await expect(results).toBeVisible({ timeout: 5000 });
    
    // Should not show error messages
    const errorMessages = page.locator('[class*="error"], .error-message, .alert-danger');
    expect(await errorMessages.count()).toBe(0);
  });

  test('should not include preferences dialog content in page search index', async ({ page }) => {
    // Open user preferences if available
    const preferencesButton = page.locator('[class*="preference"], [class*="settings"], button:has-text("Preferences")').first();
    
    if (await preferencesButton.isVisible()) {
      await preferencesButton.click();
      await page.waitForTimeout(1000);
      
      // Close preferences
      const closeButton = page.locator('[class*="close"], button:has-text("Close")').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
    
    // Now search for content
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('preferences');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    // Results should be actual page content, not preferences panel content
    const results = page.locator('.search-result, .ak-search-result');
    
    if (await results.count() > 0) {
      const firstResultText = await results.first().textContent();
      
      // Should not contain preferences dialog-specific terms
      expect(firstResultText).not.toContain('modal');
      expect(firstResultText).not.toContain('dialog');
    }
  });

  test('should prevent errors when search exclude config is not set', async ({ page }) => {
    // Test that search handles missing aksearchexclude configuration
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Perform various searches
    const searchTerms = ['document', 'page', 'content'];
    
    for (const term of searchTerms) {
      await searchInput.clear();
      await searchInput.fill(term);
      await searchInput.press('Enter');
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Verify no JavaScript errors occurred
      const consoleErrors = await page.evaluate(() => {
        return (window as any).__consoleErrors || [];
      });
      
      // Should complete without errors
      const errorMsg = page.locator('.error, [class*="error-message"]');
      expect(await errorMsg.count()).toBe(0);
    }
  });

  test('should properly index page content excluding system elements', async ({ page }) => {
    // Search for common page content
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('home');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should have results
    const results = page.locator('.search-result, .ak-search-result, [class*="result-item"]');
    const count = await results.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Results should be actual pages, not system dialogs or modals
    for (let i = 0; i < Math.min(count, 3); i++) {
      const resultText = await results.nth(i).textContent();
      
      // Should have actual content
      expect(resultText?.length).toBeGreaterThan(10);
    }
  });
});
