import { expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { createBdd } from 'playwright-bdd';
import { ForgotPasswordPage } from '../../../Pages/ForgotPasswordPage';
import { InputsPage } from '../../../Pages/InputsPage';
import { RegisterPage } from '../../../Pages/RegisterPage';
import { test } from './login-page.fixture';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When(
  'I log in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  },
);

Then('I should reach the secure area', async ({ page }) => {
  await expect(page).toHaveURL(/\/secure$/);
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Secure Area page for Automation Testing Practice',
    }),
  ).toBeVisible();
});

Then('I should see the invalid login error', async ({ loginPage }) => {
  await expect(loginPage.alert).toContainText('Your username is invalid!');
});

Then('I should remain on the login page', async ({ page }) => {
  await expect(page).toHaveURL(/\/login$/);
});

Given('I am on the registration page', async ({ page }) => {
  await new RegisterPage(page).goto();
});

When(
  'I register with a unique username and password {string}',
  async ({ page }, password: string) => {
    const username = `bdduser${randomUUID().replace(/-/g, '')}`;
    await new RegisterPage(page).register(username, password, password);
  },
);

Then('I should see the registration success message', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await expect(page).toHaveURL(/\/login$/);
  await expect(registerPage.alert).toContainText(
    'Successfully registered, you can log in now.',
  );
});

Given('I am on the forgot password page', async ({ page }) => {
  await new ForgotPasswordPage(page).goto();
});

When('I request a password reset for {string}', async ({ page }, email: string) => {
  await new ForgotPasswordPage(page).requestReset(email);
});

Then('I should see the password reset confirmation', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Password reset page/i })).toBeVisible();
  await expect(
    page.getByText('An e-mail has been sent to you which explains how to reset your password.'),
  ).toBeVisible();
});

Given('I am on the web inputs page', async ({ page }) => {
  await new InputsPage(page).goto();
});

When('I enter sample web input values', async ({ page }) => {
  await new InputsPage(page).fillInputs({
    number: '42',
    text: 'Playwright automation',
    password: 'TestPassword123!',
    date: '2026-10-17',
  });
});

When('I display the web input values', async ({ page }) => {
  await new InputsPage(page).displayInputs();
});

Then('the displayed values should match the entered values', async ({ page }) => {
  await expect(new InputsPage(page).outputValues).toHaveText([
    '42',
    'Playwright automation',
    'TestPassword123!',
    '2026-10-17',
  ]);
});

When('I clear the web inputs', async ({ page }) => {
  await new InputsPage(page).clearInputs();
});

Then('all web input fields and displayed values should be empty', async ({ page }) => {
  const inputsPage = new InputsPage(page);
  await expect(inputsPage.numberInput).toHaveValue('');
  await expect(inputsPage.textInput).toHaveValue('');
  await expect(inputsPage.passwordInput).toHaveValue('');
  await expect(inputsPage.dateInput).toHaveValue('');
  await expect(inputsPage.outputValues).toHaveCount(0);
});
