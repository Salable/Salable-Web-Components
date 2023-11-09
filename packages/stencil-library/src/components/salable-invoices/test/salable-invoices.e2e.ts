import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';
import mockInvoice from '../../../../../../mock_data/invoice.mock';

test.describe('salable-invoices E2E Tests', () => {
  const mockApiKey = 'mock_api_key';
  const mockSubscriptionUuid = 'mock_subscription_uuid';
  const pageOneData = [
    mockInvoice({number: 'INV-001', status: 'open'}),
    mockInvoice({number: 'INV-002', status: 'paid'}),
    mockInvoice({number: 'INV-003', status: 'void'}),
    mockInvoice({number: 'INV-004', status: 'draft'}),
    mockInvoice({number: 'INV-005', status: 'uncollectible'}),
  ];

  test.describe('Fetch Success Cases', () => {
    test('Displays first page of paginated invoice results', async ({page}) => {

      await page.route('https://api.salable.app/**/*', async (route) => {
        const json = {
          data: pageOneData,
          last: 'cursor_last',
          first: 'cursor_first',
          hasMore: true,
        };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(json),
        });
      });

      await page.setContent(`
      <salable-invoices
        api-key="${mockApiKey}"
        subscription-uuid="${mockSubscriptionUuid}"
        limit="5"
      ></salable-invoices>
    `);

      await page.waitForChanges();

      const element = page.locator('salable-invoices');
      await expect(element).toBeVisible();

      const rows = page.locator('salable-invoices tr');
      await expect(rows).toHaveCount(6);

      for (const [i, rowData] of pageOneData.entries()) {
        const row = rows.nth(i + 1);
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

      await expect(page).toHaveScreenshot();
    });
  });
});
