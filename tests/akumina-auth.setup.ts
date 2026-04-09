import { test as setup } from '@playwright/test';

const authFile = 'tests/playwright/.auth/akumina-user.json';

setup('authenticate-akumina', async ({ page }) => {
  // Navigate to akumina site which will redirect to Microsoft login
  await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
  
  // Wait for redirect to Microsoft login
  await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 10000 });
  
  // Perform authentication steps
  await page.getByRole('textbox', { name: 'Enter your email, phone, or Skype.' }).click();
  await page.getByRole('textbox', { name: 'Enter your email, phone, or Skype.' }).fill('akumina@akbps.onmicrosoft.com');
  await page.getByRole('button', { name: 'Next' }).click();
  
  await page.getByRole('textbox', { name: 'Enter the password for' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for' }).fill('603US@kud@1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Handle "Stay signed in" prompt
  await page.getByRole('checkbox', { name: 'Don\'t show this again' }).check();
  await page.getByRole('button', { name: 'Yes' }).click();
  
  // Wait for successful redirect back to akumina site
  await page.waitForURL('**/akbps-ufa-sandbox**', { timeout: 15000 });
  
  // Wait a bit for the page to fully load after authentication
  await page.waitForLoadState('networkidle');
  
  // Save signed-in state to authFile
  await page.context().storageState({ path: authFile });
  
  console.log('✓ Akumina authentication completed and saved to:', authFile);
});
