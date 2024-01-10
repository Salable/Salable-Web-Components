import { expect, Page } from "@playwright/test";

export async function setUpCheckoutFetch(page: Page, data: any) {
    await page.route('**/plans/**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data),
        });
    });
}


export async function setUpPaymentIntent(page: Page, data: any) {
    await page.route('**/create-subscription', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data),
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

    await page.click('label:has-text("email")');
    await page.keyboard.type('testuser@e');
    await page.click('button:has-text("continue")');

    const error = page.getByText('A valid email is required');
    await expect(error).toBeVisible();

    await page.click('label:has-text("email")');
    await page.keyboard.type('mail.com');

    await expect(error).not.toBeVisible();

    await page.click('button:has-text("continue")');

    const payButton = page.getByRole('button', {name: /pay/i});
    await expect(payButton).toBeVisible();
}
