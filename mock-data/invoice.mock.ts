import objectBuilder from './object-builder/object-builder';

export const getPaidAt = (day: number, month: number, year: number) => (~~(+new Date(year, month - 1, day) / 1000)).toString()

const mockInvoice = objectBuilder({
  number: 'INV-001',
  status: 'open',
  status_transitions: { paid_at: getPaidAt(4, 4, 1968) },
  hosted_invoice_url: 'https://example.com/invoice/xxxxx',
  invoice_pdf: 'https://example.com/invoice/xxxxx.pdf'
});

export default mockInvoice;

export const mockInvoices = [
  mockInvoice({ number: 'INV-001', status: 'open' }),
  mockInvoice({ number: 'INV-002', status: 'paid' }),
  mockInvoice({ number: 'INV-003', status: 'void' }),
  mockInvoice({ number: 'INV-004', status: 'uncollectible' }),
  mockInvoice({ number: 'INV-005', status: 'draft' }),
];