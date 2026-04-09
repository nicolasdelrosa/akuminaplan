const { chromium } = require('@playwright/test');

// Using credentials from authenticate.js
const AUTH_CONFIG = {
  username: "akumina@akbps.onmicrosoft.com",
  password: "603US@kud@1",
  sandboxUrl: "https://akbps-smuckers-sandbox-headless.onakumina.com/"
};

async function authenticateAndTest() {
  console.log('Connecting to Chrome at http://localhost:9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  try {
    console.log('\n=== Navigating to Sandbox Site ===');
    await page.goto(AUTH_CONFIG.sandboxUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('URL:', page.url());
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if on Microsoft login page
    if (page.url().includes('login.microsoftonline.com')) {
      console.log('\n=== Authenticating ===');
      
      // Enter username
      const usernameField = page.locator("input[name='loginfmt']");
      if (await usernameField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Entering username...');
        await usernameField.fill(AUTH_CONFIG.username);
        await page.locator("input[type='submit']").click();
        await page.waitForTimeout(2000);
      }
      
      // Enter password
      const passwordField = page.locator("input[name='passwd']");
      if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Entering password...');
        await passwordField.fill(AUTH_CONFIG.password);
        await page.locator("input[type='submit']").click();
        await page.waitForTimeout(2000);
      }
      
      // Handle "Stay signed in?" prompt
      const staySignedInBtn = page.locator("input[type='submit']");
      if (await staySignedInBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Clicking "Yes" to stay signed in...');
        await staySignedInBtn.click();
      }
      
      // Wait for redirect
      console.log('Waiting for redirect to Akumina...');
      await page.waitForTimeout(10000);
    }
    
    console.log('\n=== Running JMSMUC-77 Tests on Sandbox ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    // Test 1: Check for meganav
    const content = await page.content();
    const hasMeganav = content.toLowerCase().includes('meganav') || 
                       content.toLowerCase().includes('mega-nav') ||
                       content.toLowerCase().includes('megamenu');
    
    console.log('\nTest 1 - Simple menu (no meganav):', hasMeganav ? '❌ FAIL' : '✅ PASS');
    
    if (hasMeganav) {
      const lines = content.split('\n');
      const meganavLines = lines.filter(line => 
        line.toLowerCase().includes('meganav') || 
        line.toLowerCase().includes('mega-nav') ||
        line.toLowerCase().includes('megamenu')
      );
      console.log(`  Found ${meganavLines.length} meganav references`);
    }
    
    // Test 2: Navigation visible
    const nav = page.locator('nav, [role="navigation"], .navigation, .menu').first();
    const isNavVisible = await nav.isVisible().catch(() => false);
    console.log('Test 2 - Navigation visible:', isNavVisible ? '✅ PASS' : '❌ FAIL');
    
    // Test 3: Navigation links
    const navLinks = page.locator('nav a, [role="navigation"] a, .menu a');
    const linkCount = await navLinks.count();
    console.log('Test 3 - Navigation links (' + linkCount + '):', linkCount > 0 ? '✅ PASS' : '❌ FAIL');
    
    if (linkCount > 0) {
      console.log('\nNavigation links found:');
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const text = await link.textContent();
        console.log('  -', text?.trim());
      }
    }
    
    console.log('\n✓ Tests complete. Browser remains open.');
    
  } catch (error) {
    console.error('\nError:', error.message);
  } finally {
    await browser.close();
  }
}

authenticateAndTest();
