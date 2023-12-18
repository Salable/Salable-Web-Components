import { expect, Page } from "@playwright/test";

export async function setUpCheckoutFetch(page: Page, data: any) {

    await page.route('**/plans/**', async (route) => {
        // const planData = checkoutRepository.plan();
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data),
        });
    });
}

export async function salableCheckoutPropsTests(page: Page) {
    const element = page.locator('salable-checkout');
    await expect(element).toBeVisible();

    const missingPropsTextElement = await page.waitForSelector("salable-checkout");
    expect(missingPropsTextElement).not.toBeNull();

    const missingPropsText = await missingPropsTextElement.textContent();
    expect(missingPropsText).toContain('Missing required props')
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

    // Ensure email input field returns an error
    // await page.click('button:has-text("continue")')
    // elementContent = await elementContainer.textContent()
    // expect(elementContent).toContain('A valid email is required')
    await page.click('label:has-text("email")');
    await page.keyboard.type('testuser@e');
    await page.click('button:has-text("continue")');
    elementContent = await elementContainer.textContent();
    expect(elementContent).toContain('A valid email is required')

    // const emailInput = page.getByLabel('Email')
    // await page.fill('', 'testuser@email.com')
    // await page.getByText('Continue').click();

    // await page.

    // Ensure form submits
}
