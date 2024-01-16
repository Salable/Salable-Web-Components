import {test} from 'stencil-playwright';
import {
  salablePricingTableTests,
  setUpCustomPricingTableApi,
  setUpProductPricingTableApi
} from "../../../../utilities/tests/salable-pricing-table-tests";

test.describe('salable-invoices Stencil E2E Tests', () => {
    const mockApiKey = 'mock_api_key';
    const mockPricingTableUuid = 'mock_pricing_table_uuid';

    test.describe('Fetch Success Cases', () => {
      test('Displays a product pricing table and toggles between monthly/yearly intervals', async ({page}) => {
        await setUpProductPricingTableApi(page);

        await page.setContent(`
                <salable-pricing-table
                    api-key="${mockApiKey}"
                    uuid="${mockPricingTableUuid}"
                    is-custom-pricing-table="false"
                    global-success-url="https://google.co.uk"
                    global-cancel-url="https://google.co.uk"
                    global-grantee-id="123"
                    member="456"
                ></salable-pricing-table>
            `);

        await salablePricingTableTests(page);
      });

      test('Displays a custom pricing table and toggles between monthly/yearly intervals', async ({page}) => {
        await setUpCustomPricingTableApi(page);
        await page.setContent(`
                <salable-pricing-table
                    api-key="${mockApiKey}"
                    uuid="${mockPricingTableUuid}"
                    is-custom-pricing-table="true"
                    global-success-url="https://google.co.uk"
                    global-cancel-url="https://google.co.uk"
                    global-grantee-id="123"
                    member="456"
                ></salable-pricing-table>
            `);
        await salablePricingTableTests(page);
      });
    });
});
