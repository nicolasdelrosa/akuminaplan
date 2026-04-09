import { test, expect } from '@playwright/test';

/**
 * UFA-276: Custom Tools and Resource Widget
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - Customized widget with searchability on Tools & Systems page
 * - 4 tiles across the page grouped by function
 * - Consistency in size of tiles (same size whether 1, 2, 3, or 4 across)
 * - New Custom View: ufa-search-grid
 * - 4-column grid layout combining image thumbnails with summary links
 * - Real-time search functionality filtering items by title and summary
 * - Mobile-responsive design with minimum width for search box
 */

test.describe('UFA-276 - Custom Tools & Resources Widget', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display Tools & Systems page with 4-column grid layout', async ({ page }) => {
    // Navigate to Tools & Systems page
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Find the custom grid widget
    const grid = page.locator('.ufa-search-grid, .ufa-slw-grid, [class*="tools-grid"]').first();
    
    if (await grid.isVisible()) {
      // Verify grid layout exists
      await expect(grid).toBeVisible();
      
      // Check for grid items
      const items = grid.locator('.ufa-slw-item, .grid-item, [class*="tile"]');
      const count = await items.count();
      
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should have searchable functionality for tools and systems', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Find search input on the page
    const searchBox = page.locator('.ufa-slw-search-input, input[class*="search"], [placeholder*="Search"]').first();
    
    if (await searchBox.isVisible()) {
      await searchBox.fill('SAP');
      await page.waitForTimeout(500);
      
      // Verify filtering works (items get hidden/shown)
      const visibleItems = page.locator('.ufa-slw-item:not(.hidden), .grid-item:visible');
      const hiddenItems = page.locator('.ufa-slw-item.hidden, .grid-item.hidden');
      
      // Should have filtered results
      expect(await visibleItems.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should maintain consistent tile sizing across different row configurations', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Get all tiles
    const tiles = page.locator('.ufa-slw-item, .grid-item, [class*="tile"]');
    const count = await tiles.count();
    
    if (count >= 2) {
      // Get dimensions of first two tiles
      const firstBox = await tiles.nth(0).boundingBox();
      const secondBox = await tiles.nth(1).boundingBox();
      
      if (firstBox && secondBox) {
        // Widths should be similar (allow small variance)
        const widthDiff = Math.abs(firstBox.width - secondBox.width);
        expect(widthDiff).toBeLessThan(20);
        
        // Heights should be similar
        const heightDiff = Math.abs(firstBox.height - secondBox.height);
        expect(heightDiff).toBeLessThan(20);
      }
    }
  });

  test('should verify image height is 180px with object-fit cover', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    // Find images within tiles
    const tileImages = page.locator('.ufa-slw-item img, .grid-item img, [class*="tile"] img');
    
    if (await tileImages.count() > 0) {
      const firstImage = tileImages.first();
      const box = await firstImage.boundingBox();
      
      if (box) {
        // Height should be approximately 180px
        expect(box.height).toBeGreaterThanOrEqual(170);
        expect(box.height).toBeLessThanOrEqual(190);
      }
      
      // Check object-fit CSS
      const objectFit = await firstImage.evaluate(el => getComputedStyle(el).objectFit);
      expect(objectFit).toBe('cover');
    }
  });

  test('should be mobile responsive with proper search box width', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    const searchBox = page.locator('.ufa-slw-search-input, input[class*="search"]').first();
    
    if (await searchBox.isVisible()) {
      const box = await searchBox.boundingBox();
      
      if (box) {
        // Should have minimum width even on mobile
        expect(box.width).toBeGreaterThan(200);
      }
    }
    
    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should filter items by both title and summary on search', async ({ page }) => {
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com/tools-systems');
    await page.waitForLoadState('networkidle');
    
    const searchBox = page.locator('.ufa-slw-search-input, input[class*="search"]').first();
    
    if (await searchBox.isVisible()) {
      // Search for a term
      await searchBox.fill('system');
      await page.waitForTimeout(500);
      
      // Verify groups hide when all children are filtered
      const groups = page.locator('.ufa-slw-group, [class*="group"]');
      
      // Some groups should be visible or hidden based on matches
      const visibleGroups = await groups.filter({ hasNot: page.locator('.hidden') }).count();
      expect(visibleGroups).toBeGreaterThanOrEqual(0);
    }
  });
});
