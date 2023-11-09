import { test } from 'stencil-playwright';
import {expect} from '@playwright/test';
import mockInvoice from '../../../../../../mock_data/invoice.mock';

test.describe('salable-invoices E2E Tests', () => {
  test('updates data after fetch request', async ({ page }) => {
    const mockApiKey = 'mock_api_key';
    const mockSubscriptionUuid = 'mock_subscription_uuid';

    // Intercept fetch requests and provide mock responses
    await page.route('https://api.salable.app/**/*', async (route) => {
      const json = {
        data: [
          mockInvoice({number: 'INV-001', status: 'open'}),
          mockInvoice({number: 'INV-002', status: 'paid'}),
          mockInvoice({number: 'INV-003', status: 'void'}),
          mockInvoice({number: 'INV-004', status: 'draft'}),
          mockInvoice({number: 'INV-005', status: 'uncollectible'}),
        ],
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
        subscription-uuid="${mockSubscriptionUuid}">
      </salable-invoices>
    `);

    await page.waitForChanges();

    const element = page.locator('salable-invoices');
    await expect(element).toBeVisible();

    const rows = page.locator('salable-invoices tr');
    await expect(rows).toHaveCount(6);
    await expect(rows.nth(1)).toContainText('INV-001');
    await expect(rows.nth(2)).toContainText('INV-002');
    await expect(rows.nth(3)).toContainText('INV-003');
    await expect(rows.nth(4)).toContainText('INV-004');
    await expect(rows.nth(5)).toContainText('INV-005');
    await expect(page).toHaveScreenshot();
  });
});
