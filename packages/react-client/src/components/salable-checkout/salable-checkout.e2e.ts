import { test } from '@playwright/test';
import { mockCheckout } from '../../../../utilities/mock-data/checkout.mock'
import {
    salableCheckoutPaymentIntentTest,
    setUpCheckoutFetch,
    setUpPaymentIntent
} from "../../../../utilities/tests/salable-checkout-tests";

test.describe('salable-checkout React Client E2E Tests', () => {

    test.describe('Fetch Success Cases', () => {
        test('Create payment intent form', async ({ page }) => {
            await setUpCheckoutFetch(page, mockCheckout());
            await setUpPaymentIntent(page);

            await page.goto('http://localhost:5173/test/salable-checkout');

            await salableCheckoutPaymentIntentTest(page);
        });
    });

    // test('Create payment intent form', async ({ page }) => {
    //     await setUpCheckoutFetch(page, mockCheckout());
    //     await setUpPaymentIntent(page);

    //     await page.goto('http://localhost:5173/test/salable-checkout');

    //     await salableCheckoutPaymentIntentTest(page);
    // });
});

