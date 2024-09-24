import { Stripe } from "stripe";

export type Invoices = {
  hasMore: boolean;
  first: string;
  last: string;
  data: Stripe.Invoice[];
};
