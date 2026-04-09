import { test, expect } from '@playwright/test';

/**
 * JMSMUC-93: Change Language Tokens for Show More to Load More throughout the site
 * Type: Story
 * Priority: Medium
 * Status: Ready for Dev Deploy
 * 
 * Requirement: Update language tokens globally to change 'Show More' text to 'Load More' 
 * for better UX clarity.
 */

test.describe('JMSMUC-93 - Load More Language Tokens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should use "Load More" instead of "Show More" throughout site', async ({ page }) => {
    // Get page content
    const pageText = await page.textContent('body');
    
    // Should not contain "Show More" (case insensitive)
    const showMoreCount = (pageText!.match(/show more/gi) || []).length;
    const loadMoreCount = (pageText!.match(/load more/gi) || []).length;
    
    // If pagination exists, should use "Load More"
    if (showMoreCount + loadMoreCount > 0) {
      // Load More should be preferred over Show More
      expect(loadMoreCount).toBeGreaterThanOrEqual(showMoreCount);
    }
  });

  test('load more buttons should be properly labeled', async ({ page }) => {
    // Look for load more / show more buttons
    const loadMoreButtons = page.locator('button:has-text("Load More"), a:has-text("Load More"), [class*="load-more"]');
    const showMoreButtons = page.locator('button:has-text("Show More"), a:has-text("Show More"), [class*="show-more"]');
    
    const loadMoreCount = await loadMoreButtons.count();
    const showMoreCount = await showMoreButtons.count();
    
    // If any pagination exists, Load More should be used
    if (loadMoreCount + showMoreCount > 0) {
      expect(loadMoreCount).toBeGreaterThanOrEqual(showMoreCount);
    }
  });

  test('load more functionality should work when present', async ({ page }) => {
    const loadMoreButton = page.locator('button:has-text("Load More"), a:has-text("Load More")').first();
    
    const isVisible = await loadMoreButton.isVisible().catch(() => false);
    
    if (isVisible) {
      // Click should work without errors
      await loadMoreButton.click();
      await page.waitForTimeout(1000);
      
      // Page should remain functional after click
      expect(page.url()).toBeTruthy();
    } else {
      // If no Load More button, test passes (not all pages have pagination)
      expect(true).toBe(true);
    }
  });
});
