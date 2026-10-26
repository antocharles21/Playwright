import type { Download, Page, Response } from '@playwright/test';

type ResponsePredicate = string | RegExp | ((response: Response) => boolean | Promise<boolean>);

export async function waitForResponse(
  page: Page,
  predicate: ResponsePredicate,
  action: () => Promise<unknown>,
  timeout?: number,
): Promise<Response> {
  const [response] = await Promise.all([
    page.waitForResponse(predicate, { timeout }),
    action(),
  ]);
  return response;
}

export async function waitForDownload(
  page: Page,
  action: () => Promise<unknown>,
  timeout?: number,
): Promise<Download> {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout }),
    action(),
  ]);
  return download;
}
