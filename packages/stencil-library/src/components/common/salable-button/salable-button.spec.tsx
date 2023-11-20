import {newSpecPage} from '@stencil/core/testing';
import {SalableButton} from './salable-button';

describe('salable-button', () => {
  it('renders and displays slot content', async () => {
    const buttonText = 'Button Text';
    const page = await newSpecPage({
      components: [SalableButton],
      html: `<salable-button>${buttonText}</salable-button>`,
    });
    const button = page.root.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
    expect(button.textContent).toBe(buttonText);
  });
});
