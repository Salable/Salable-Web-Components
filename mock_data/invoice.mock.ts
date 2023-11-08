import objectBuilder from './object-builder/object-builder';
import { InvoiceStatus } from '../src/components/salable-invoices/salable-invoices';

const mockInvoice = objectBuilder({
  number: 'INV-001',
  status: InvoiceStatus.OPEN,
  status_transitions: { paid_at: (~~(Date.now() / 1000)).toString() },
  hosted_invoice_url: 'https://example.com/invoice/INV-001',
  invoice_pdf: 'https://example.com/invoice/INV-001.pdf'
});

export default mockInvoice;
