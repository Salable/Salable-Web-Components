import {newSpecPage} from '@stencil/core/testing';
import {SalableInvoices} from '../salable-invoices';

describe('salable-invoices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SalableInvoices],
      html: `<salable-invoices></salable-invoices>`,
    });
    expect(page.root).toEqualHtml(`
      <salable-invoices>
        <mock:shadow-root>
          <section class="font-sans lg:px-8 lg:py-14 mx-auto px-4 py-10 sm:px-6">
            <div class="flex flex-col">
              <div class="-m-1.5 overflow-x-auto">
                <div class="align-middle inline-block min-w-full p-1.5">
                  <div class="bg-white border border-gray-200 dark:bg-slate-900 dark:border-gray-700 overflow-hidden rounded-xl shadow-sm">
                    <table class="dark:divide-gray-700 divide-gray-200 divide-y min-w-full">
                      <thead class="bg-gray-50 dark:bg-slate-800">
                        <tr slot="table-header">
                          <th class="px-6 py-3 text-left" scope="col">
                            <span class="dark:text-gray-200 font-semibold text-gray-800 text-xs tracking-wide uppercase">
                              Invoice No.
                            </span>
                          </th>
                          <th class="px-6 py-3 text-left" scope="col">
                            <span class="dark:text-gray-200 font-semibold text-gray-800 text-xs tracking-wide uppercase">
                              Date
                            </span>
                          </th>
                          <th class="px-6 py-3 text-left" scope="col">
                            <span class="dark:text-gray-200 font-semibold text-gray-800 text-xs tracking-wide uppercase">
                              Payment Status
                            </span>
                          </th>
                          <th class="px-6 py-3 text-right" scope="col"></th>
                        </tr>
                      </thead>
                      <tbody class="dark:divide-gray-700 divide-gray-200 divide-y"></tbody>
                    </table>
                    <div class="border-gray-200 border-t dark:border-gray-700 gap-3 grid md:flex md:items-center md:justify-between px-6 py-4">
                      <div class="gap-x-2 inline-flex"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </mock:shadow-root>
      </salable-invoices>
    `);
  });
});
