import { expect, Page } from "@playwright/test";
import 'dotenv/config'
import Stripe from "stripe";

const TEST_STRIPE_KEY = process.env.TEST_STRIPE_KEY as string;
const TEST_STRIPE_ACCOUNT_ID = process.env.TEST_STRIPE_ACCOUNT_ID as string;
const TEST_STRIPE_CUSTOMER_ID = process.env.TEST_STRIPE_CUSTOMER_ID as string;
const TEST_STRIPE_PLAN_ID = process.env.TEST_STRIPE_PLAN_ID as string;

export async function setUpCheckoutFetch(page: Page, data: any) {
    await page.route('**/plans/**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data),
        });
    });
}

export async function setUpPaymentIntent(page: Page) {
    await page.route('**/create-subscription', async (route) => {

        const stripeConnect = new Stripe(TEST_STRIPE_KEY, {
            apiVersion: '2023-10-16',
            stripeAccount: TEST_STRIPE_ACCOUNT_ID
        });

        const stripeBasicSubscription = await stripeConnect.subscriptions.create({
            customer: TEST_STRIPE_CUSTOMER_ID,
            items: [{
                quantity: 1,
                price: TEST_STRIPE_PLAN_ID
            }],
            expand: ['latest_invoice.payment_intent'],
            payment_behavior: 'default_incomplete',
        }) as Stripe.Subscription & {
            latest_invoice: Stripe.Invoice & { payment_intent: Stripe.PaymentIntent };
        };

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({clientSecret: stripeBasicSubscription.latest_invoice?.payment_intent?.client_secret}),
        });
    });
}

export async function salableCheckoutPaymentIntentTest(page: Page) {
    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const price = page.getByText('$9.99 / m');
    await expect(price).toBeVisible();

    const label = page.getByLabel(/email/i);
    await expect(label).toBeVisible();
    await expect(page).toHaveScreenshot();


    await label.click();
    await page.keyboard.type('testuser@e');
    await page.click('button:has-text("continue")');

    const error = page.getByText('A valid email is required');
    await expect(error).toBeVisible();
    await expect(page).toHaveScreenshot();

    await label.click();
    await page.keyboard.type('mail.com');
    await expect(error).not.toBeVisible();
    await expect(page).toHaveScreenshot();

    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.click();
    const payButton = page.getByRole('button', { name: /pay/i });
    await expect(payButton).toBeVisible();
    const iframeElement = page.frameLocator('iframe').first();
    await expect(iframeElement.getByTestId('card')).toBeVisible();
    await expect(page).toHaveScreenshot();
}

export async function salableCheckoutInvalidEmailPrefillTest(page: Page) {
    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const errorMessage= page.getByText('A valid email is required');
    await expect(errorMessage).toBeVisible();
    await expect(page).toHaveScreenshot();
}

export async function salableCheckoutPrefillWithEmailTest(page: Page) {
    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const payButton = page.getByRole('button', { name: /pay/i });
    await expect(payButton).toBeVisible();
    await expect(page).toHaveScreenshot();
}
