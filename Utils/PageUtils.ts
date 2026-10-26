import type {
  BrowserContext,
  Page,
  ScreenshotOptions,
} from '@playwright/test';

export async function waitForUrl(
  page: Page,
  url: string | RegExp,
  timeout?: number,
): Promise<void> {
  await page.waitForURL(url, { timeout });
}

export async function openNewTab(context: BrowserContext, url: string): Promise<Page> {
  const page = await context.newPage();
  await page.goto(url);
  return page;
}

export async function waitForPopup(
  page: Page,
  action: () => Promise<unknown>,
  timeout?: number,
): Promise<Page> {
  const [popup] = await Promise.all([
    page.waitForEvent('popup', { timeout }),
    action(),
  ]);
  return popup;
}

export async function takeScreenshot(
  page: Page,
  path: string,
  options: Omit<ScreenshotOptions, 'path'> = {},
): Promise<Buffer> {
  return page.screenshot({ ...options, path });
}
