import { expect, test } from '@playwright/test';

test('Google home page has Google in its title', async ({ page }) => {
  await page.goto('https://www.google.com/');

  await expect(page).toHaveTitle(/Google/);
});