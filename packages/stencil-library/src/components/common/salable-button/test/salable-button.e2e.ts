import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';

test.describe('salable-button', () => {
  test('renders', async ({page}) => {
    await page.setContent('<salable-button></salable-button>');

    const element = await page.locator('salable-button');
    await expect(element).toBeVisible();
    await expect(element).toHaveClass('hydrated');
    await expect(page).toHaveScreenshot();
  });

  test('displays slot content correctly', async ({page}) => {
    const testContent = 'Click me!';
    await page.setContent(`<salable-button>${testContent}</salable-button>`);

    const slotContent = await page.locator('salable-button button');
    await expect(slotContent).toContainText(testContent);
  });
});
