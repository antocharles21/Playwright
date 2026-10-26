# PlaywrightProject

Playwright end-to-end tests are in `tests/` and are configured in
`playwright.config.ts`. The current example spec checks the public Playwright
website using Chromium, Firefox, and WebKit.

## Project layout

| Path | Purpose |
| --- | --- |
| `tests/` | Test specifications (`*.spec.ts`) |
| `Pages/` | Page-object classes for login, registration, password reset, and web inputs |
| `Data/` | Non-sensitive, reusable test data |
| `Utils/` | Typed helpers for locator state, tabs/navigation, screenshots, responses, and downloads |
| `tests/feature/practice-site.feature` | Five Gherkin scenarios for the Expand Testing practice site |
| `tests/feature/steps/` | BDD step definitions that use the Page Objects |
| `.github/workflows/` | GitHub Actions workflow for installing browsers and running tests |
| `playwright.config.ts` | Test discovery, browser projects, retries, and reporting |
| `playwright-report/`, `test-results/` | Generated report and result output; not source files |

`Pages/` and `Data/` are available for page objects and reusable test data.
`Utils/` contains shared Playwright helpers. Empty directories are not included
when committing to Git. For a growing suite, consider adding a dedicated
`fixtures/` directory for custom Playwright fixtures rather than placing
fixture setup in generic utilities.

## Expand Testing BDD scenarios

`tests/feature/practice-site.feature` contains five executable Gherkin scenarios:

1. Log in with the site's published practice credentials and verify the secure area.
2. Reject invalid login credentials.
3. Register a unique user and verify the success confirmation.
4. Request a password reset and verify the confirmation message.
5. Enter, display, and clear number, text, password, and date inputs.

Step definitions are in `tests/feature/steps/` and page interactions remain
encapsulated in the matching classes under `Pages/`. Playwright-BDD generates
Playwright tests into the ignored `tests/feature/.features-gen/` directory.

Run the feature scenarios in Chromium, Firefox, and WebKit with:

```sh
npm run test:bdd
```

The target URL defaults to `https://practice.expandtesting.com`; override it
with the `BASE_URL` environment variable when needed.

The default `npm test` command generates the BDD tests before running the
complete suite, including the existing example and utility tests.

## Run and debug from VS Code

Open **Run and Debug** and select either **Run practice-site BDD tests
(Chromium)** or **Debug practice-site BDD tests (Chromium)**. Both launch
configurations regenerate the BDD tests first. The debug configuration runs
Playwright with its inspector enabled; set breakpoints in the step definitions
or Page Objects before starting it.

Utilities are exported from `Utils/index.ts` and accept Playwright `Page`,
`BrowserContext`, and `Locator` instances. For example:

```ts
import { getText, waitForResponse } from '../Utils';

const headingText = await getText(page.getByRole('heading'));
const response = await waitForResponse(
  page,
  (candidate) => candidate.url().includes('/api/items'),
  () => page.getByRole('button', { name: 'Load items' }).click(),
);
```

Use Playwright's built-in locator actions and assertions directly when a shared
helper would only duplicate the underlying API.

## Run tests

Install dependencies and browser binaries once:

```sh
npm ci
npx playwright install
```

Then run:

```sh
npm test                 # Run all configured browser projects
npm test -- --project=chromium
npm run test:headed       # Run with a visible browser
npm run test:ui           # Open Playwright's interactive UI
npm run test:report       # Open the latest HTML report
```

The HTML report is written to `playwright-report/` after a test run. The
`.gitignore` excludes generated reports, results, browser downloads, and
dependencies.
