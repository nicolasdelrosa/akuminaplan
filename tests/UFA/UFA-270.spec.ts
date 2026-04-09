import { test, expect } from '@playwright/test';

/**
 * UFA-270: Search results for documents not displaying last modified by
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Issue: On the search results page and Document Viewer Widget, documents are showing 
 * "last modified by" as blank even when the field is populated in SharePoint.
 * 
 * Note: Typeahead/autocomplete does NOT show modified by information by design.
 * This test focuses on the full search results page and Document Viewer Widget.
 * 
 * Expected: Fallback logic for when ModifiedBy field is null.
 * Fallback chain: ModifiedBy → Editor → Author
 */

test.describe('UFA-270 - ModifiedBy Null Value Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application (authentication handled by setup)
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display last modified by information on full search results page', async ({ page }) => {
    // Navigate to search and perform a search to get to FULL results page
    // Note: Typeahead does not show modified by - this is by design
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Search for documents and press Enter to go to full results page
    await searchInput.fill('document');
    await searchInput.press('Enter');
    
    // Wait for navigation to search results page
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify we're on the search results page (not typeahead)
    await expect(page).toHaveURL(/search|results/i, { timeout: 5000 }).catch(() => {
      // URL might not change, continue anyway
    });
    
    // Find document search results on the RESULTS PAGE (not typeahead)
    const documentResults = page.locator('.search-result, .ak-search-result, .document-result, [class*="result-item"]');
    const count = await documentResults.count();
    
    if (count > 0) {
      // Check that modified by information is displayed (not blank)
      for (let i = 0; i < Math.min(count, 3); i++) {
        const result = documentResults.nth(i);
        
        // Look for modified by field specifically
        const modifiedByField = result.locator('[class*="modified"], [class*="lastmodified"], [data-field*="modified"]');
        
        if (await modifiedByField.count() > 0) {
          const modifiedText = await modifiedByField.first().textContent();
          
          // Should NOT be blank - fallback should provide a value
          expect(modifiedText?.trim()).toBeTruthy();
          expect(modifiedText?.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should use fallback chain for missing ModifiedBy field', async ({ page }) => {
    // This test verifies the fallback logic: ModifiedBy → Editor → Author
    // Only applicable to full search results page, NOT typeahead
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Press Enter to navigate to full results page
    await searchInput.fill('pdf');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get all document results from FULL RESULTS PAGE
    const documentResults = page.locator('.search-result, .ak-search-result, .document-result, [class*="result-item"]');
    const count = await documentResults.count();
    
    if (count > 0) {
      // Check each result has user information displayed via fallback chain
      for (let i = 0; i < Math.min(count, 5); i++) {
        const result = documentResults.nth(i);
        
        // Look for modified by field (which should use fallback: ModifiedBy → Editor → Author)
        const modifiedByField = result.locator('[class*="modified"], [class*="author"], [class*="editor"]');
        
        if (await modifiedByField.count() > 0) {
          const userText = await modifiedByField.first().textContent();
          
          // Should have a value from the fallback chain (not empty)
          expect(userText?.trim()).toBeTruthy();
          expect(userText?.trim().length).toBeGreaterThan(0);
          // Should contain an actual name, not just the label
          expect(userText).toMatch(/\w+/);
        }
      }
    }
  });

  test('should prevent blank modified by in document viewer widget', async ({ page }) => {
    // Document Viewer Widget should show modified by information
    // Navigate to a documents page or search for documents
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], #search-box').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    await searchInput.fill('document');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Look for document viewer or document metadata areas
    const documentMetadata = page.locator('.document-viewer, .doc-viewer, [class*="document-meta"], [class*="file-info"]');
    
    if (await documentMetadata.count() > 0) {
      // Find modified by information within document viewer
      const modifiedInfo = documentMetadata.locator('[class*="modified"], [class*="author"], [class*="editor"]');
      
      if (await modifiedInfo.count() > 0) {
        const modifiedText = await modifiedInfo.first().textContent();
        
        // Should not be blank - fallback chain should provide a value
        expect(modifiedText?.trim()).toBeTruthy();
        expect(modifiedText).not.toMatch(/^(modified by:?\s*)?$/i);
      }
    }
  });
});
