import { Component, h, Host, Prop, State } from '@stencil/core';
import { StatusType } from '../common/salable-status/salable-status';
import { apiUrl } from '../../constants';

export enum InvoiceStatus {
  PAID = 'paid',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void',
  OPEN = 'open',
  DRAFT = 'draft',
}

@Component({
  tag: 'salable-invoices',
  styleUrl: 'salable-invoices.css',
  shadow: true,
})
export class SalableInvoices {
  @State()
  data: any = null;

  @Prop()
  apiKey: string;

  @Prop()
  subscriptionUuid: string;

  @Prop()
  limit: number = 25;

  private currentPage = 1;

  async componentWillLoad() {
    await this.fetchInvoices(this.limit);
  }

  private async fetchInvoices(limit: number, cursor?: string) {
    try {
      const params = new URLSearchParams();
      params.set('take', limit.toString());

      if (cursor) {
        params.set('cursor', cursor);
      }

      const response = await fetch(
        `${apiUrl}/subscriptions/${this.subscriptionUuid}/invoices?${params.toString()}`,
        { headers: { 'x-api-key': `${this.apiKey}` } },
      );

      if (!response.ok) {
        // Todo: handle errors, display failure message, refresh options
        console.error('Failed to fetch data:', response.statusText);
        return;
      }

      this.data = await response.json();
    } catch (error) {
      // Todo: handle errors, display failure message, refresh options
      console.error('Error fetching data:', error);
    }
  }

  getStatus(status: InvoiceStatus) {
    switch (status) {
      case InvoiceStatus.PAID:
        return <salable-status statusType={StatusType.SUCCESS}>Paid</salable-status>;
      case InvoiceStatus.UNCOLLECTIBLE:
        return <salable-status statusType={StatusType.ERROR}>Uncollectible</salable-status>;
      case InvoiceStatus.VOID:
        return <salable-status statusType={StatusType.ERROR}>Void</salable-status>;
      case InvoiceStatus.OPEN:
        return <salable-status statusType={StatusType.WARNING}>Open</salable-status>;
      case InvoiceStatus.DRAFT:
        return <salable-status statusType={StatusType.WARNING}>Draft</salable-status>;
      default:
        return null;
    }
  }

  getNextPage = async () => {
    if(!this.data) return;
    this.currentPage++;
    await this.fetchInvoices(this.limit, this.data.last);
  };

  getPrevPage = async () => {
    if(!this.data) return;
    this.currentPage--;
    await this.fetchInvoices(-this.limit, this.data.first);
  };

  render() {
    return (
      <Host>
        <section class='font-sans max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
          <div class='flex flex-col'>
            <div class='-m-1.5 overflow-x-auto'>
              <div class='p-1.5 min-w-full inline-block align-middle'>
                <div
                  class='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700'>
                  <table class='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                    <thead class='bg-gray-50 dark:bg-slate-800'>
                    <tr slot='table-header'>
                      <th scope='col' class='px-6 py-3 text-left'>
                          <span
                            class='text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200'>
                            Invoice No.
                          </span>
                      </th>
                      <th scope='col' class='px-6 py-3 text-left'>
                          <span
                            class='text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200'>
                            Date
                          </span>
                      </th>
                      <th scope='col' class='px-6 py-3 text-left'>
                          <span
                            class='text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200'>
                            Payment Status
                          </span>
                      </th>
                      <th scope='col' class='px-6 py-3 text-right'></th>
                    </tr>
                    </thead>
                    <tbody class='divide-y divide-gray-200 dark:divide-gray-700'>
                    {this.data?.data?.map(row => (
                      <tr slot='table-body'>
                        <td class='h-px w-px whitespace-nowrap'>
                          <div class='px-6 py-2'>
                            <a class='text-sm text-blue-600 decoration-2 hover:underline dark:text-blue-500'
                               href={row.hosted_invoice_url}>{row.number}</a>
                          </div>
                        </td>
                        <td class='h-px w-px whitespace-nowrap'>
                          <div class='px-6 py-2'>
                            <span class='text-sm text-gray-600 dark:text-gray-400 block w-full'>
                              <salable-date date={row.status_transitions.paid_at * 1000}></salable-date></span>
                          </div>
                        </td>
                        <td class='h-px w-px whitespace-nowrap'>
                          <div class='px-6 py-2'>
                            {this.getStatus(row.status)}
                          </div>
                        </td>
                        <td class='h-px w-px whitespace-nowrap'>
                          <div class='px-6 py-1.5 flex justify-end'>
                            <div
                              class='group inline-flex items-center divide-x divide-gray-300 border border-gray-300 bg-white shadow-sm rounded-md transition-all dark:divide-gray-700 dark:bg-slate-700 dark:border-gray-700'>
                              <a
                                class='py-1.5 px-2 inline-flex justify-center items-center rounded-l-md bg-white text-gray-700 align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800'
                                href={row.invoice_pdf}
                              >
                                <svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' width='16' height='16'
                                     fill='currentColor' viewBox='0 0 16 16'>
                                  <title>Download PDF</title>
                                  <path
                                    d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z' />
                                  <path
                                    d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z' />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  <div
                    class='px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700'>
                    <div class='inline-flex gap-x-2'>
                      {this.currentPage !== 1 ? (
                        <button onClick={this.getPrevPage}
                                type='button'
                                class='py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800'>
                          <svg class='w-3 h-3' xmlns='http://www.w3.org/2000/svg' width='16' height='16'
                               fill='currentColor' viewBox='0 0 16 16'>
                            <path fill-rule='evenodd'
                                  d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z' />
                          </svg>
                          Prev
                        </button>
                      ) : null}
                      {this.data?.hasMore ? (
                        <button onClick={this.getNextPage}
                                type='button'
                                class='py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800'>
                          Next
                          <svg class='w-3 h-3' xmlns='http://www.w3.org/2000/svg' width='16' height='16'
                               fill='currentColor' viewBox='0 0 16 16'>
                            <path fill-rule='evenodd'
                                  d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z' />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Host>
    );
  }
}
