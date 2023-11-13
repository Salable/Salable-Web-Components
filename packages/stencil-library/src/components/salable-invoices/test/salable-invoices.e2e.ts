import {test} from 'stencil-playwright';
import InvoiceRepository from "../../../../../utilities/mock-data/respository/invoice-repository";
import {invoiceTests, setUpInvoicePagination} from "../../../../../utilities/tests/invoice-helpers";

test.describe('salable-invoices Stencil E2E Tests', () => {
  const mockApiKey = 'mock_api_key';
  const mockSubscriptionUuid = 'mock_subscription_uuid';
  const invoiceRepository = new InvoiceRepository();

  test.describe('Fetch Success Cases', () => {
    test('Displays first page of paginated invoice results', async ({page}) => {
      await setUpInvoicePagination(page, invoiceRepository);

      await page.setContent(`
        <salable-invoices
          api-key="${mockApiKey}"
          subscription-uuid="${mockSubscriptionUuid}"
          limit="2"
        ></salable-invoices>
      `);

      await invoiceTests(page, invoiceRepository);
    });
  });
});
