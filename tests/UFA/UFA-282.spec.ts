import { test, expect } from '@playwright/test';

/**
 * UFA-282: Reduce the height of the Banner Carousel View on the homepage
 * Type: Task
 * Priority: Medium
 * Status: Ready to Deploy
 * 
 * Requirement: Reduce the size of images within the slick slider track of the Banner Carousel
 * to be only 300px tall. Also reduce any additional unused space.
 */

test.describe('UFA-282 - Banner Carousel Height Reduction', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
    await page.waitForLoadState('networkidle');
  });

  test('should verify banner carousel images are 300px tall', async ({ page }) => {
    // Locate the banner carousel on homepage
    const carousel = page.locator('.banner-carousel, .slick-slider, [class*="banner"][class*="carousel"]').first();
    
    // Wait for carousel to be visible
    await expect(carousel).toBeVisible({ timeout: 10000 });
    
    // Find images within the carousel
    const carouselImages = carousel.locator('img, .slick-slide img');
    const imageCount = await carouselImages.count();
    
    expect(imageCount).toBeGreaterThan(0);
    
    // Check the first visible image height
    const firstImage = carouselImages.first();
    const boundingBox = await firstImage.boundingBox();
    
    if (boundingBox) {
      // Height should be approximately 300px (allow small variance for rendering)
      expect(boundingBox.height).toBeLessThanOrEqual(320);
      expect(boundingBox.height).toBeGreaterThanOrEqual(280);
    }
  });

  test('should verify banner carousel has minimal unused space', async ({ page }) => {
    const carousel = page.locator('.banner-carousel, .slick-slider, [class*="banner"][class*="carousel"]').first();
    await expect(carousel).toBeVisible({ timeout: 10000 });
    
    // Get carousel container height
    const carouselBox = await carousel.boundingBox();
    
    if (carouselBox) {
      // Total carousel height should be close to 300px (with minimal padding)
      // Allow for controls and small margins (max ~50px extra)
      expect(carouselBox.height).toBeLessThanOrEqual(350);
    }
  });

  test('should verify slick-track height is reduced', async ({ page }) => {
    // Check if slick-track element has proper height
    const slickTrack = page.locator('.slick-track').first();
    
    if (await slickTrack.isVisible()) {
      const trackBox = await slickTrack.boundingBox();
      
      if (trackBox) {
        // Slick track should be approximately 300px
        expect(trackBox.height).toBeLessThanOrEqual(320);
      }
    }
  });
});
