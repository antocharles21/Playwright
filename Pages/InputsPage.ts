import type { Locator, Page } from '@playwright/test';

export interface InputValues {
  number: string;
  text: string;
  password: string;
  date: string;
}

export class InputsPage {
  readonly numberInput: Locator;
  readonly textInput: Locator;
  readonly passwordInput: Locator;
  readonly dateInput: Locator;
  readonly displayButton: Locator;
  readonly clearButton: Locator;
  readonly outputValues: Locator;

  constructor(private readonly page: Page) {
    this.numberInput = page.getByRole('spinbutton', { name: 'Input: Number' });
    this.textInput = page.getByRole('textbox', { name: 'Input: Text' });
    this.passwordInput = page.getByRole('textbox', { name: 'Input: Password' });
    this.dateInput = page.getByRole('textbox', { name: 'Input: Date' });
    this.displayButton = page.getByRole('button', { name: 'Display Inputs' });
    this.clearButton = page.getByRole('button', { name: 'Clear Inputs' });
    this.outputValues = page.locator('strong');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inputs', { waitUntil: 'domcontentloaded' });
  }

  async fillInputs(values: InputValues): Promise<void> {
    await this.numberInput.fill(values.number);
    await this.textInput.fill(values.text);
    await this.passwordInput.fill(values.password);
    await this.dateInput.fill(values.date);
  }

  async displayInputs(): Promise<void> {
    await this.displayButton.click();
  }

  async clearInputs(): Promise<void> {
    await this.clearButton.click();
  }
}
