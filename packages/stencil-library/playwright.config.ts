import {expect, PlaywrightTestConfig} from '@playwright/test';
import {matchers} from 'stencil-playwright';
import {defaultPlaywrightConfig} from "../../default-playwright-config";

expect.extend(matchers);

if (process.env.CI) {
  process.env.STRIPE_PUBLIC_KEY = process.env.TEST_STRIPE_PUBLIC_KEY;
  process.env.API_URL = process.env.TEST_API_URL;
}

console.log(JSON.stringify(process.env));

const config: PlaywrightTestConfig = {
  ...defaultPlaywrightConfig,
  testMatch: '*.e2e.ts',
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    baseURL: 'http://localhost:3333',
  },
  webServer: {
    command: 'pnpm test:serve',
    url: 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
};

export default config;
