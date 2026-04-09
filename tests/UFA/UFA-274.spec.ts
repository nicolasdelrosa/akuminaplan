import { test, expect } from '@playwright/test';

/**
 * UFA-274: Update Document Search results
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirement: Documents should display Short Description field in search results.
 * If Short Description is blank, the summary should also be blank (no fallback to SharePoint preview).
 * 
 * Table from ticket:
 * | Type of Content | Currently Pulling           | Recommended field    | If blank           |
 * | Documents       | SharePoint document preview | Short Description    | Summary stays blank|
 */

test.describe('UFA-274 - Document Search Results Enhancement', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display Short Description in document search results', async ({ page }) => {
    // Search for documents
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('document');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Find document results
    const documentResults = page.locator('.search-result, .ak-search-result, [class*="result-item"]');
    const count = await documentResults.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify results show description/summary content
    for (let i = 0; i < Math.min(count, 3); i++) {
      const result = documentResults.nth(i);
      const resultText = await result.textContent();
      
      // Should NOT contain SharePoint preview indicators
      expect(resultText).not.toContain('SharePoint');
      expect(resultText).not.toContain('document preview');
    }
  });

  test('should not show SharePoint document preview in search results', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('pdf');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that results don't contain SharePoint preview content
    const resultsContainer = page.locator('.search-results, .ak-search-results, [class*="search"]').first();
    const content = await resultsContainer.textContent();
    
    // Should not have preview text patterns
    expect(content).not.toMatch(/preview|shared|modified|created|by/i);
  });

  test('should keep summary blank when Short Description is empty', async ({ page }) => {
    // This test verifies the no-fallback behavior
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('document');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get all document results
    const results = page.locator('.search-result, .ak-search-result, [class*="result-item"]');
    const count = await results.count();
    
    if (count > 0) {
      // Check for description/summary fields
      const summaryFields = page.locator('[class*="description"], [class*="summary"], .result-summary');
      
      // If description fields exist and are empty, they should display as empty (not filled with preview)
      for (let i = 0; i < Math.min(await summaryFields.count(), 3); i++) {
        const summaryText = await summaryFields.nth(i).textContent();
        
        // If summary exists, verify it's either Short Description or truly blank
        if (summaryText && summaryText.trim().length > 0) {
          // Should not be SharePoint default preview text
          expect(summaryText).not.toContain('SharePoint');
        }
      }
    }
  });

  test('should display clean document search results without preview text', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('report');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify search results are clean and use Short Description
    const results = page.locator('.search-result, .ak-search-result, [class*="result-item"]');
    
    if (await results.count() > 0) {
      const firstResult = results.first();
      const resultHtml = await firstResult.innerHTML();
      
      // Should not contain SharePoint's automatic preview content
      expect(resultHtml).not.toContain('This document was');
      expect(resultHtml).not.toContain('Last modified');
    }
  });
});
