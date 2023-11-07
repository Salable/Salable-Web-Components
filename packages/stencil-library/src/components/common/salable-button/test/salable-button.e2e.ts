import { newE2EPage } from '@stencil/core/testing';

describe('salable-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-button></salable-button>');

    const element = await page.find('salable-button');
    expect(element).toHaveClass('hydrated');
  });

  it('displays slot content correctly', async () => {
    const testContent = 'Click me!';
    const page = await newE2EPage();
    await page.setContent(`<salable-button>${testContent}</salable-button>`);

    const slotContent = await page.find('salable-button button');
    expect(slotContent.textContent).toBe(testContent);
  });
});
