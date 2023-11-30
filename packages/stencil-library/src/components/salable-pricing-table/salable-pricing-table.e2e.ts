import { newE2EPage } from '@stencil/core/testing';

describe('salable-pricing-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-pricing-table></salable-pricing-table>');

    const element = await page.find('salable-pricing-table');
    expect(element).toHaveClass('hydrated');
  });
});
