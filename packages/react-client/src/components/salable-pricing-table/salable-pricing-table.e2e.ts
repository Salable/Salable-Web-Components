import {test} from '@playwright/test';
import {
    salablePricingTableTests,
    setUpPricingTableApi
} from "../../../../utilities/tests/salable-pricing-table-tests.ts";

test.describe('salable-pricing-table React Client E2E Tests', () => {
    test.describe('Fetch Success Cases', () => {
        test('Displays the pricing table and toggles between monthly/yearly intervals', async ({page}) => {
            await setUpPricingTableApi(page);

            await page.goto('http://localhost:5173/test/salable-pricing-table');

            await salablePricingTableTests(page);
        });
    });
});
