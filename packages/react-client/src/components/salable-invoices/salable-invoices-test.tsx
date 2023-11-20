import {SalableInvoices} from "@salable/react-library";

export default function SalableInvoicesTest() {
    return (
        <SalableInvoices
            data-testid="component"
            api-key="xxxxx"
            subscription-uuid="xxxxx"
            limit={2}
        />
    );
}
