const { chromium } = require('@playwright/test');

// Using credentials from authenticate.js
const CREDENTIALS = {
  username: "akumina@akbps.onmicrosoft.com",
  password: "603US@kud@1",
  sandboxUrl: "https://akbps-smuckers-sandbox-headless.onakumina.com/"
};

async function authenticateAndCheck() {
  console.log('Connecting to Chrome...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  try {
    console.log('\n=== Navigating to Sandbox Site ===');
    await page.goto(CREDENTIALS.sandboxUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Current URL:', page.url());
    
    // Check if we're on login page
    if (page.url().includes('login.microsoftonline.com')) {
      console.log('\n=== Authenticating ===');
      
      // Wait a moment for page to load
      await page.waitForTimeout(2000);
      
      // Enter username (if field exists)
      const usernameField = page.locator('input[name="loginfmt"]');
      if (await usernameField.isVisible().catch(() => false)) {
        console.log('Entering username...');
        await usernameField.fill(CREDENTIALS.username);
        await page.click('input[type="submit"]');
        await page.waitForTimeout(2000);
      }
      
      // Enter password (if field exists)
      const passwordField = page.locator('input[name="passwd"]');
      if (await passwordField.isVisible().catch(() => false)) {
        console.log('Entering password...');
        await passwordField.fill(CREDENTIALS.password);
        await page.click('input[type="submit"]');
        await page.waitForTimeout(2000);
      }
      
      // Handle "Stay signed in?"
      console.log('Handling stay signed in prompt...');
      await page.waitForTimeout(2000);
      const staySignedInButton = page.locator('input[type="submit"]').first();
      if (await staySignedInButton.isVisible().catch(() => false)) {
        await staySignedInButton.click();
      }
      
      // Wait for navigation back to Akumina
      console.log('Waiting for redirect to Akumina...');
      await page.waitForURL('**/akbps-smuckers-sandbox**', { timeout: 30000 });
      await page.waitForLoadState('networkidle');
      console.log('✓ Authentication successful!');
    } else {
      console.log('✓ Already authenticated');
    }
    
    console.log('\n=== Checking Sandbox Site ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    const content = await page.content();
    const hasMeganav = content.toLowerCase().includes('meganav') || 
                       content.toLowerCase().includes('mega-nav') ||
                       content.toLowerCase().includes('megamenu');
    
    console.log('Has meganav:', hasMeganav ? 'YES ❌' : 'NO ✅');
    
    if (hasMeganav) {
      const lines = content.split('\n');
      const meganavLines = lines.filter(line => 
        line.toLowerCase().includes('meganav') || 
        line.toLowerCase().includes('mega-nav') ||
        line.toLowerCase().includes('megamenu')
      );
      console.log(`Found ${meganavLines.length} meganav references`);
      console.log('\nSample:');
      meganavLines.slice(0, 2).forEach((line, i) => {
        console.log(`${i + 1}. ${line.trim().substring(0, 100)}...`);
      });
    }
    
    // Run navigation checks
    console.log('\n=== Navigation Tests ===');
    const nav = page.locator('nav, [role="navigation"], .navigation, .menu').first();
    const isNavVisible = await nav.isVisible().catch(() => false);
    console.log('Navigation visible:', isNavVisible ? '✅ PASS' : '❌ FAIL');
    
    const navLinks = page.locator('nav a, [role="navigation"] a, .menu a');
    const linkCount = await navLinks.count();
    console.log('Navigation links:', linkCount, linkCount > 0 ? '✅ PASS' : '❌ FAIL');
    
    if (linkCount > 0) {
      console.log('\nFirst 5 navigation links:');
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const text = await link.textContent();
        console.log(`  - ${text?.trim()}`);
      }
    }
    
    console.log('\n✓ Complete. Browser remains open.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

authenticateAndCheck();
