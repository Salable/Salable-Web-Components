import { expect, PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

import { matchers } from 'stencil-playwright';

expect.extend(matchers);

const projects = [
  {
    name: 'chromium',

    use: {
      ...devices['Desktop Chrome'],
    },
  },
  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
    },
  },
  {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
    },
  },
  // {
  //   name: 'Mobile Chrome',
  //   use: {
  //     ...devices['Pixel 5']
  //   }
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: {
  //     ...devices['iPhone 12']
  //   }
  // }
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testMatch: '*.e2e.ts',
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
    toMatchSnapshot: {
      /**
       * Increases the maximum allowed pixel difference to account
       * for slight browser rendering inconsistencies.
       */
      maxDiffPixelRatio: 0.05
    }
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /**
     * All failed tests should create
     * a trace file for easier debugging.
     *
     * See https://playwright.dev/docs/trace-viewer
     */
    trace: 'retain-on-failure',
    baseURL: 'http://localhost:3333',
  },
  /* Configure projects for major browsers */
  projects,
  webServer: {
    command: 'pnpm test:serve',
    port: 3333,
    reuseExistingServer: !process.env.CI
  },

};

export default config;
