import {expect, Locator, Page} from "@playwright/test";
import InvoiceRepository, {Invoice} from "./mock-data/respository/invoice-repository";

export async function setUpInvoicePagination(page: Page, invoiceRepository: InvoiceRepository) {
    const url = /^https:\/\/api.salable.app\/subscriptions\/.*?\/invoices/;

    await page.route(url, async (route) => {
        const url = new URL(route.request().url());
        const cursor = url.searchParams.get('cursor') || undefined;
        const take = Number(url.searchParams.get('take') || '5');
        const paginatedData = invoiceRepository.paginate(cursor, take);

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(paginatedData),
        });
    });
}

export async function invoiceTests(page: Page, invoiceRepository: InvoiceRepository) {
    const pageOneRows = invoiceRepository.invoices.slice(0, 2);
    const pageTwoRows = invoiceRepository.invoices.slice(2, 4);
    const pageThreeRows = invoiceRepository.invoices.slice(4, 6);
    const tableRows = page.locator('salable-invoices tr');
    const nextButton = page.getByRole('button', {name: 'Next'});
    const prevButton = page.getByRole('button', {name: 'Prev'});

    const element = page.locator('salable-invoices');
    await expect(element).toBeVisible();

    await testInvoicesRows(pageOneRows, tableRows);
    await expect(nextButton).toBeVisible();
    await expect(prevButton).not.toBeVisible();
    await expect(page).toHaveScreenshot();

    await nextButton.click();
    await testInvoicesRows(pageTwoRows, tableRows);
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
    await expect(page).toHaveScreenshot();

    await nextButton.click();
    await testInvoicesRows(pageThreeRows, tableRows);
    await expect(nextButton).not.toBeVisible();
    await expect(prevButton).toBeVisible();
    await expect(page).toHaveScreenshot();

    await prevButton.click();
    await testInvoicesRows(pageTwoRows, tableRows);
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
    await expect(page).toHaveScreenshot();

    await prevButton.click();
    await testInvoicesRows(pageOneRows, tableRows);
    await expect(nextButton).toBeVisible();
    await expect(prevButton).not.toBeVisible();
    await expect(page).toHaveScreenshot();
}

async function testInvoicesRows(rows: Invoice[], tableRows: Locator) {
    for (const [i, rowData] of rows.entries()) {
        const row = tableRows.nth(i + 1);
        const cells = row.locator('td');
        await expect(cells).toHaveCount(4);

        const invoiceLink = cells.nth(0).locator('a');
        expect(await invoiceLink.getAttribute('href')).toBe(rowData.hosted_invoice_url);
        await expect(invoiceLink).toContainText(rowData.number);

        await expect(cells.nth(1).locator('salable-date')).toContainText('04 April 1968');
        await expect(cells.nth(2).locator('salable-status')).toContainText(rowData.status, {ignoreCase: true});

        const pdfDownloadLink = cells.nth(3).locator('a');
        expect(await pdfDownloadLink.getAttribute('href')).toBe(rowData.invoice_pdf);
        await expect(pdfDownloadLink.locator('svg')).toContainText('Download PDF');
    }
}