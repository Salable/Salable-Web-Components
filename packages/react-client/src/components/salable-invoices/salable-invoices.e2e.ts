import { test } from "@playwright/test";
import {
  salableInvoiceErrorTests,
  salableInvoiceNoInvoicesTests,
  salableInvoiceTests,
  setUpInvoiceApi,
  setUpInvoiceApiResponse,
} from "../../../../utilities/tests/salable-invoices-tests.ts";
import InvoiceRepository from "../../../../utilities/repositories/invoice.ts";
import { mockInvoices } from "../../../../utilities/mock-data/invoice.mock.ts";

test.describe("salable-invoices React Client E2E Tests", () => {
  const invoiceRepository = new InvoiceRepository(mockInvoices);

  test.describe("Success Cases", () => {
    test("Displays invoice results and can paginate forward and back", async ({
      page,
    }) => {
      await setUpInvoiceApi(page, invoiceRepository);
      await page.goto("http://localhost:5173/test/salable-invoices");
      await salableInvoiceTests(page, invoiceRepository);
    });

    test("Displays a message if no invoices are found", async ({ page }) => {
      await setUpInvoiceApiResponse(page, 200, []);
      await page.goto("http://localhost:5173/test/salable-invoices");
      await salableInvoiceNoInvoicesTests(page);
    });
  });

  test.describe("Error Cases", () => {
    test("Displays an error for 401 response", async ({ page }) => {
      await setUpInvoiceApiResponse(page, 401, { error: "Unauthenticated" });
      await page.goto("http://localhost:5173/test/salable-invoices");
      await salableInvoiceErrorTests(page, "Unauthenticated");
    });

    test("Displays an error for 403 response", async ({ page }) => {
      await setUpInvoiceApiResponse(page, 403, { error: "Unauthorised" });
      await page.goto("http://localhost:5173/test/salable-invoices");
      await salableInvoiceErrorTests(page, "Unauthorised");
    });

    test("Displays an error for 404 response", async ({ page }) => {
      await setUpInvoiceApiResponse(page, 404, {
        error: "Subscription not found",
      });
      await page.goto("http://localhost:5173/test/salable-invoices");
      await salableInvoiceErrorTests(page, "Not found");
    });
  });
});
