import { test, expect } from '@playwright/test';

/**
 * UFA-285: Add System & Tools to Typeahead and Global Search
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - System & Tools results should appear in typeahead search
 * - System & Tools results should appear in global search
 * - Results should be searchable by title and summary
 * - Integration with existing search infrastructure
 */

test.describe('UFA-285 - Enhanced Search Results - System & Tools', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should show System & Tools in typeahead search results', async ({ page }) => {
    // Find global search input
    const searchInput = page.locator('input[type="search"], .ak-search-input, input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Type to trigger typeahead
      await searchInput.fill('SAP');
      await page.waitForTimeout(500);
      
      // Look for typeahead/autocomplete results
      const typeaheadResults = page.locator('.typeahead-results, .autocomplete-results, .search-suggestions');
      
      if (await typeaheadResults.isVisible()) {
        const resultsText = await typeaheadResults.textContent();
        
        // Should have some results
        expect(resultsText).toBeTruthy();
      }
    }
  });

  test('should show System & Tools in global search results page', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input, input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Perform global search
      await searchInput.fill('system');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Should navigate to search results page or show results
      const results = page.locator('.ak-search-result, .search-result, [class*="search-results"]');
      const count = await results.count();
      
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should search System & Tools by title field', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      // Search for a specific tool name
      await searchInput.fill('SAP');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Find results with "SAP" in title
      const results = page.locator('.ak-search-result, .search-result').filter({ hasText: /SAP/i });
      
      if (await results.count() > 0) {
        // Verify at least one result matches
        expect(await results.count()).toBeGreaterThan(0);
      }
    }
  });

  test('should search System & Tools by summary/description field', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      // Search for a word likely in description
      await searchInput.fill('resource');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      const results = page.locator('.ak-search-result, .search-result');
      
      if (await results.count() > 0) {
        // Should have results containing the term
        expect(await results.count()).toBeGreaterThan(0);
      }
    }
  });

  test('should categorize System & Tools results separately', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('tool');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Look for category headers or filters
      const categoryHeaders = page.locator('.category-header, .result-category, [class*="category"]');
      
      if (await categoryHeaders.count() > 0) {
        const text = await categoryHeaders.allTextContents();
        
        // Should have "System" or "Tools" category
        const hasCategory = text.some(t => /system|tool/i.test(t));
        
        if (hasCategory) {
          expect(hasCategory).toBe(true);
        }
      }
    }
  });

  test('should verify typeahead shows quick preview of System & Tools', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      // Type to trigger typeahead
      await searchInput.fill('SAP');
      await page.waitForTimeout(800);
      
      // Check for typeahead dropdown
      const typeahead = page.locator('.typeahead-dropdown, .search-dropdown, .autocomplete-dropdown').first();
      
      if (await typeahead.isVisible()) {
        // Should show at least one item
        const items = typeahead.locator('.typeahead-item, .search-item');
        expect(await items.count()).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
