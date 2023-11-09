import { expect, PlaywrightTestConfig } from '@playwright/test';

import { matchers } from 'stencil-playwright';
import {defaultPlaywrightConfig} from "../../default-playwright-config";

expect.extend(matchers);

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
    port: 3333,
    reuseExistingServer: !process.env.CI
  },
};

export default config;
