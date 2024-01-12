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
    await expect(page).toHaveScreenshot();
}


export async function salableCheckoutInvalidEmailPrefillTest(page: Page) {
    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const elementContainer = await page.waitForSelector("salable-checkout");
    expect(elementContainer).not.toBeNull();

    let elementContent = await elementContainer.textContent();

    elementContent = await elementContainer.textContent();
    expect(elementContent).toContain('A valid email is required')
    await expect(page).toHaveScreenshot();
}

export async function salableCheckoutPrefillWithEmailTest(page: Page) {

    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const elementContainer = await page.waitForSelector("salable-checkout");
    expect(elementContainer).not.toBeNull();

    const elementContent = await elementContainer.textContent();
    expect(elementContent).toContain("Pay")
    await expect(page).toHaveScreenshot();
}
