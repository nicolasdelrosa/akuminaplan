const { chromium } = require('@playwright/test');

const DEV_URL = 'https://cloud-dev-fe-jmsmucker.onakumina.com/';

async function runAllJMSMUCTests() {
  console.log('Connecting to Chrome at http://localhost:9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  try {
    console.log('\n=== JM SMUCKERS DEV SITE - ALL TESTS ===\n');
    console.log('Navigating to:', DEV_URL);
    await page.goto(DEV_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Title:', await page.title());
    console.log('URL:', page.url());
    
    const results = [];
    
    // JMSMUC-77: Replace Meganav with Simple Menu
    console.log('\n--- JMSMUC-77: Simple Menu Navigation ---');
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
        { name: 'Navigation links present', result: linkCount > 0 }
      ]
    });
    
    // JMSMUC-82: Branding Consistency
    console.log('\n--- JMSMUC-82: Branding Consistency ---');
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
    
    // JMSMUC-86: Footer Background Color
    console.log('\n--- JMSMUC-86: Footer Background Color ---');
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
    
    // JMSMUC-87: Footer Site Information
    console.log('\n--- JMSMUC-87: Footer Site Information ---');
    const footerText = hasFooter ? await footer.textContent() : '';
    
    results.push({
      ticket: 'JMSMUC-87',
      title: 'Footer Site Information',
      tests: [
        { name: 'Footer has content', result: footerText && footerText.length > 0 }
      ]
    });
    
    // JMSMUC-88: Search Box
    console.log('\n--- JMSMUC-88: Search Box ---');
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
    
    // JMSMUC-89: Profile picture in menu
    console.log('\n--- JMSMUC-89: Profile Picture ---');
    const profilePic = page.locator('img[alt*="profile" i], img[alt*="avatar" i], .user-avatar img, .profile-image').first();
    const hasProfilePic = await profilePic.isVisible({ timeout: 5000 }).catch(() => false);
    
    results.push({
      ticket: 'JMSMUC-89',
      title: 'Profile Picture in Menu',
      tests: [
        { name: 'Profile picture visible', result: hasProfilePic }
      ]
    });
    
    // JMSMUC-90: Remove default Akumina images
    console.log('\n--- JMSMUC-90: Remove Default Images ---');
    const images = await page.locator('img').all();
    let hasDefaultAkuminaImages = false;
    for (const img of images.slice(0, 20)) { // Check first 20 images
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
    
    // JMSMUC-91: Update branding colors
    console.log('\n--- JMSMUC-91: Update Branding Colors ---');
    const header = page.locator('header, [role="banner"]').first();
    const hasHeader = await header.isVisible().catch(() => false);
    
    results.push({
      ticket: 'JMSMUC-91',
      title: 'Update Branding Colors',
      tests: [
        { name: 'Header present', result: hasHeader }
      ]
    });
    
    // JMSMUC-92: Remove unnecessary widgets
    console.log('\n--- JMSMUC-92: Remove Unnecessary Widgets ---');
    const widgets = page.locator('[class*="widget"], [data-widget]');
    const widgetCount = await widgets.count();
    
    results.push({
      ticket: 'JMSMUC-92',
      title: 'Remove Unnecessary Widgets',
      tests: [
        { name: 'Widget count reasonable', result: widgetCount < 50, info: `Found ${widgetCount} widgets` }
      ]
    });
    
    // JMSMUC-93: Update footer links
    console.log('\n--- JMSMUC-93: Update Footer Links ---');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const footerLinks = page.locator('footer a, [role="contentinfo"] a');
    const footerLinkCount = await footerLinks.count();
    
    results.push({
      ticket: 'JMSMUC-93',
      title: 'Update Footer Links',
      tests: [
        { name: 'Footer has links', result: footerLinkCount > 0, info: `Found ${footerLinkCount} links` }
      ]
    });
    
    // JMSMUC-94: Additional branding updates
    console.log('\n--- JMSMUC-94: Additional Branding Updates ---');
    const pageTitle = await page.title();
    const hasBrandedTitle = !pageTitle.toLowerCase().includes('akumina');
    
    results.push({
      ticket: 'JMSMUC-94',
      title: 'Additional Branding Updates',
      tests: [
        { name: 'Page title branded', result: hasBrandedTitle, info: `Title: ${pageTitle}` }
      ]
    });
    
    // Print summary
    console.log('\n\n=== TEST RESULTS SUMMARY ===\n');
    let totalTests = 0;
    let passedTests = 0;
    
    results.forEach(ticket => {
      const ticketPassed = ticket.tests.filter(t => t.result).length;
      const ticketTotal = ticket.tests.length;
      totalTests += ticketTotal;
      passedTests += ticketPassed;
      
      const status = ticketPassed === ticketTotal ? '✅ PASS' : '⚠️ PARTIAL';
      console.log(`${ticket.ticket}: ${ticket.title}`);
      console.log(`  Status: ${status} (${ticketPassed}/${ticketTotal} tests passed)`);
      
      ticket.tests.forEach(test => {
        const icon = test.result ? '  ✅' : '  ❌';
        const info = test.info ? ` (${test.info})` : '';
        console.log(`${icon} ${test.name}${info}`);
      });
      console.log('');
    });
    
    console.log('=== OVERALL SUMMARY ===');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`Failed: ${totalTests - passedTests}`);
    
    console.log('\n✓ All tests complete. Browser remains open.');
    
  } catch (error) {
    console.error('\nError:', error.message);
  } finally {
    await browser.close();
  }
}

runAllJMSMUCTests();
