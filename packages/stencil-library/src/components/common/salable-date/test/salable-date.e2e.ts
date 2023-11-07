import { newE2EPage } from '@stencil/core/testing';

describe('salable-date', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-date date="2023-04-30"></salable-date>');

    const element = await page.find('salable-date');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with the short date format when the width is less than 200', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-date date="2023-04-30"></salable-date>');
    const element = await page.find('salable-date >>> time'); // Use shadow piercing selector

    expect(element).not.toBeNull();

    const width = await page.$eval('salable-date >>> time', (el) => el.getBoundingClientRect().width);
    if (width <= 200) {
      expect(element.innerText).toMatch(/\d{2}-\d{2}-\d{4}/);
    }
  });

  it('renders with the long date format when the width is greater than 200', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-date date="2023-04-30" style="width: 250px;"></salable-date>');
    const element = await page.find('salable-date >>> time');

    expect(element).not.toBeNull();

    const width = await page.$eval('salable-date >>> time', (el) => el.getBoundingClientRect().width);
    if (width > 200) {
      expect(element.innerText).toMatch(/\d{2} [a-zA-Z]+ \d{4}/);
    }
  });

  it('updates the date format upon resizing', async () => {
    const page = await newE2EPage();
    await page.setContent('<salable-date date="2023-04-30" style="width: 250px;"></salable-date>');
    const element = await page.find('salable-date >>> time');

    expect(element.innerText).toMatch(/\d{2} [a-zA-Z]+ \d{4}/); // Long format initially

    await page.$eval('salable-date', (el: any) => {
      el.style.width = '150px';
    });
    await page.waitForChanges();

    expect(element.innerText).toMatch(/\d{2}-\d{2}-\d{4}/); // Short format after resize
  });
});
