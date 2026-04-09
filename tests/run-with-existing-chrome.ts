import { chromium } from '@playwright/test';

/**
 * Connect to existing Chrome session running with remote debugging
 * Usage: npx ts-node tests/run-with-existing-chrome.ts
 */
async function runTests() {
  // Connect to existing Chrome at localhost:9222
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  
  // Get the default context (your existing session with authentication)
  const contexts = browser.contexts();
  const context = contexts[0]; // Use the first context (your authenticated session)
  
  // Get existing pages or create a new one
  const pages = context.pages();
  const page = pages.length > 0 ? pages[0] : await context.newPage();
  
  console.log('Connected to Chrome. Current URL:', page.url());
  
  // Navigate to JM Smuckers dev site (should use your existing auth)
  await page.goto('https://cloud-dev-fe-jmsmucker.onakumina.com');
  await page.waitForLoadState('networkidle');
  
  console.log('Navigated to:', page.url());
  console.log('Page title:', await page.title());
  
  // Run JMSMUC-77 test validations
  console.log('\n--- Running JMSMUC-77 validations ---');
  
  // Test 1: Check for simple menu instead of meganav
  const content = await page.content();
  const hasMeganav = content.toLowerCase().includes('meganav') || 
                     content.toLowerCase().includes('mega-nav') || 
                     content.toLowerCase().includes('megamenu');
  
  console.log('✓ Has meganav:', hasMeganav ? '❌ FAIL (should be simple menu)' : '✅ PASS');
  
  // Test 2: Check navigation menu visibility
  const nav = page.locator('nav, [role="navigation"], .navigation, .menu').first();
  const isNavVisible = await nav.isVisible().catch(() => false);
  console.log('✓ Navigation visible:', isNavVisible ? '✅ PASS' : '❌ FAIL');
  
  // Test 3: Count navigation links
  const navLinks = page.locator('nav a, [role="navigation"] a, .menu a');
  const linkCount = await navLinks.count();
  console.log('✓ Navigation links:', linkCount, linkCount > 0 ? '✅ PASS' : '❌ FAIL');
  
  // Keep browser open (don't close the connection)
  console.log('\n✓ Tests complete. Browser remains open.');
  await browser.close();
}

runTests().catch(console.error);
