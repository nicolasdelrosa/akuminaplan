const { chromium } = require('@playwright/test');

/**
 * Connect to existing Chrome session running with remote debugging
 * Usage: node tests/run-with-existing-chrome.js
 */
async function runTests() {
  console.log('Connecting to Chrome at http://localhost:9222...');
  
  try {
    // Connect to existing Chrome at localhost:9222
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    
    // Get the default context (your existing session with authentication)
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      console.error('No browser contexts found');
      return;
    }
    
    const context = contexts[0]; // Use the first context (your authenticated session)
    
    // Get existing pages or create a new one
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();
    
    console.log('✓ Connected to Chrome. Current URL:', page.url());
    
    // Navigate to JM Smuckers dev site (should use your existing auth)
    console.log('\nNavigating to JM Smuckers dev site...');
    await page.goto('https://cloud-dev-fe-jmsmucker.onakumina.com', { waitUntil: 'networkidle' });
    
    console.log('✓ Navigated to:', page.url());
    console.log('✓ Page title:', await page.title());
    
    // Run JMSMUC-77 test validations
    console.log('\n=== Running JMSMUC-77 validations ===\n');
    
    // Test 1: Check for simple menu instead of meganav
    const content = await page.content();
    const hasMeganav = content.toLowerCase().includes('meganav') || 
                       content.toLowerCase().includes('mega-nav') || 
                       content.toLowerCase().includes('megamenu');
    
    console.log('Test 1 - Simple menu (no meganav):', hasMeganav ? '❌ FAIL' : '✅ PASS');
    
    // Test 2: Check navigation menu visibility
    const nav = page.locator('nav, [role="navigation"], .navigation, .menu').first();
    const isNavVisible = await nav.isVisible().catch(() => false);
    console.log('Test 2 - Navigation visible:', isNavVisible ? '✅ PASS' : '❌ FAIL');
    
    // Test 3: Count navigation links
    const navLinks = page.locator('nav a, [role="navigation"] a, .menu a');
    const linkCount = await navLinks.count();
    console.log('Test 3 - Navigation links (' + linkCount + '):', linkCount > 0 ? '✅ PASS' : '❌ FAIL');
    
    // List first few nav links
    if (linkCount > 0) {
      console.log('\nNavigation links found:');
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const text = await link.textContent();
        console.log('  -', text?.trim());
      }
    }
    
    console.log('\n✓ Tests complete. Browser remains open.');
    
    // Don't close browser - leave it for the user
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runTests();
