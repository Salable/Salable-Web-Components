import {test} from 'stencil-playwright';
import {
  salablePricingTableIsSubscribedTests, salablePricingTablePerSeatTests,
  salablePricingTableTests,
  setUpCustomPricingTableApi, setUpErrorPricingTableApi,
  setUpProductPricingTableApi, testCheckoutUrlPricingTable, testComingSoonPlanPricingTable
} from "../../../../utilities/tests/salable-pricing-table-tests";
import {
  PricingTable,
  defaultCurrency,
  pricingTableMock,
  pricingTablePlanMock
} from "../../../../utilities/mock-data/pricing-table.mock";
import {expect} from "@playwright/test";

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
        await setUpCustomPricingTableApi(page, pricingTableMock() as PricingTable);
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
        await expect(page.getByText('FEATURED')).toBeVisible();
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
        }) as PricingTable);
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

      test('Successfully click plan button and redirect to checkout url after fetch', async ({page}) => {
        await setUpCustomPricingTableApi(page, pricingTableMock({
          plans: [
            pricingTablePlanMock({
              plan: {
                displayName: 'Metered Plan',
                licenseType: 'metered',
                currencies: [{
                  currency: defaultCurrency,
                  price: 100
                }],
                grantee: { isSubscribed: false, isLicensed: false }
              }
            }),
          ]
        }) as PricingTable);
        await page.route(/^.*?\/checkoutlink\?.*?/, async (route) => {
          await page.waitForTimeout(1000);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({checkoutUrl: 'https://example.com/checkout'}),
          });
        });
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
        await testCheckoutUrlPricingTable(page)
      });

      test('Displays Coming soon plan and on plan button click redirect to correct url', async ({page}) => {
        await setUpCustomPricingTableApi(page, pricingTableMock({
          plans: [
            pricingTablePlanMock({
              plan: {
                currencies: [],
                displayName: 'Future Plan',
                planType: 'Coming soon',
              }
            }),
          ]
        }) as PricingTable);
        await page.setContent(`
          <salable-pricing-table
            api-key="${mockApiKey}"
            uuid="${mockPricingTableUuid}"
            is-custom-pricing-table="true"
            global-success-url="https://google.co.uk"
            global-cancel-url="https://google.co.uk"
            global-contact-url="https://example.com/contact"
            global-grantee-id="123"
            member="456"
          ></salable-pricing-table>
        `);
        await testComingSoonPlanPricingTable(page)
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
        }) as PricingTable);
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

    test.describe('Fetch Error Cases', () => {
      test('Displays an error message if api key is unauthorised', async ({page}) => {
        await setUpErrorPricingTableApi(page, 401, {error: 'Unauthorised'});
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
        const pricingTable = page.locator('salable-pricing-table');
        const errorMessage = pricingTable.getByTestId('salable-pricing-table-error');
        await expect(errorMessage.getByText('Unauthorised')).toBeVisible();
      });

      test('Displays an error message if fetch fails', async ({page}) => {
        await setUpErrorPricingTableApi(page, 400, {error: 'Something went wrong'});
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
        const pricingTable = page.locator('salable-pricing-table');
        const errorMessage = pricingTable.getByTestId('salable-pricing-table-error');
        await expect(errorMessage.getByText('Failed to load Pricing Table')).toBeVisible();
      });

      test('Displays an error message a required prop is missing', async ({page}) => {
        await page.setContent(`
          <salable-pricing-table
            api-key="${mockApiKey}"
            uuid="${mockPricingTableUuid}"
            is-custom-pricing-table="true"
            global-success-url="https://google.co.uk"
            global-cancel-url="https://google.co.uk"
            global-grantee-id="123"
          ></salable-pricing-table>
        `);
        const pricingTable = page.locator('salable-pricing-table');
        const errorMessage = pricingTable.getByTestId('salable-pricing-table-error');
        await expect(errorMessage.getByText('Failed to load Pricing Table')).toBeVisible();
      });

      test('Displays an error message if checkout fetch fails', async ({page}) => {
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
            })
          ]
        }) as PricingTable);
        await page.route(/^.*?\/checkoutlink\?.*?/, route => {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Bad Request' }),
          });
        });
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

        const waitCheckoutFetchResponse = page.waitForResponse(
          (res) =>
            res.url().includes(`/checkoutlink`) &&
            res.request().method() === 'GET' &&
            res.status() === 400
        );
        const selectPlanButton = page.getByTestId('salable-plan-0-button');
        await selectPlanButton.click();
        await waitCheckoutFetchResponse;

        const errorMessage = page.getByTestId('salable-pricing-table-error');
        await expect(errorMessage.getByText('Failed to load checkout')).toBeVisible();
      });
    });
});

