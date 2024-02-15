import {expect, Locator, Page} from "@playwright/test";
import {pricingTableMock, productPricingTableMock} from "../mock-data/pricing-table.mock";

export async function setUpCustomPricingTableApi(page: Page) {
    const url = /^.*?\/pricing-tables\/.*?/;

    await page.route(url, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(pricingTableMock()),
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

async function testMonthlyLicensedPricingTable(pricingTable: Locator) {
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Basic Monthly Plan'})).toBeVisible();
    await expect(firstCard.getByText('$2 per month')).toBeVisible();
    await expect(firstCard.getByText('A basic monthly plan description')).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const secondCard = pricingTable.getByTestId('pricing-table-card-1');
    await expect(secondCard).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Pro Monthly Plan'})).toBeVisible();
    await expect(secondCard.getByText('$3.50 per month')).toBeVisible();
    await expect(secondCard.getByText('A pro monthly plan description')).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Three'})).toBeVisible();
    await expect(secondCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();
}

async function testYearlyLicensedPricingTable(pricingTable: Locator) {
    const firstCard = pricingTable.getByTestId('pricing-table-card-0');
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Basic Yearly Plan'})).toBeVisible();
    await expect(firstCard.getByText('$10 per year')).toBeVisible();
    await expect(firstCard.getByText('A basic yearly plan description')).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(firstCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(firstCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();

    const secondCard = pricingTable.getByTestId('pricing-table-card-1');
    await expect(secondCard).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Pro Yearly Plan'})).toBeVisible();
    await expect(secondCard.getByText('$12.50 per year')).toBeVisible();
    await expect(secondCard.getByText('A pro yearly plan description')).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature One'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Two'})).toBeVisible();
    await expect(secondCard.getByRole('heading', {name: 'Feature Three'})).toBeVisible();
    await expect(secondCard.getByRole('button', {name: 'Select Plan'})).toBeVisible();
}