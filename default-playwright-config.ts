import {devices, PlaywrightTestConfig} from "@playwright/test";



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

export const defaultPlaywrightConfig: PlaywrightTestConfig = {
    expect: {
        timeout: 5000,
        toMatchSnapshot: {
            maxDiffPixelRatio: 0.05,
        }
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    projects,
};