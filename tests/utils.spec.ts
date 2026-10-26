import { expect, test } from '@playwright/test';
import {
  getText,
  openNewTab,
  selectOptionByLabel,
  setChecked,
  takeScreenshot,
  waitForResponse,
  waitForDownload,
  waitForPopup,
  waitForState,
  waitForUrl,
} from '../Utils';

test('locator helpers read text and set form controls', async ({ page }) => {
  await page.setContent(`
    <p id="message">Ready</p>
    <input id="accepted" type="checkbox">
    <select id="choice"><option>First</option><option>Second</option></select>
  `);

  const message = page.locator('#message');
  await waitForState(message);
  expect(await getText(message)).toBe('Ready');

  const checkbox = page.locator('#accepted');
  await setChecked(checkbox, true);
  expect(await checkbox.isChecked()).toBe(true);

  const select = page.locator('#choice');
  await selectOptionByLabel(select, 'Second');
  expect(await select.inputValue()).toBe('Second');
});

test('page and network helpers wait for navigation and response', async ({ page }) => {
  await page.route('https://example.com/api/data', (route) =>
    route.fulfill({ status: 200, body: 'ok' }),
  );

  const response = await waitForResponse(
    page,
    (candidate) => candidate.url() === 'https://example.com/api/data',
    async () => {
      await page.goto('https://example.com/api/data');
    },
  );

  expect(response.status()).toBe(200);
  await waitForUrl(page, 'https://example.com/api/data');
});

test('tab, popup, screenshot, and download helpers', async ({ page, context }, testInfo) => {
  await context.route('https://example.test/**', async (route) => {
    if (route.request().url().endsWith('/download')) {
      await route.fulfill({
        body: 'download content',
        headers: {
          'content-disposition': 'attachment; filename="example.txt"',
          'content-type': 'text/plain',
        },
      });
      return;
    }

    await route.fulfill({
      body: `
        <button onclick="window.open('/popup')">Open popup</button>
        <a href="/download">Download file</a>
      `,
      contentType: 'text/html',
    });
  });

  await page.goto('https://example.test/start');

  const popup = await waitForPopup(
    page,
    () => page.getByRole('button', { name: 'Open popup' }).click(),
  );
  await expect(popup).toHaveURL('https://example.test/popup');

  const secondTab = await openNewTab(context, 'https://example.test/second');
  await expect(secondTab).toHaveURL('https://example.test/second');

  const screenshot = await takeScreenshot(page, testInfo.outputPath('page.png'));
  expect(screenshot.length).toBeGreaterThan(0);

  const download = await waitForDownload(
    page,
    () => page.getByRole('link', { name: 'Download file' }).click(),
  );
  expect(download.suggestedFilename()).toBe('example.txt');
});
