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
    test.describe('Success Cases', () => {
        test('Create payment intent form', async ({page}) => {
            await setUpCheckoutFetch(page, mockCheckout());
            await setUpPaymentIntent(page, {clientSecret: 'xxxxx'});

            await page.goto('http://localhost:5173/test/salable-checkout');

            await salableCheckoutPaymentIntentTest(page);
        });

        test('Prefill checkout with email', async ({page}) => {
            await setUpCheckoutFetch(page, mockCheckout());
            await setUpPaymentIntent(page, {clientSecret: 'xxxxx'});

            await page.goto('http://localhost:5173/test/salable-checkout/valid-email');

            await salableCheckoutPrefillWithEmailTest(page);
        });
    });

    test.describe('Failure Cases', () => {
        test('Prefill checkout with invalid email', async ({page}) => {
            await setUpCheckoutFetch(page, mockCheckout());
            await setUpPaymentIntent(page, {clientSecret: 'xxxxx'});

            await page.goto('http://localhost:5173/test/salable-checkout/invalid-email');

            await salableCheckoutInvalidEmailPrefillTest(page);
        });
    });
});

