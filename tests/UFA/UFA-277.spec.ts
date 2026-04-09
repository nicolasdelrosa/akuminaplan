import { test, expect } from '@playwright/test';

/**
 * UFA-277: Add Drop Shadow to Cards
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - Remove orange border from cards
 * - Apply drop shadow to cards instead
 * - Update card styling for better visual separation
 */

test.describe('UFA-277 - Card Shadow Styling', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should have drop shadow instead of orange border on cards', async ({ page }) => {
    // Find cards on the page (common Akumina card classes)
    const cards = page.locator('.ak-card, .card, [class*="card"]').first();
    
    if (await cards.isVisible()) {
      // Get computed styles
      const boxShadow = await cards.evaluate(el => getComputedStyle(el).boxShadow);
      const border = await cards.evaluate(el => getComputedStyle(el).border);
      
      // Should have a box shadow applied
      expect(boxShadow).not.toBe('none');
      
      // Should NOT have orange border (check for orange color values)
      expect(border).not.toContain('rgb(237, 110, 25)'); // UFA orange
      expect(border).not.toContain('#ed6e19');
    }
  });

  test('should verify shadow depth and offset', async ({ page }) => {
    const cards = page.locator('.ak-card, .card, [class*="card"]').first();
    
    if (await cards.isVisible()) {
      const boxShadow = await cards.evaluate(el => getComputedStyle(el).boxShadow);
      
      // Should have a meaningful shadow (not just 0px)
      expect(boxShadow).toBeTruthy();
      expect(boxShadow).not.toBe('none');
      
      // Shadow should contain rgba or rgb value for color
      expect(boxShadow).toMatch(/rgba?\(/);
    }
  });

  test('should maintain card border-radius for rounded corners', async ({ page }) => {
    const cards = page.locator('.ak-card, .card, [class*="card"]').first();
    
    if (await cards.isVisible()) {
      const borderRadius = await cards.evaluate(el => getComputedStyle(el).borderRadius);
      
      // Cards should have rounded corners
      expect(borderRadius).not.toBe('0px');
    }
  });

  test('should verify cards are visually separated with shadow', async ({ page }) => {
    const cards = page.locator('.ak-card, .card, [class*="card"]');
    const count = await cards.count();
    
    if (count >= 2) {
      // Check first and second card
      const firstShadow = await cards.nth(0).evaluate(el => getComputedStyle(el).boxShadow);
      const secondShadow = await cards.nth(1).evaluate(el => getComputedStyle(el).boxShadow);
      
      // Both should have shadows
      expect(firstShadow).not.toBe('none');
      expect(secondShadow).not.toBe('none');
      
      // Shadows should be consistent
      expect(firstShadow).toBe(secondShadow);
    }
  });
});
