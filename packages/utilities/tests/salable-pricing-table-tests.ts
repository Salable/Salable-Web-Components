import {expect, Locator, Page} from "@playwright/test";
import {productPricingTableMock} from "../mock-data/pricing-table.mock";
import {PricingTable} from "../types/pricing-table";

export async function setUpCustomPricingTableApi(page: Page, data: PricingTable) {
    const url = /^.*?\/pricing-tables\/.*?/;

    await page.route(url, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data),
        });
    });
}

export async function setUpProductPricingTableApi(page: Page) {
    const url = /^.*?\/pricingtable/;

    await page.route(url, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(productPricingTableMock()),
        });
    });
}

export async function setUpErrorPricingTableApi(page: Page, statusCode: number, data: {error: string}) {
    const url = /^.*?\/pricing-tables\/.*?/;

    await page.route(url, async (route) => {
        await route.fulfill({
            status: statusCode,
            contentType: 'application/json',
            body: JSON.stringify(data),
        });
    });
}

export async function salablePricingTableTests(page: Page) {
    const pricingTable = page.locator('salable-pricing-table');
    const intervalToggle = pricingTable.locator('#interval-toggle');
    await expect(intervalToggle).toBeVisible();
    await expect(intervalToggle).not.toBeChecked();
    await testMonthlyLicensedPricingTable(pricingTable);
    await expect(page).toHaveScreenshot();
    await intervalToggle.check();
    await testYearlyLicensedPricingTable(pricingTable);
    await expect(page).toHaveScreenshot();
}

export async function salablePricingTablePerSeatTests(page: Page) {
    const pricingTable = page.locator('salable-pricing-table');
    const planUnlimitedSeats = pricingTable.getByTestId('pricing-table-card-0');
    await expect(planUnlimitedSeats.getByRole('heading', {name: 'Per Seat Unlimited'})).toBeVisible();
    await expect(planUnlimitedSeats.getByText('$1 / month per seat')).toBeVisible();
    await expect(planUnlimitedSeats.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const planMaximumSeats = pricingTable.getByTestId('pricing-table-card-1');
    await expect(planMaximumSeats.getByRole('heading', {name: 'Per Seat Maximum'})).toBeVisible();
    await expect(planMaximumSeats.getByText('$1.50 / month per seat')).toBeVisible();
    await expect(planMaximumSeats.getByText('(max. 3 seats)')).toBeVisible();
    await expect(planMaximumSeats.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const planRangeOfSeats = pricingTable.getByTestId('pricing-table-card-2');
    await expect(planRangeOfSeats.getByRole('heading', {name: 'Per Seat Range'})).toBeVisible();
    await expect(planRangeOfSeats.getByText('$2 / month per seat')).toBeVisible();
    await expect(planRangeOfSeats.getByText('(4 - 10 seats)')).toBeVisible();
    await expect(planRangeOfSeats.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const planMinimumSeats = pricingTable.getByTestId('pricing-table-card-3');
    await expect(planMinimumSeats.getByRole('heading', {name: 'Per Seat Minimum'})).toBeVisible();
    await expect(planMinimumSeats.getByText('$2.50 / month per seat')).toBeVisible();
    await expect(planMinimumSeats.getByText('(min. 5 seats)')).toBeVisible();
    await expect(planMinimumSeats.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    await expect(page).toHaveScreenshot();
}

export async function salablePricingTableIsSubscribedTests(page: Page) {
    const pricingTable = page.locator('salable-pricing-table');
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard.getByRole('heading', {name: 'Metered Plan Licensed'})).toBeVisible();
    await expect(firstCard.getByText('$1 / month per unit')).toBeVisible();
    await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const secondCard = pricingTable.getByTestId('pricing-table-card-1');
    await expect(secondCard.getByRole('heading', {name: 'Metered Plan Subscribed'})).toBeVisible();
    await expect(secondCard.getByText('$2 / month per unit')).toBeVisible();
    await expect(secondCard.getByRole('button', {name: 'Subscribed'})).toBeVisible();

    await expect(page).toHaveScreenshot();
}

export async function testPricingTableShowsCurrency(page: Page) {
    const pricingTable = page.locator('salable-pricing-table');
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard.getByRole('heading', {name: 'Plan'})).toBeVisible();
    await expect(firstCard.getByText('£2 / month')).toBeVisible();
    await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    await expect(page).toHaveScreenshot();
}

export async function testComingSoonPlanPricingTable(page: Page) {
    const pricingTable = page.locator('salable-pricing-table');
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard.getByRole('heading', {name: 'Future plan'})).toBeVisible();
    await expect(firstCard.getByText('Coming soon')).toBeVisible();
    const planButton = page.getByTestId('salable-plan-0-button')
    await expect(planButton).toHaveText('Contact us')
    await planButton.click()
    await page.waitForTimeout(1000)
    expect(page.url()).toBe('https://example.com/contact')
}

export async function testCheckoutUrlPricingTable(page: Page) {
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
}

async function testMonthlyLicensedPricingTable(pricingTable: Locator) {
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Basic Monthly Plan'})).toBeVisible();
    await expect(firstCard.getByText('$2 / month')).toBeVisible();
    await expect(firstCard.getByText('A basic monthly plan description')).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const secondCard = pricingTable.getByTestId('pricing-table-card-1');
    await expect(secondCard).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Pro Monthly Plan'})).toBeVisible();
    await expect(secondCard.getByText('$3.50 / month')).toBeVisible();
    await expect(secondCard.getByText('A pro monthly plan description')).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Three'})).toBeVisible();
    await expect(secondCard.getByRole('button', {name: 'Start 7 day trial'})).toBeVisible();
}

async function testYearlyLicensedPricingTable(pricingTable: Locator) {
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Basic Yearly Plan'})).toBeVisible();
    await expect(firstCard.getByText('$10 / year')).toBeVisible();
    await expect(firstCard.getByText('A basic yearly plan description')).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const secondCard = pricingTable.getByTestId('pricing-table-card-1');
    await expect(secondCard).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Pro Yearly Plan'})).toBeVisible();
    await expect(secondCard.getByText('$12.50 / year')).toBeVisible();
    await expect(secondCard.getByText('A pro yearly plan description')).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Three'})).toBeVisible();
    await expect(secondCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();
}
