import {expect, Page} from "@playwright/test";
import {pricingTableMock} from "../mock-data/pricing-table.mock";

export async function setUpPricingTableApi(page: Page) {
    const url = /^.*?\/pricing-tables\/.*?/;

    await page.route(url, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(pricingTableMock()),
        });
    });
}

export async function salablePricingTableTests(page: Page) {
    await expect(page).toHaveScreenshot();
}
