import {expect, PlaywrightTestConfig} from '@playwright/test';
import {matchers} from 'stencil-playwright';
import {defaultPlaywrightConfig} from "../../default-playwright-config";

expect.extend(matchers);

console.log('env', process.env.TEST_STRIPE_ACCOUNT_ID);
console.log('env', process.env.TEST_STRIPE_CUSTOMER_ID);
console.log('env', process.env.TEST_STRIPE_PLAN_ID);

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
