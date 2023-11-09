import {newSpecPage} from '@stencil/core/testing';
import {SalableSearch} from '../salable-search';

describe('salable-search', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SalableSearch],
      html: `<salable-search></salable-search>`,
    });
    const label = page.root.querySelector('label');
    expect(label).not.toBeNull();
    expect(label.textContent).toEqual('Search');
    const input = page.root.querySelector('input');
    expect(input).not.toBeNull();
    expect(input.type).toBe('text');
  });
});
