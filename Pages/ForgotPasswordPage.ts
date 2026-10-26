import type { Locator, Page } from '@playwright/test';

export class ForgotPasswordPage {
  readonly emailInput: Locator;
  readonly retrievePasswordButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'E-mail' });
    this.retrievePasswordButton = page.getByRole('button', { name: 'Retrieve password' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
  }

  async requestReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.retrievePasswordButton.click();
  }
}
