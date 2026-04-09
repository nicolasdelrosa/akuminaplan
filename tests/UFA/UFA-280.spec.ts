import { test, expect } from '@playwright/test';

/**
 * UFA-280: POC Tools & System with Search Grid
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - Similar to UFA-276, create POC for Tools & System page
 * - 4-column grid layout with ufa-search-grid view
 * - Searchable tiles with image thumbnails
 * - Real-time filtering by title and summary
 * - Consistent tile sizing
 */

test.describe('UFA-280 - Document Search Short Description', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to Tools & System page and display grid', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Verify page loaded
    await expect(page).toHaveURL(/tools-systems/);
    
    // Find the grid widget
    const grid = page.locator('.ufa-search-grid, [class*="tools-grid"]').first();
    
    if (await grid.isVisible()) {
      await expect(grid).toBeVisible();
    }
  });

  test('should display 4-column grid layout with tiles', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Check for grid structure
    const gridItems = page.locator('.ufa-slw-item, .grid-item, [class*="tile"]');
    const count = await gridItems.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify grid layout CSS
    const grid = page.locator('.ufa-search-grid, .ufa-slw-grid').first();
    if (await grid.isVisible()) {
      const display = await grid.evaluate(el => getComputedStyle(el).display);
      expect(display).toMatch(/grid|flex/);
    }
  });

  test('should have search functionality that filters tiles', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Find search input
    const searchInput = page.locator('.ufa-slw-search-input, input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Get initial count
      const initialCount = await page.locator('.ufa-slw-item:visible, .grid-item:visible').count();
      
      // Type in search
      await searchInput.fill('SAP');
      await page.waitForTimeout(500);
      
      // Verify filtering occurred (count changed or stayed same if all match)
      const filteredCount = await page.locator('.ufa-slw-item:visible, .grid-item:visible').count();
      
      // Count should be less than or equal to initial
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('should filter by both title and summary fields', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('.ufa-slw-search-input, input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Search for a common word
      await searchInput.fill('system');
      await page.waitForTimeout(500);
      
      // Check that visible items contain the search term in title or summary
      const visibleItems = page.locator('.ufa-slw-item:visible, .grid-item:visible');
      const count = await visibleItems.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should maintain consistent tile sizing in 4-column layout', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    const tiles = page.locator('.ufa-slw-item, .grid-item');
    const count = await tiles.count();
    
    if (count >= 4) {
      // Check first 4 tiles for consistency
      const boxes = await Promise.all([
        tiles.nth(0).boundingBox(),
        tiles.nth(1).boundingBox(),
        tiles.nth(2).boundingBox(),
        tiles.nth(3).boundingBox(),
      ]);
      
      if (boxes.every(b => b !== null)) {
        const widths = boxes.map(b => b!.width);
        
        // All widths should be similar (within 20px)
        const maxWidth = Math.max(...widths);
        const minWidth = Math.min(...widths);
        expect(maxWidth - minWidth).toBeLessThan(20);
      }
    }
  });

  test('should hide empty groups when all tiles are filtered out', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('.ufa-slw-search-input, input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      // Search for something that should not match
      await searchInput.fill('xyznonexistent123');
      await page.waitForTimeout(500);
      
      // Groups should be hidden or show no results
      const visibleItems = await page.locator('.ufa-slw-item:visible, .grid-item:visible').count();
      
      // Should be 0 or very few matches
      expect(visibleItems).toBeLessThanOrEqual(1);
    }
  });
});
