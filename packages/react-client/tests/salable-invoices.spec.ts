import {expect, test} from '@playwright/test';
import mockInvoice from "../../../mock_data/invoice.mock";

// Todo: what do we want to test?
//       - Does it render
//       - Do rows render data correctly
//       - Does next/prev render correctly
//       - Does it navigate to next/prev pages
//       - Does pdf download work
//       - Do external links work
//       - Visual regression tests

test('salable invoice component', async ({page}) => {
    await page.route('https://api.salable.app/**', async (route) => {
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

    await page.goto('http://localhost:5173/invoices');

    const component = page.getByTestId('component');
    await expect(component).toBeVisible();
    const invOne = component.getByText('INV-001');
    await expect(invOne).toBeVisible();
    await expect(page).toHaveScreenshot();
});
