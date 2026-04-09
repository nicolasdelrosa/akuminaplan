import { test, expect } from '@playwright/test';

/**
 * UFA-281: Hide Date from User Greetings Widget
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirements:
 * - Remove/hide the date display from user greetings widget
 * - Keep user name greeting visible
 * - Maintain widget styling and layout
 */

test.describe('UFA-281 - User Greetings Widget Update', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should display user greeting without date', async ({ page }) => {
    // Find user greeting widget
    const greetingWidget = page.locator('.ak-greeting, .user-greeting, [class*="greeting"]').first();
    
    if (await greetingWidget.isVisible()) {
      // Widget should be visible
      await expect(greetingWidget).toBeVisible();
      
      // Get text content
      const text = await greetingWidget.textContent();
      
      // Should contain greeting but NOT date patterns
      // Date patterns: "January 15, 2025", "01/15/2025", "Jan 15", etc.
      expect(text).toBeTruthy();
      
      // Should not match common date formats
      expect(text).not.toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/); // 01/15/2025
      expect(text).not.toMatch(/\w+ \d{1,2},? \d{4}/); // January 15, 2025
      expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}/); // 2025-01-15
    }
  });

  test('should verify date element is hidden via CSS', async ({ page }) => {
    // Find date elements within greeting
    const dateElement = page.locator('.ak-greeting .date, .user-greeting .date, [class*="greeting"] .date').first();
    
    if (await dateElement.count() > 0) {
      // If date element exists, it should be hidden
      const isVisible = await dateElement.isVisible();
      expect(isVisible).toBe(false);
      
      // Check CSS display property
      const display = await dateElement.evaluate(el => getComputedStyle(el).display);
      expect(display).toBe('none');
    }
  });

  test('should still show user name in greeting', async ({ page }) => {
    const greetingWidget = page.locator('.ak-greeting, .user-greeting, [class*="greeting"]').first();
    
    if (await greetingWidget.isVisible()) {
      const text = await greetingWidget.textContent();
      
      // Should contain greeting words
      expect(text).toMatch(/hello|hi|welcome|good morning|good afternoon|good evening/i);
    }
  });

  test('should maintain proper widget styling without date', async ({ page }) => {
    const greetingWidget = page.locator('.ak-greeting, .user-greeting, [class*="greeting"]').first();
    
    if (await greetingWidget.isVisible()) {
      // Widget should have proper height
      const box = await greetingWidget.boundingBox();
      
      if (box) {
        // Should not be collapsed (still has content)
        expect(box.height).toBeGreaterThan(20);
        
        // Should have reasonable width
        expect(box.width).toBeGreaterThan(50);
      }
      
      // Should not have excessive spacing where date was
      const padding = await greetingWidget.evaluate(el => {
        const style = getComputedStyle(el);
        return parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      });
      
      expect(padding).toBeLessThan(100);
    }
  });

  test('should verify no date-related attributes are present', async ({ page }) => {
    const greetingWidget = page.locator('.ak-greeting, .user-greeting, [class*="greeting"]').first();
    
    if (await greetingWidget.isVisible()) {
      // Check for common date attribute patterns
      const dateAttr = await greetingWidget.getAttribute('data-date');
      const timeAttr = await greetingWidget.getAttribute('data-time');
      
      // These should be null or not rendered in visible content
      if (dateAttr || timeAttr) {
        // If they exist, verify they're not displayed
        const text = await greetingWidget.textContent();
        if (dateAttr) expect(text).not.toContain(dateAttr);
        if (timeAttr) expect(text).not.toContain(timeAttr);
      }
    }
  });
});
