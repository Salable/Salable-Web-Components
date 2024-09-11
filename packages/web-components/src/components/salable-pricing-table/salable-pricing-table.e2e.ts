import {test} from 'stencil-playwright';
import {
  salablePricingTableIsSubscribedTests, salablePricingTablePerSeatTests,
  salablePricingTableTests,
  setUpCustomPricingTableApi,
  setUpProductPricingTableApi
} from "../../../../utilities/tests/salable-pricing-table-tests";
import {
  defaultCurrency,
  pricingTableMock,
  pricingTablePlanMock
} from "../../../../utilities/mock-data/pricing-table.mock";

test.describe('salable-pricing-table Stencil E2E Tests', () => {
    const mockApiKey = 'test_xxxxxx';
    const mockPricingTableUuid = 'mock_pricing_table_uuid';

    test.describe('Fetch Success Cases', () => {
      test('Displays a product pricing table and toggles between monthly/yearly intervals', async ({page},) => {
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
        await setUpCustomPricingTableApi(page, pricingTableMock());
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

      test('Displays a custom pricing table with a subscribed grantee', async ({page}) => {
        await setUpCustomPricingTableApi(page, pricingTableMock({
          plans: [
            pricingTablePlanMock({
              plan: {
                displayName: 'Metered Plan Licensed',
                licenseType: 'metered',
                currencies: [{
                  currency: defaultCurrency,
                  price: 100
                }],
                grantee: { isSubscribed: false, isLicensed: true }
              }
            }),
            pricingTablePlanMock({
              plan: {
                displayName: 'Metered Plan Subscribed',
                licenseType: 'metered',
                currencies: [{
                  currency: defaultCurrency,
                  price: 200
                }],
                grantee: { isSubscribed: true, isLicensed: true }
              }
            })
          ]
        }));
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
        await salablePricingTableIsSubscribedTests(page);
      });

      test('Displays a custom pricing table with all variations of per seat plans', async ({page}) => {
        await setUpCustomPricingTableApi(page, pricingTableMock({
          plans: [
            pricingTablePlanMock({
              plan: {
                displayName: 'Per Seat Unlimited',
                licenseType: 'perSeat',
                currencies: [{
                  currency: defaultCurrency,
                  price: 100
                }],
                grantee: { isSubscribed: true, isLicensed: true }
              }
            }),
            pricingTablePlanMock({
              plan: {
                displayName: 'Per Seat Maximum',
                licenseType: 'perSeat',
                maxSeatAmount: 3,
                currencies: [{
                  currency: defaultCurrency,
                  price: 150
                }],
              }
            }),
            pricingTablePlanMock({
              plan: {
                displayName: 'Per Seat Range',
                licenseType: 'perSeat',
                perSeatAmount: 4,
                maxSeatAmount: 10,
                currencies: [{
                  currency: defaultCurrency,
                  price: 200
                }],
              }
            }),
            pricingTablePlanMock({
              plan: {
                displayName: 'Per Seat Minimum',
                licenseType: 'perSeat',
                perSeatAmount: 5,
                currencies: [{
                  currency: defaultCurrency,
                  price: 250
                }],
              }
            })
          ]
        }));
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
        await salablePricingTablePerSeatTests(page);
      });
    });
});
