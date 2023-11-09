import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';

test.describe('salable-date', () => {
  test('renders', async ({page}) => {
    await page.setContent('<salable-date date="2023-04-30"></salable-date>');

    const element = page.locator('salable-date');
    await expect(element).toHaveClass('hydrated');
    await expect(page).toHaveScreenshot();
  });

  test('renders with the short date format when the width is less than 200', async ({page}) => {
    await page.setContent('<salable-date date="2023-04-30"></salable-date>');

    const element = page.locator('salable-date');
    await expect(element).toBeVisible();

    const width = await element.evaluate(el => el.shadowRoot.querySelector('time').getBoundingClientRect().width);
    if (width <= 200) {
      await expect(element.locator('time')).toHaveText(/\d{2}-\d{2}-\d{4}/);
    }
  });

  test('renders with the long date format when the width is greater than 200', async ({page}) => {
    await page.setContent('<salable-date date="2023-04-30" style="width: 250px;"></salable-date>');

    const element = page.locator('salable-date');
    await expect(element).toBeVisible();

    const width = await element.evaluate(el => el.shadowRoot.querySelector('time').getBoundingClientRect().width);
    if (width > 200) {
      await expect(element.locator('time')).toHaveText(/\d{2} [a-zA-Z]+ \d{4}/);
    }
  });

  test('updates the date format upon resizing', async ({page}) => {
    await page.setContent('<salable-date date="2023-04-30" style="width: 250px;"></salable-date>');

    const element = page.locator('salable-date');
    // Long format initially
    await expect(element.locator('time')).toHaveText(/\d{2} [a-zA-Z]+ \d{4}/);

    // Resize logic
    await element.evaluate(el => {
      el.style.width = '150px';
    });
    await page.waitForChanges();

    // Short format after resize
    await expect(element.locator('time')).toHaveText(/\d{2}-\d{2}-\d{4}/);
  });
});
