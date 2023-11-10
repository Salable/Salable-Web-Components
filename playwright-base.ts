import { test as baseTest } from '@playwright/test';

export type MockApiOptions = {
    shouldFail?: boolean;
    mockData?: Record<string, unknown>;
    baseUrl?: string;
    routePath?: string;
    status?: number;
    contentType?: string;
};

export const test = baseTest.extend({
    mockApi: async ({ page }, use) => {
        async function setupApiMocks(options: MockApiOptions = {}) {
            const {
                shouldFail = false,
                mockData,
                baseUrl = 'https://api.salable.app',
                routePath = '/**/*',
                status = 200,
            } = options;

            const routePattern = `${baseUrl}${routePath}`;

            await page.route(routePattern, route => {
                if (shouldFail) {
                    route.abort('failed');
                } else if (mockData) {
                    route.fulfill({
                        status: status,
                        body: JSON.stringify(mockData),
                    });
                }
            });
        }

        await use(setupApiMocks);
    }
});
