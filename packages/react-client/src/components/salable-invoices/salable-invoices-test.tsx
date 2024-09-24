import { SalableInvoices } from "@salable/react-web-components";

export default function SalableInvoicesTest() {
  return (
    <SalableInvoices
      data-testid="component"
      sessionToken="xxxxx"
      subscriptionUuid="xxxxx"
      limit={2}
    />
  );
}
