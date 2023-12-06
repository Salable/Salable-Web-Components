import {SalableInvoices} from "@salable/react-library";

export default function SalableInvoicesTest() {
    return (
        <SalableInvoices
            data-testid="component"
            apiKey="xxxxx"
            subscriptionUuid="xxxxx"
            limit={2}
        />
    );
}
