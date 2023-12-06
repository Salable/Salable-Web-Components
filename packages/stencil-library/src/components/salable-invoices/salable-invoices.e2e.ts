import {test} from 'stencil-playwright';
import InvoiceRepository from "../../../../utilities/respository/invoice-repository";
import {salableInvoiceTests, setUpInvoiceApi} from "../../../../utilities/tests/salable-invoice-tests";
import {mockInvoices} from "../../../../utilities/mock-data/invoice.mock";

test.describe('salable-invoices Stencil E2E Tests', () => {
  const mockApiKey = 'mock_api_key';
  const mockSubscriptionUuid = 'mock_subscription_uuid';
  const invoiceRepository = new InvoiceRepository(mockInvoices);

  test.describe('Fetch Success Cases', () => {
    test('Displays first page of paginated invoice results', async ({page}) => {
      await setUpInvoiceApi(page, invoiceRepository);

      await page.setContent(`
        <salable-invoices
          api-key="${mockApiKey}"
          subscription-uuid="${mockSubscriptionUuid}"
          limit="2"
        ></salable-invoices>
      `);

      await salableInvoiceTests(page, invoiceRepository);
    });
  });
});
