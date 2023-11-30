import { newSpecPage } from '@stencil/core/testing';
import { SalablePricingTable } from './salable-pricing-table';

describe('salable-pricing-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SalablePricingTable],
      html: `<salable-pricing-table></salable-pricing-table>`,
    });
    expect(page.root).toEqualHtml(`
      <salable-pricing-table>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </salable-pricing-table>
    `);
  });
});
