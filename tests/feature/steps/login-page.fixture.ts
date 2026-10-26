import { test as base } from 'playwright-bdd';
import { LoginPage } from '../../../Pages/LoginPage';

type LoginPageFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<LoginPageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
