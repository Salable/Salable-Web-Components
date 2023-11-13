import {paginate, PaginatedResult} from '../../paginate/paginate';

export type Invoice = {
    number: string;
    status: string;
    status_transitions: StatusTransitions;
    hosted_invoice_url: string;
    invoice_pdf: string;
}

interface StatusTransitions {
    paid_at: string;
}

class InvoiceRepository {
    private readonly _invoices: Invoice[];

    constructor(mockInvoices: Invoice[]) {
        this._invoices = [...mockInvoices];
    }

    get invoices(): Invoice[] {
        return this._invoices;
    }

    paginate(cursor?: string, take: number = 5): PaginatedResult<Invoice> {
        return paginate(this._invoices, 'number', cursor, take);
    }
}

export default InvoiceRepository;
