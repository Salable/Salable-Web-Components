import {test} from '@playwright/test';
import {
    salablePricingTableTests,
    setUpCustomPricingTableApi, setUpProductPricingTableApi
} from "../../../../utilities/tests/salable-pricing-table-tests.ts";

test.describe('salable-pricing-table React Client E2E Tests', () => {
    test('All Cases', async ({page}) => {
        // Displays a product pricing table and toggles between monthly/yearly intervals
        await setUpCustomPricingTableApi(page);
        await page.goto('http://localhost:5173/test/salable-pricing-table');
        await salablePricingTableTests(page);

        // Displays a custom pricing table and toggles between monthly/yearly intervals
        await setUpProductPricingTableApi(page);
        await page.goto('http://localhost:5173/test/salable-pricing-table');
        await salablePricingTableTests(page);
    });
});
