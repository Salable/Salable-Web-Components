import {test} from 'stencil-playwright';
import {expect} from '@playwright/test';

test.describe('salable-status', () => {
  test('renders', async ({page}) => {
    await page.setContent('<salable-status></salable-status>');
    const element = page.locator('salable-status');
    await expect(element).toHaveClass('hydrated');
  });

  test('displays the correct SVG for success status', async ({page}) => {
    await page.setContent(`<salable-status status-type="success"></salable-status>`);
    const svgElements = page.locator('salable-status svg');
    await expect(svgElements).toHaveCount(1);
    const svgElement = page.locator('salable-status svg#success-svg');
    await expect(svgElement).toBeVisible();
  });

  test('displays the correct SVG for warning status', async ({page}) => {
    await page.setContent(`<salable-status status-type="warning"></salable-status>`);
    const svgElements = page.locator('salable-status svg');
    await expect(svgElements).toHaveCount(1);
    const svgElement = page.locator('salable-status svg#warning-svg');
    await expect(svgElement).toBeVisible();
  });

  test('displays the correct SVG for error status', async ({page}) => {
    await page.setContent(`<salable-status status-type="error"></salable-status>`);
    const svgElements = page.locator('salable-status svg');
    await expect(svgElements).toHaveCount(1);
    const svgElement = page.locator('salable-status svg#error-svg');
    await expect(svgElement).toBeVisible();
  });

  test('displays the text content correctly', async ({page}) => {
    const testContent = 'Status message';
    await page.setContent(`<salable-status>${testContent}</salable-status>`);
    const element = page.locator('salable-status');
    await expect(element).toHaveText(testContent);
  });
});
