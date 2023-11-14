import { expect, PlaywrightTestConfig } from '@playwright/test';

import { matchers } from 'stencil-playwright';
import {defaultPlaywrightConfig} from "../../default-playwright-config";

expect.extend(matchers);

const config: PlaywrightTestConfig = {
  ...defaultPlaywrightConfig,
  testMatch: '*.e2e.ts',
  expect: {
    timeout: 5000,
    toMatchSnapshot: {
      threshold: 0.05,
      maxDiffPixelRatio: 0.05,
    }
  },
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
