import { test } from "@playwright/test";
import {
  salableInvoiceTests,
  setUpInvoiceApi,
} from "../../../../utilities/tests/salable-invoices-tests.ts";
import InvoiceRepository from "../../../../utilities/repositories/invoice.ts";
import { mockInvoices } from "../../../../utilities/mock-data/invoice.mock.ts";

test.describe("salable-invoices React Client E2E Tests", () => {
  const invoiceRepository = new InvoiceRepository(mockInvoices);

  test.describe("Success Cases", () => {
    test("Displays first page of paginated invoice results", async ({
      page,
    }) => {
      await setUpInvoiceApi(page, invoiceRepository);

      await page.goto("http://localhost:5173/test/salable-invoices");
      await salableInvoiceTests(page, invoiceRepository);
    });
  });
});
