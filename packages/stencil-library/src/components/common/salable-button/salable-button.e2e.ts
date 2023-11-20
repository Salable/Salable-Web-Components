import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';

test.describe('salable-button', () => {
  test('renders and displays slot content', async ({page}) => {
    const buttonText = 'Button Text';
    await page.setContent(`<salable-button>${buttonText}</salable-button>`);
    const element = page.locator('salable-button');
    await expect(element).toBeVisible();
    await expect(element).toHaveClass('hydrated');
    const slotContent = page.locator('salable-button button');
    await expect(slotContent).toContainText(buttonText);
  });
});
