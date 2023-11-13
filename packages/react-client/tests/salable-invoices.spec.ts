import {test} from '@playwright/test';
import {salableInvoiceTests, setUpInvoicePagination} from "../../utilities/tests/salable-invoice-tests";
import InvoiceRepository from "../../utilities/mock-data/respository/invoice-repository";
import {mockInvoices} from "../../utilities/mock-data/invoice.mock";

test.describe('salable-invoices React Client E2E Tests', () => {
    const invoiceRepository = new InvoiceRepository(mockInvoices);

    test.describe('Fetch Success Cases', () => {
        test('Displays first page of paginated invoice results', async ({page}) => {
            await setUpInvoicePagination(page, invoiceRepository);

            await page.goto('http://localhost:5173/test/salable-invoices');

            await salableInvoiceTests(page, invoiceRepository);
        });
    });
});
