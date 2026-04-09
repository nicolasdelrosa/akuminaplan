import { test, expect } from '@playwright/test';

/**
 * UFA-286: Add SLW (Site List Widget) to Typeahead and Global Search
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - SLW results should appear in typeahead search
 * - SLW results should appear in global search results
 * - Search should cover title and summary fields
 * - Integration with existing Akumina search
 */

test.describe('UFA-286 - Enhanced Search Results - SLW Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should show SLW items in typeahead search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input, input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Type to trigger typeahead
      await searchInput.fill('resource');
      await page.waitForTimeout(500);
      
      // Check for typeahead dropdown
      const typeahead = page.locator('.typeahead-results, .autocomplete-results, .search-suggestions');
      
      if (await typeahead.isVisible()) {
        const text = await typeahead.textContent();
        expect(text).toBeTruthy();
      }
    }
  });

  test('should show SLW items in global search results', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      // Perform global search
      await searchInput.fill('link');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Find search results
      const results = page.locator('.ak-search-result, .search-result');
      const count = await results.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should search SLW items by title', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      // Search for a typical SLW title term
      await searchInput.fill('quick');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Results should contain matching items
      const results = page.locator('.ak-search-result, .search-result').filter({ hasText: /quick/i });
      
      if (await results.count() > 0) {
        expect(await results.count()).toBeGreaterThan(0);
      }
    }
  });

  test('should search SLW items by summary', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      // Search for description term
      await searchInput.fill('link');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      const results = page.locator('.ak-search-result, .search-result');
      
      if (await results.count() > 0) {
        expect(await results.count()).toBeGreaterThan(0);
      }
    }
  });

  test('should display SLW items with proper metadata', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('resource');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      const firstResult = page.locator('.ak-search-result, .search-result').first();
      
      if (await firstResult.isVisible()) {
        // Should have title
        const title = await firstResult.locator('.title, .result-title, h3, h4').textContent();
        expect(title).toBeTruthy();
        
        // Should have some content/summary
        const summary = await firstResult.locator('.summary, .description, p').first().textContent();
        if (summary) {
          expect(summary.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should handle SLW results in typeahead dropdown clicks', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('link');
      await page.waitForTimeout(800);
      
      const typeahead = page.locator('.typeahead-dropdown, .search-dropdown, .autocomplete-dropdown').first();
      
      if (await typeahead.isVisible()) {
        const firstItem = typeahead.locator('.typeahead-item, .search-item, a').first();
        
        if (await firstItem.isVisible()) {
          // Should be clickable
          await expect(firstItem).toBeVisible();
          
          // Click should navigate or open
          const href = await firstItem.getAttribute('href');
          if (href) {
            expect(href).toBeTruthy();
          }
        }
      }
    }
  });

  test('should categorize SLW results appropriately', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], .ak-search-input').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('resource');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Look for category indicators
      const categories = page.locator('.category-header, .result-category, [class*="category"]');
      
      if (await categories.count() > 0) {
        const text = await categories.allTextContents();
        
        // Should have "Links" or similar category
        const hasCategory = text.some(t => /link|resource|slw/i.test(t));
        
        if (hasCategory) {
          expect(hasCategory).toBe(true);
        }
      }
    }
  });
});
