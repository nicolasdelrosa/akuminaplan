const { chromium } = require('@playwright/test');

async function checkCurrentPageAndTest() {
  console.log('Connecting to Chrome...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  console.log('\nCurrent URL:', page.url());
  console.log('Title:', await page.title());
  
  console.log('\nPlease navigate to the JM Smuckers dev site homepage in your authenticated browser.');
  console.log('Once there, run this script again with: node tests/run-all-jmsmuc-tests.js');
  
  await browser.close();
}

checkCurrentPageAndTest();
