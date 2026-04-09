const { chromium } = require('@playwright/test');

async function checkCurrentPage() {
  console.log('Connecting to Chrome...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  console.log('\n=== Current Page ===');
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  const content = await page.content();
  const hasMeganav = content.toLowerCase().includes('meganav') || 
                     content.toLowerCase().includes('mega-nav') ||
                     content.toLowerCase().includes('megamenu');
  
  console.log('\nHas meganav:', hasMeganav ? 'YES ❌' : 'NO ✅');
  
  if (hasMeganav) {
    const lines = content.split('\n');
    const meganavLines = lines.filter(line => 
      line.toLowerCase().includes('meganav') || 
      line.toLowerCase().includes('mega-nav') ||
      line.toLowerCase().includes('megamenu')
    );
    console.log(`Found ${meganavLines.length} meganav references`);
  }
  
  await browser.close();
}

checkCurrentPage();
