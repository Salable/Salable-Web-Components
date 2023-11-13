import {test} from '@playwright/test';
import {invoiceTests, setUpInvoicePagination} from "../../utilities/invoice-helpers";
import InvoiceRepository from "../../utilities/mock-data/respository/invoice-repository";

// Todo: what do we want to test?
//       - Does it render
//       - Do rows render data correctly
//       - Does next/prev render correctly (no prev on page one, no next if no more rows)
//       - Does it navigate to next/prev pages
//       - Does pdf download work
//       - Do external links work
//       - Visual regression tests

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
