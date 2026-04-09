const { chromium } = require('@playwright/test');

async function compareSites() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  // Check dev site (current page)
  console.log('=== DEV SITE ===');
  console.log('URL:', page.url());
  let content = await page.content();
  let hasMeganav = content.toLowerCase().includes('meganav') || 
                   content.toLowerCase().includes('mega-nav') ||
                   content.toLowerCase().includes('megamenu');
  console.log('Has meganav:', hasMeganav ? 'YES ❌' : 'NO ✅');
  
  // Navigate to sandbox site
  console.log('\n=== SANDBOX SITE ===');
  await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com', { waitUntil: 'networkidle' });
  console.log('URL:', page.url());
  
  content = await page.content();
  hasMeganav = content.toLowerCase().includes('meganav') || 
               content.toLowerCase().includes('mega-nav') ||
               content.toLowerCase().includes('megamenu');
  console.log('Has meganav:', hasMeganav ? 'YES ❌' : 'NO ✅');
  
  // Count meganav references
  const lines = content.split('\n');
  const meganavLines = lines.filter(line => 
    line.toLowerCase().includes('meganav') || 
    line.toLowerCase().includes('mega-nav') ||
    line.toLowerCase().includes('megamenu')
  );
  
  console.log(`\nFound ${meganavLines.length} meganav references in sandbox`);
  if (meganavLines.length > 0) {
    console.log('\nSample references:');
    meganavLines.slice(0, 3).forEach((line, i) => {
      console.log(`${i + 1}. ${line.trim().substring(0, 120)}...`);
    });
  }
  
  await browser.close();
}

compareSites();
