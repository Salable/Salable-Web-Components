import {expect, test} from '@playwright/test';
import {
    salablePricingTableIsSubscribedTests, salablePricingTablePerSeatTests,
    salablePricingTableTests,
    setUpCustomPricingTableApi, setUpErrorPricingTableApi, setUpProductPricingTableApi
} from "../../../../utilities/tests/salable-pricing-table-tests.ts";
import {
    defaultCurrency,
    pricingTableMock,
    pricingTablePlanMock
} from "../../../../utilities/mock-data/pricing-table.mock.ts";

test.describe('salable-pricing-table React Client E2E Tests', () => {
    test.describe('Success Cases', () => {
        test('Displays a product pricing table and custom pricing table and toggles between monthly/yearly intervals', async ({page}) => {
            await setUpCustomPricingTableApi(page, pricingTableMock());
            await page.goto('http://localhost:5173/test/salable-pricing-table');
            await salablePricingTableTests(page);

            await setUpProductPricingTableApi(page);
            await page.goto('http://localhost:5173/test/salable-pricing-table');
            await salablePricingTableTests(page);
        })

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
            await page.goto('http://localhost:5173/test/salable-pricing-table/is-subscribed');
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
            await page.goto('http://localhost:5173/test/salable-pricing-table/per-seat');
            await salablePricingTablePerSeatTests(page);
        });

        test('Displays Coming soon plan and on plan button click redirect to correct url', async ({page}) => {
            await setUpCustomPricingTableApi(page, pricingTableMock({
                plans: [
                    pricingTablePlanMock({
                        plan: {
                            currencies: [],
                            displayName: 'Coming soon',
                            planType: 'Coming soon',
                        }
                    }),
                ]
            }));
            await page.goto('http://localhost:5173/test/salable-pricing-table/coming-soon');
            const pricingTable = page.locator('salable-pricing-table');
            const firstCard = pricingTable.getByTestId('pricing-table-card-0');
            await expect(firstCard.getByRole('heading', {name: 'Coming soon'})).toBeVisible();
            const planButton = page.getByTestId('salable-plan-0-button')
            await expect(planButton).toHaveText('Contact us')
            await planButton.click()
            await page.waitForTimeout(3000)
            expect(page.url()).toBe('https://example.com/contact')
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
            }));
            await page.route(/^.*?\/checkoutlink\?.*?/, async (route) => {
                await page.waitForTimeout(1000);
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ checkoutUrl: 'https://example.com/checkout' }),
                });
            });
            await page.goto('http://localhost:5173/test/salable-pricing-table/checkout');

            const pricingTable = page.locator('salable-pricing-table');
            const firstCard = pricingTable.getByTestId('pricing-table-card-0');
            await expect(firstCard.getByRole('heading', {name: 'Metered Plan'})).toBeVisible();
            await expect(firstCard.getByText('$1 / month per unit')).toBeVisible();
            await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

            const waitCheckoutFetchResponse = page.waitForResponse(
              async (res) => {
                  return res.url().includes(`/checkoutlink`) &&
                    res.request().method() === 'GET' &&
                    res.status() === 200;
              }
            );

            await page.getByTestId('salable-plan-0-button').click()
            await expect(page.getByTestId('plan-0-spinner')).toBeVisible()
            await waitCheckoutFetchResponse;
            await page.waitForTimeout(1000)
            expect(page.url()).toBe('https://example.com/checkout')
        });
    })

    test.describe('Failure Cases', () => {
        test('Displays an error message if api key is unauthorised', async ({page}) => {
            await setUpErrorPricingTableApi(page, 401, {error: 'Unauthorised'});
            await page.goto('http://localhost:5173/test/salable-pricing-table/errors/unauthorised');
            const pricingTable = page.locator('salable-pricing-table');
            const errorMessage = pricingTable.getByTestId('salable-pricing-table-error');
            await expect(errorMessage.getByText('Unauthorised')).toBeVisible();
        });

        test('Displays an error message if fetch fails', async ({page}) => {
            await setUpErrorPricingTableApi(page, 400, {error: 'Something went wrong'});
            await page.goto('http://localhost:5173/test/salable-pricing-table/errors/fetch-fails');
            const pricingTable = page.locator('salable-pricing-table');
            const errorMessage = pricingTable.getByTestId('salable-pricing-table-error');
            await expect(errorMessage.getByText('Failed to load Pricing Table')).toBeVisible();
        });

        test('Displays an error message a required prop is missing', async ({page}) => {
            await page.goto('http://localhost:5173/test/salable-pricing-table/errors/required-prop');
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
            }));
            await page.route(/^.*?\/checkoutlink\?.*?/, route => {
                route.fulfill({
                    status: 400,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'Bad Request' }),
                });
            });
            await page.goto('http://localhost:5173/test/salable-pricing-table/errors/checkout');
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
    })
});
