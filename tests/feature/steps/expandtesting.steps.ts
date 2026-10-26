import { expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createBdd } from 'playwright-bdd';

interface ExampleData {
  checkboxes: {
    route: string;
    initialStates: boolean[];
    toggleLabel: string;
  };
  dropdown: {
    route: string;
    optionLabel: string;
  };
  addRemoveElements: {
    route: string;
    addButton: string;
    deleteButton: string;
  };
  keyPresses: {
    route: string;
    key: string;
    result: string;
  };
  statusCodes: {
    route: string;
    statusCode: string;
    responseText: string;
  };
  tables: {
    route: string;
    email: string;
    rowText: string;
  };
  hovers: {
    route: string;
    profileIndex: number;
    profileLink: string;
  };
  dynamicControls: {
    route: string;
    removeButton: string;
    removedMessage: string;
  };
  dynamicLoading: {
    route: string;
    startButton: string;
    loadedMessage: string;
  };
  notificationMessage: {
    route: string;
    reloadLink: string;
    messages: string[];
  };
}

const exampleData = JSON.parse(
  readFileSync(join(process.cwd(), 'Data', 'expandtesting.json'), 'utf8'),
) as ExampleData;

type ExampleName = keyof ExampleData;

function isExampleName(name: string): name is ExampleName {
  return Object.hasOwn(exampleData, name);
}

const { Given, When, Then } = createBdd();

Given('I open the {string} example page', async ({ page }, name: string) => {
  if (!isExampleName(name)) {
    throw new Error(`No Expand Testing data is configured for example "${name}".`);
  }

  await page.goto(exampleData[name].route);
});

Then('the default checkbox states should match the JSON data', async ({ page }) => {
  for (const [index, checked] of exampleData.checkboxes.initialStates.entries()) {
    await expect(
      page.getByRole('checkbox', { name: `Checkbox ${index + 1}` }),
    ).toBeChecked({ checked });
  }
});

When('I select the configured checkbox', async ({ page }) => {
  await page.getByRole('checkbox', { name: exampleData.checkboxes.toggleLabel }).check();
});

Then('the configured checkbox should be selected', async ({ page }) => {
  await expect(
    page.getByRole('checkbox', { name: exampleData.checkboxes.toggleLabel }),
  ).toBeChecked();
});

When('I choose the configured dropdown option', async ({ page }) => {
  const dropdown = page.locator('select').first();
  await dropdown.selectOption({ label: exampleData.dropdown.optionLabel });
});

Then('the configured dropdown option should be selected', async ({ page }) => {
  await expect(
    page.locator('select').first().locator('option:checked'),
  ).toHaveText(exampleData.dropdown.optionLabel);
});

When('I add an element', async ({ page }) => {
  await page.getByRole('button', { name: exampleData.addRemoveElements.addButton }).click();
});

Then('the configured delete button should be visible', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: exampleData.addRemoveElements.deleteButton }),
  ).toBeVisible();
});

When('I remove the added element', async ({ page }) => {
  await page.getByRole('button', { name: exampleData.addRemoveElements.deleteButton }).click();
});

Then('no delete button should remain', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: exampleData.addRemoveElements.deleteButton }),
  ).toHaveCount(0);
});

When('I press the configured key', async ({ page }) => {
  await page.locator('#target').press(exampleData.keyPresses.key);
});

Then('the configured key result should be displayed', async ({ page }) => {
  await expect(page.getByText(exampleData.keyPresses.result, { exact: true })).toBeVisible();
});

Then('the configured status code response should be displayed', async ({ page }) => {
  await expect(page).toHaveURL(new RegExp(`/status-codes/${exampleData.statusCodes.statusCode}$`));
  await expect(page.getByText(exampleData.statusCodes.responseText, { exact: false })).toBeVisible();
});

Then('the configured table row should be displayed', async ({ page }) => {
  const row = page
    .getByRole('row')
    .filter({ hasText: exampleData.tables.email })
    .first();
  await expect(row).toContainText(exampleData.tables.rowText);
});

When('I hover over the configured profile', async ({ page }) => {
  await page
    .getByRole('img', { name: 'User Avatar' })
    .nth(exampleData.hovers.profileIndex)
    .hover();
});

Then('the configured profile link should be visible', async ({ page }) => {
  await expect(
    page.getByRole('link', { name: exampleData.hovers.profileLink }).first(),
  ).toBeVisible();
});

When('I remove the checkbox', async ({ page }) => {
  await page.getByRole('button', { name: exampleData.dynamicControls.removeButton }).click();
});

Then('the configured checkbox removal message should be displayed', async ({ page }) => {
  await expect(page.getByText(exampleData.dynamicControls.removedMessage)).toBeVisible();
});

When('I start loading the hidden content', async ({ page }) => {
  await page.getByRole('button', { name: exampleData.dynamicLoading.startButton }).click();
});

Then('the configured loaded message should be displayed', async ({ page }) => {
  await expect(
    page.getByText(exampleData.dynamicLoading.loadedMessage),
  ).toBeVisible({ timeout: 15_000 });
});

When('I reload the notification message', async ({ page }) => {
  await page.getByRole('link', { name: exampleData.notificationMessage.reloadLink }).click();
});

Then('a configured notification message should be displayed', async ({ page }) => {
  const configuredMessages = new RegExp(
    exampleData.notificationMessage.messages
      .map((message) => message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|'),
  );
  await expect(page.locator('b').filter({ hasText: configuredMessages }).first()).toBeVisible();
});
