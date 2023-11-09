import {newSpecPage} from '@stencil/core/testing';
import {SalableInvoices} from '../salable-invoices';

describe('salable-invoices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SalableInvoices],
      html: `<salable-invoices></salable-invoices>`,
    });
    expect(page.root).toEqualHtml(`
      <salable-invoices>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </salable-invoices>
    `);
  });
});
