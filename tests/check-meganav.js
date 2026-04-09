const { chromium } = require('@playwright/test');

async function checkMeganav() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  const content = await page.content();
  
  // Search for meganav references
  const lines = content.split('\n');
  const meganavLines = lines.filter(line => 
    line.toLowerCase().includes('meganav') || 
    line.toLowerCase().includes('mega-nav') ||
    line.toLowerCase().includes('megamenu')
  );
  
  console.log(`Found ${meganavLines.length} lines containing meganav references:\n`);
  meganavLines.slice(0, 10).forEach((line, i) => {
    console.log(`${i + 1}. ${line.trim().substring(0, 150)}`);
  });
  
  if (meganavLines.length > 10) {
    console.log(`\n... and ${meganavLines.length - 10} more lines`);
  }
  
  await browser.close();
}

checkMeganav();
