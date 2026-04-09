const { chromium } = require('@playwright/test');

// Different credentials for different environments
const ENV_CONFIG = {
  dev: {
    url: 'https://cloud-dev-fe-jmsmucker.onakumina.com/',
    username: 'akumina@akbps.onmicrosoft.com',  // Update if dev uses different creds
    password: '603US@kud@1'
  },
  sandbox: {
    url: 'https://akbps-smuckers-sandbox-headless.onakumina.com/',
    username: 'akumina@akbps.onmicrosoft.com',
    password: '603US@kud@1'
  }
};

async function authenticateAndRunTests(environment = 'dev') {
  console.log(`\n=== Authenticating to ${environment.toUpperCase()} environment ===`);
  const config = ENV_CONFIG[environment];
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  try {
    console.log('Navigating to:', config.url);
    await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Check if authentication is needed
    if (page.url().includes('login.microsoftonline.com')) {
      console.log('Authentication required...');
      
      // Username
      const usernameField = page.locator("input[name='loginfmt']");
      if (await usernameField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Entering username...');
        await usernameField.fill(config.username);
        await page.locator("input[type='submit']").click();
        await page.waitForTimeout(2000);
      }
      
      // Password
      const passwordField = page.locator("input[name='passwd']");
      if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Entering password...');
        await passwordField.fill(config.password);
        await page.locator("input[type='submit']").click();
        await page.waitForTimeout(2000);
      }
      
      // Stay signed in
      const staySignedInBtn = page.locator("input[type='submit']");
      if (await staySignedInBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Staying signed in...');
        await staySignedInBtn.click();
      }
      
      console.log('Waiting for site to load...');
      await page.waitForTimeout(10000);
    } else {
      console.log('Already authenticated!');
    }
    
    console.log('\nCurrent URL:', page.url());
    console.log('Title:', await page.title());
    
    // Now run all tests
    await runAllTests(page, environment);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

async function runAllTests(page, environment) {
  console.log(`\n=== RUNNING ALL JMSMUC TESTS ON ${environment.toUpperCase()} ===\n`);
  
  const results = [];
  
  // JMSMUC-77: Simple Menu
  console.log('Testing JMSMUC-77...');
  const content = await page.content();
  const hasMeganav = content.toLowerCase().includes('meganav') || 
                     content.toLowerCase().includes('mega-nav') ||
                     content.toLowerCase().includes('megamenu');
  const nav = page.locator('nav, [role="navigation"]').first();
  const isNavVisible = await nav.isVisible().catch(() => false);
  const navLinks = page.locator('nav a, [role="navigation"] a, .menu a');
  const linkCount = await navLinks.count();
  
  results.push({
    ticket: 'JMSMUC-77',
    title: 'Simple Menu Navigation',
    tests: [
      { name: 'No meganav references', result: !hasMeganav },
      { name: 'Navigation visible', result: isNavVisible },
      { name: 'Navigation links present', result: linkCount > 0, info: `${linkCount} links` }
    ]
  });
  
  // JMSMUC-82: Branding
  console.log('Testing JMSMUC-82...');
  const logo = page.locator('img[alt*="logo" i], img[alt*="Company" i]').first();
  const hasLogo = await logo.isVisible({ timeout: 5000 }).catch(() => false);
  const logoSrc = hasLogo ? await logo.getAttribute('src') : '';
  const validLogo = logoSrc && !logoSrc.includes('placeholder');
  
  results.push({
    ticket: 'JMSMUC-82',
    title: 'Branding Consistency',
    tests: [
      { name: 'Company logo visible', result: hasLogo },
      { name: 'Logo has valid source', result: validLogo }
    ]
  });
  
  // JMSMUC-86: Footer Background
  console.log('Testing JMSMUC-86...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  const footer = page.locator('footer, [role="contentinfo"]').first();
  const hasFooter = await footer.isVisible({ timeout: 5000 }).catch(() => false);
  let footerBgColor = '';
  if (hasFooter) {
    footerBgColor = await footer.evaluate(el => window.getComputedStyle(el).backgroundColor);
  }
  
  results.push({
    ticket: 'JMSMUC-86',
    title: 'Footer Background Color',
    tests: [
      { name: 'Footer visible', result: hasFooter },
      { name: 'Background color set', result: footerBgColor && footerBgColor !== 'rgba(0, 0, 0, 0)' }
    ]
  });
  
  // JMSMUC-87: Footer Info
  console.log('Testing JMSMUC-87...');
  const footerText = hasFooter ? await footer.textContent() : '';
  
  results.push({
    ticket: 'JMSMUC-87',
    title: 'Footer Site Information',
    tests: [
      { name: 'Footer has content', result: footerText && footerText.length > 0 }
    ]
  });
  
  // JMSMUC-88: Search
  console.log('Testing JMSMUC-88...');
  await page.evaluate(() => window.scrollTo(0, 0));
  const searchBox = page.locator('input[type="search"], input[placeholder*="search" i], input[aria-label*="search" i]').first();
  const hasSearch = await searchBox.isVisible({ timeout: 5000 }).catch(() => false);
  
  results.push({
    ticket: 'JMSMUC-88',
    title: 'Search Box',
    tests: [
      { name: 'Search box visible', result: hasSearch }
    ]
  });
  
  // JMSMUC-89: Profile Picture
  console.log('Testing JMSMUC-89...');
  const profilePic = page.locator('img[alt*="profile" i], img[alt*="avatar" i], .user-avatar img, .profile-image').first();
  const hasProfilePic = await profilePic.isVisible({ timeout: 5000 }).catch(() => false);
  
  results.push({
    ticket: 'JMSMUC-89',
    title: 'Profile Picture in Menu',
    tests: [
      { name: 'Profile picture visible', result: hasProfilePic }
    ]
  });
  
  // JMSMUC-90: Default Images
  console.log('Testing JMSMUC-90...');
  const images = await page.locator('img').all();
  let hasDefaultAkuminaImages = false;
  for (const img of images.slice(0, 20)) {
    const src = await img.getAttribute('src');
    if (src && (src.includes('akumina-default') || src.includes('placeholder'))) {
      hasDefaultAkuminaImages = true;
      break;
    }
  }
  
  results.push({
    ticket: 'JMSMUC-90',
    title: 'Remove Default Akumina Images',
    tests: [
      { name: 'No default Akumina images', result: !hasDefaultAkuminaImages }
    ]
  });
  
  // JMSMUC-91: Branding Colors
  console.log('Testing JMSMUC-91...');
  const header = page.locator('header, [role="banner"]').first();
  const hasHeader = await header.isVisible().catch(() => false);
  
  results.push({
    ticket: 'JMSMUC-91',
    title: 'Update Branding Colors',
    tests: [
      { name: 'Header present', result: hasHeader }
    ]
  });
  
  // JMSMUC-92: Widgets
  console.log('Testing JMSMUC-92...');
  const widgets = page.locator('[class*="widget"], [data-widget]');
  const widgetCount = await widgets.count();
  
  results.push({
    ticket: 'JMSMUC-92',
    title: 'Remove Unnecessary Widgets',
    tests: [
      { name: 'Widget count reasonable', result: widgetCount < 50, info: `${widgetCount} widgets` }
    ]
  });
  
  // JMSMUC-93: Footer Links
  console.log('Testing JMSMUC-93...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const footerLinks = page.locator('footer a, [role="contentinfo"] a');
  const footerLinkCount = await footerLinks.count();
  
  results.push({
    ticket: 'JMSMUC-93',
    title: 'Update Footer Links',
    tests: [
      { name: 'Footer has links', result: footerLinkCount > 0, info: `${footerLinkCount} links` }
    ]
  });
  
  // JMSMUC-94: Title Branding
  console.log('Testing JMSMUC-94...');
  const pageTitle = await page.title();
  const hasBrandedTitle = !pageTitle.toLowerCase().includes('akumina');
  
  results.push({
    ticket: 'JMSMUC-94',
    title: 'Additional Branding Updates',
    tests: [
      { name: 'Page title branded', result: hasBrandedTitle, info: pageTitle }
    ]
  });
  
  // Print Summary
  console.log('\n\n=== TEST RESULTS SUMMARY ===\n');
  let totalTests = 0;
  let passedTests = 0;
  
  results.forEach(ticket => {
    const ticketPassed = ticket.tests.filter(t => t.result).length;
    const ticketTotal = ticket.tests.length;
    totalTests += ticketTotal;
    passedTests += ticketPassed;
    
    const status = ticketPassed === ticketTotal ? '✅ PASS' : ticketPassed > 0 ? '⚠️ PARTIAL' : '❌ FAIL';
    console.log(`${ticket.ticket}: ${ticket.title}`);
    console.log(`  Status: ${status} (${ticketPassed}/${ticketTotal})`);
    
    ticket.tests.forEach(test => {
      const icon = test.result ? '  ✅' : '  ❌';
      const info = test.info ? ` - ${test.info}` : '';
      console.log(`${icon} ${test.name}${info}`);
    });
    console.log('');
  });
  
  console.log('=========================');
  console.log(`OVERALL: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
  console.log('=========================\n');
}

// Get environment from command line or default to dev
const environment = process.argv[2] || 'dev';
authenticateAndRunTests(environment);
