import { newE2EPage } from '@stencil/core/testing';
import mockInvoice from '../../../../mock_data/invoice.mock';

import type { E2EPage } from '@stencil/core/testing';
import type { Page } from 'puppeteer';
import { apiUrl } from '../../../constants';
import { InvoiceStatus } from '../salable-invoices';

const interceptRequests = async function (page: Page | E2EPage) {
  const fetchOverride = `
  if (!window.originalFetch) {
    window.originalFetch = window.fetch;
    window.requestsToIntercept = [];
    window.fetch = (...args) => (async (args) => {
      const request = requestsToIntercept.find(req => args[0].includes(req.url));

      if (request) {
        let result = {};
        result.json = async () => JSON.parse(request.response);
        result.text = async () => request.response;
        result.clone = () => result;
        result.ok = true;
        return result;
      }

      try {
        let result = await window.originalFetch(...args);
        return result;
      } catch(e) {
        console.log('oh no!', args[0], e?.message);
        throw(e);
      }
    })(args);
  }`;

  await page.evaluateOnNewDocument(fetchOverride);

  return async (requests: { url: string; response: {} }[]) => {
    requests = requests.map(req => ({
      url: req.url,
      response: JSON.stringify(req.response),
    }));

    await page.evaluateOnNewDocument(
      `window.requestsToIntercept.unshift(...${JSON.stringify(requests)});`,
    );
  };
};

describe('salable-invoices E2E Tests', () => {
  it('updates data after fetch request', async () => {
    const page = await newE2EPage();

    const mockApiKey = 'mock_api_key';
    const mockSubscriptionUuid = 'mock_subscription_uuid';

    const addInterceptRequests = await interceptRequests(page);

    await addInterceptRequests([
      {
        url: `${apiUrl}/subscriptions/${mockSubscriptionUuid}/invoices`,
        response: {
          data: [
            mockInvoice(),
            mockInvoice({number: 'INV-002', status: InvoiceStatus.PAID}),
            mockInvoice({number: 'INV-003', status: InvoiceStatus.VOID}),
          ],
          last: 'cursor_last',
          first: 'cursor_first',
          hasMore: true
        },
      }
    ]);

    await page.setContent(`
      <salable-invoices
        api-key="${mockApiKey}"
        subscription-uuid="${mockSubscriptionUuid}">
      </salable-invoices>
    `);

    await page.waitForChanges();

    const element = await page.find('salable-invoices'); // Use shadow piercing selector
    expect(element).not.toBeNull();

    const rows = await page.findAll('salable-invoices >>> tr'); // Use shadow piercing selector
    expect(rows.length).toBe(4);
    expect(rows[1].textContent).toContain('INV-001');
    expect(rows[1].textContent).toContain('Open');
    expect(rows[2].textContent).toContain('INV-002');
    expect(rows[2].textContent).toContain('Paid');
    expect(rows[3].textContent).toContain('INV-003');
    expect(rows[3].textContent).toContain('Void');
  });
});
