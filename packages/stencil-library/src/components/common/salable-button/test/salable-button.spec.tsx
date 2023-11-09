import {newSpecPage} from '@stencil/core/testing';
import {SalableButton} from '../salable-button';

describe('salable-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SalableButton],
      html: `<salable-button></salable-button>`,
    });
    const button = page.root.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
  });

  it('displays slot content correctly', async () => {
    const testContent = 'Click me!';
    const page = await newSpecPage({
      components: [SalableButton],
      html: `<salable-button>${testContent}</salable-button>`,
    });
    const slotContent = page.root.querySelector('button');
    expect(slotContent.textContent).toBe(testContent);
  });
});
