import { test, expect } from '@playwright/test';

/**
 * UFA-287: Global Search and Typeahead - Exclude SharePoint system lists and forms
 * Type: Task
 * Priority: Medium
 * Status: Internal Testing
 * 
 * Issue: Global Search and Typeahead currently returns results from SharePoint system lists
 * and forms, which should be excluded from search results.
 * 
 * Reproducible Steps:
 * 1. In global search, type "ak"
 * 2. Observe results redirecting to SharePoint lists
 * 3. Alternatively, type "aspx"
 * 4. Observe results like /style library/forms/allitems.aspx
 * 
 * Expected: SharePoint system lists and forms should be filtered out from search results
 */

test.describe('UFA-287 - Global Search - Exclude SharePoint System Lists', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should not return SharePoint system lists when searching for "ak"', async ({ page }) => {
    // Locate the global search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Type "ak" to trigger search
    await searchInput.fill('ak');
    await searchInput.press('Enter');
    
    // Wait for search results to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow search results to populate
    
    // Verify no SharePoint list results appear
    const resultsContainer = page.locator('.search-results, .ak-search-results, [class*="search"]').first();
    
    // Check that system list paths are NOT in the results
    const systemListPaths = [
      '/style library/forms/',
      '/forms/allitems.aspx',
      '_layouts/',
      '/lists/forms/'
    ];
    
    const pageContent = await resultsContainer.textContent();
    for (const path of systemListPaths) {
      expect(pageContent?.toLowerCase()).not.toContain(path.toLowerCase());
    }
  });

  test('should not return system forms when searching for "aspx"', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('aspx');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify specific system paths are excluded
    const excludedPaths = [
      'style%20library/forms/allitems.aspx',
      '/style library/forms/allitems.aspx',
      '/_layouts/',
      '/forms/allitems.aspx'
    ];
    
    const pageContent = await page.content();
    for (const path of excludedPaths) {
      expect(pageContent).not.toContain(path);
    }
  });

  test('should verify typeahead excludes SharePoint system lists', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Type to trigger typeahead/autocomplete
    await searchInput.fill('ak');
    
    // Wait for typeahead dropdown to appear
    await page.waitForTimeout(1000);
    
    // Look for typeahead/autocomplete dropdown
    const typeaheadDropdown = page.locator('.typeahead, .autocomplete, [class*="suggestions"], [role="listbox"]').first();
    
    // If typeahead appears, verify it doesn't contain system paths
    if (await typeaheadDropdown.isVisible()) {
      const dropdownContent = await typeaheadDropdown.textContent();
      expect(dropdownContent).not.toContain('/forms/allitems.aspx');
      expect(dropdownContent).not.toContain('/_layouts/');
      expect(dropdownContent).not.toContain('/style library/forms/');
    }
  });

  test('should return only relevant content in search results', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('document');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify search results exist
    const searchResults = page.locator('.search-result, .ak-search-result, [class*="result-item"]');
    const count = await searchResults.count();
    
    // Should have some results
    expect(count).toBeGreaterThan(0);
    
    // Verify results are relevant (not system paths)
    for (let i = 0; i < Math.min(count, 5); i++) {
      const resultText = await searchResults.nth(i).textContent();
      expect(resultText).not.toContain('/_layouts/');
      expect(resultText).not.toContain('/forms/allitems');
    }
  });
});
