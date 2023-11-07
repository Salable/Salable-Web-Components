import { newE2EPage } from '@stencil/core/testing';

describe('salable-search', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-search></salable-search>');

    const element = await page.find('salable-search');
    expect(element).toHaveClass('hydrated');
  });
});
