import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';

test.describe('salable-search', () => {
  test('renders', async ({page}) => {
    await page.setContent('<salable-search></salable-search>');

    const element = await page.locator('salable-search');
    await expect(element).toHaveClass('hydrated');
    await expect(page).toHaveScreenshot();
  });
});
