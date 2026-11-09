import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I open the Google search page', async ({ page }) => {
  await page.route('https://www.google.com/search**', async (route) => {
    const searchUrl = new URL(route.request().url());
    const query = searchUrl.searchParams.get('q') ?? '';
    const escapedQuery = query.replace(/[&<>"']/g, (character) =>
      `&#${character.charCodeAt(0)};`,
    );

    await route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><body><textarea name="q">${escapedQuery}</textarea></body></html>`,
    });
  });
  await page.goto('https://www.google.com');
});

When('I search for {string}', async ({ page }, searchText: string) => {
  const searchBox = page.locator('textarea[name="q"], input[name="q"]').first();
  await searchBox.fill(searchText);
  await searchBox.press('Enter');
  await expect(page).toHaveURL(/\/search\?/);
});

Then(
  'the Google search page should show the query {string}',
  async ({ page }, searchText: string) => {
    const searchBox = page.locator('textarea[name="q"], input[name="q"]').first();
    await expect(searchBox).toHaveValue(searchText);
    await expect(page).toHaveURL(/\/search\?/);
  },
);
