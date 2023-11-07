import { newE2EPage } from '@stencil/core/testing';
import { StatusType } from '../salable-status'; // Assuming the enum is exported from the component file

describe('salable-status', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-status></salable-status>');

    const element = await page.find('salable-status');
    expect(element).toHaveClass('hydrated');
  });

  it('displays the correct SVG for success status', async () => {
    const page = await newE2EPage();
    await page.setContent(`<salable-status status-type="${StatusType.SUCCESS}"></salable-status>`);

    const svgElements = await page.findAll('salable-status svg');
    expect(svgElements).toHaveLength(1);
    const svgElement = await page.find('salable-status svg#success-svg');
    expect(svgElement).not.toBeNull();
  });

  it('displays the correct SVG for warning status', async () => {
    const page = await newE2EPage();
    await page.setContent(`<salable-status status-type="${StatusType.WARNING}"></salable-status>`);

    const svgElements = await page.findAll('salable-status svg');
    expect(svgElements).toHaveLength(1);
    const svgElement = await page.find('salable-status svg#warning-svg');
    expect(svgElement).not.toBeNull();
  });

  it('displays the correct SVG for error status', async () => {
    const page = await newE2EPage();
    await page.setContent(`<salable-status status-type="${StatusType.ERROR}"></salable-status>`);

    const svgElements = await page.findAll('salable-status svg');
    expect(svgElements).toHaveLength(1);
    const svgElement = await page.find('salable-status svg#error-svg');
    expect(svgElement).not.toBeNull();
  });

  it('displays the text content correctly', async () => {
    const testContent = 'Status message';
    const page = await newE2EPage();
    await page.setContent(`<salable-status>${testContent}</salable-status>`);

    const element = await page.find('salable-status');
    const content = element.innerText;
    expect(content).toBe(testContent);
  });
});
