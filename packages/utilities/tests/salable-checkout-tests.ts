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


    await page.route('**/create-subscription-intent', async (route) => {

        if (route.request().method() === 'POST') {

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(data),
            });
            return;
        }

        route.continue();

    });
}

export async function salableCheckoutPaymentIntentTest(page: Page) {
    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const elementContainer = await page.waitForSelector("salable-checkout");
    expect(elementContainer).not.toBeNull();

    let elementContent = await elementContainer.textContent();
    // Check if form has the right texts
    expect(elementContent).toContain('Price');
    expect(elementContent).toContain('Email');
    expect(elementContent).toContain('$9.99 / month');

    await page.click('label:has-text("email")');
    await page.keyboard.type('testuser@e');
    await page.click('button:has-text("continue")');
    elementContent = await elementContainer.textContent();
    expect(elementContent).toContain('A valid email is required')

    await page.click('label:has-text("email")')
    await page.keyboard.type('mail.com');
    await setUpPaymentIntent(page, { clientSecret: 'pi_3OWNqkQNgztiveVE1l59ncLn_secret_FZkUMqdnBnUIPwwB96rI7tZR0' })

    await page.click('button:has-text("continue")');
    elementContent = await elementContainer.textContent();
    expect(elementContent).not.toContain('A valid email is required')
    await page.waitForTimeout(10000)
    expect(elementContent).toContain("Pay")
}
