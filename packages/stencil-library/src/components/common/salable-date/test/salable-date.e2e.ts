import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';

test.describe('salable-date', () => {
  test('renders', async ({page}) => {
    await page.setContent('<salable-date date="2023-04-30"></salable-date>');

    const element = page.locator('salable-date');
    await expect(element).toHaveClass('hydrated');
  });

  test('renders with the short date format when the width is less than or equal to 200', async ({page}) => {
    await page.setContent('<div style="width: 199px;"><salable-date date="2023-04-30"></salable-date></div>');

    const element = page.locator('salable-date');
    await expect(element).toBeVisible();

    await expect(element.locator('time')).toHaveText(/\d{2}-\d{2}-\d{4}/);
  });

  test('renders with the long date format when the width is greater than 200', async ({page}) => {
    await page.setContent('<div style="width: 201px;"><salable-date date="2023-04-30"></salable-date></div>');

    const element = page.locator('salable-date');
    await expect(element).toBeVisible();

    await expect(element.locator('time')).toHaveText(/\d{2} [a-zA-Z]+ \d{4}/);
  });

  test('updates the date format upon element resizing', async ({page}) => {
    await page.setContent('<salable-date date="2023-04-30"></salable-date>');

    const element = page.locator('salable-date');
    await expect(element.locator('time')).toHaveText(/\d{2} [a-zA-Z]+ \d{4}/);

    await element.evaluate(el => {
      el.style.width = '200px';
    });
    await page.waitForChanges();
    await expect(element.locator('time')).toHaveText(/\d{2}-\d{2}-\d{4}/);

    await element.evaluate(el => {
      el.style.width = '201px';
    });
    await page.waitForChanges();
    await expect(element.locator('time')).toHaveText(/\d{2} [a-zA-Z]+ \d{4}/);
  });
});
