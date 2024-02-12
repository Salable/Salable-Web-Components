import { defineConfig } from '@playwright/test';
import {defaultPlaywrightConfig} from "../../default-playwright-config";

if (process.env.CI) {
  process.env.STRIPE_PUBLIC_KEY = process.env.TEST_STRIPE_PUBLIC_KEY;
  process.env.API_URL = process.env.TEST_API_URL;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...defaultPlaywrightConfig,
  testMatch: '*.e2e.ts',
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
