import {test} from '@playwright/test';
import {invoiceTests, setUpInvoicePagination} from "../../utilities/tests/invoice-helpers";
import InvoiceRepository from "../../utilities/mock-data/respository/invoice-repository";

test.describe('salable-invoices React Client E2E Tests', () => {
    const invoiceRepository = new InvoiceRepository();

    test.describe('Fetch Success Cases', () => {
        test('Displays first page of paginated invoice results', async ({page}) => {
            await setUpInvoicePagination(page, invoiceRepository);

            await page.goto('http://localhost:5173/test/salable-invoices');

            await invoiceTests(page, invoiceRepository);
        });
    });
});
