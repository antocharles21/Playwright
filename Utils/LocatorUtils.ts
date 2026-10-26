import type { Locator } from '@playwright/test';

export type LocatorState = 'attached' | 'detached' | 'visible' | 'hidden';

export async function waitForState(
  locator: Locator,
  state: LocatorState = 'visible',
  timeout?: number,
): Promise<void> {
  await locator.waitFor({ state, timeout });
}

export async function getText(locator: Locator): Promise<string> {
  await locator.waitFor({ state: 'visible' });
  return locator.innerText();
}

export async function setChecked(locator: Locator, checked: boolean): Promise<void> {
  if ((await locator.isChecked()) !== checked) {
    await locator.setChecked(checked);
  }
}

export async function selectOptionByLabel(locator: Locator, label: string): Promise<void> {
  await locator.selectOption({ label });
}
