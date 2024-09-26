import {test} from '@playwright/test';
import {mockCheckout} from '../../../../utilities/mock-data/checkout.mock'
import {
    salableCheckoutInvalidEmailPrefillTest,
    salableCheckoutPaymentIntentTest, salableCheckoutPerSeatTest,
    salableCheckoutPrefillWithEmailTest,
    setUpCheckoutFetch,
    setUpPaymentIntent
} from "../../../../utilities/tests/salable-checkout-tests";

test.describe('salable-checkout React Client E2E Tests', () => {
    test('All Cases', async ({page}) => {
        // Success Case
        await setUpCheckoutFetch(page, mockCheckout());
        await setUpPaymentIntent(page);

        await page.goto('http://localhost:5173/test/salable-checkout');
        await salableCheckoutPaymentIntentTest(page);

        // Valid email provided
        await page.goto('http://localhost:5173/test/salable-checkout/valid-email');
        await salableCheckoutPrefillWithEmailTest(page);

        // Invalid email provided
        await page.goto('http://localhost:5173/test/salable-checkout/invalid-email');
        await salableCheckoutInvalidEmailPrefillTest(page);
    });

    test('Displays per seat cost breakdown correctly', async ({ page }) => {
        await setUpCheckoutFetch(page, mockCheckout({
            perSeatAmount: 5,
            interval: 'year',
            licenseType: 'perSeat',
            currencies: [
                {
                    planUuid: "plan_xxxxx",
                    currencyUuid: "currency_xxxxx",
                    price: 100,
                    paymentIntegrationPlanId: "plan_xxxxxx",
                    currency: {
                        uuid: "currency_xxxxx",
                        shortName: "USD",
                        longName: "United States Dollar",
                        symbol: "$"
                    }
                }
            ]
        }));
        await setUpPaymentIntent(page);
        await page.goto('http://localhost:5173/test/salable-checkout/per-seat');
        await salableCheckoutPerSeatTest(page);
    });
});

