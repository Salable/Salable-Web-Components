import {test} from '@playwright/test';
import {mockCheckout} from '../../../../utilities/mock-data/checkout.mock'
import {
    salableCheckoutInvalidEmailPrefillTest,
    salableCheckoutPaymentIntentTest,
    salableCheckoutPrefillWithEmailTest,
    setUpCheckoutFetch,
    setUpPaymentIntent
} from "../../../../utilities/tests/salable-checkout-tests";

test.describe('salable-checkout React Client E2E Tests', () => {
    test('Create payment intent form', async ({page}) => {
        // Success Case
        await setUpCheckoutFetch(page, mockCheckout());
        await setUpPaymentIntent(page, {clientSecret: 'xxxxx'});

        await page.goto('http://localhost:5173/test/salable-checkout');

        await salableCheckoutPaymentIntentTest(page);

        // Valid email provided
        await page.goto('http://localhost:5173/test/salable-checkout/valid-email');

        await salableCheckoutPrefillWithEmailTest(page);

        // Invalid email provided
        await page.goto('http://localhost:5173/test/salable-checkout/invalid-email');

        await salableCheckoutInvalidEmailPrefillTest(page);
    });
});

