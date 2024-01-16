import {SalableInvoices} from "@salable/react-library";

export default function SalableInvoicesDemo() {
    return (
        <SalableInvoices
            apiKey="rQLiYnXRAjndJbijbz2WalGvtL7oeeq1Am5cCDva"
            subscriptionUuid="4ffe5998-77af-49b0-815b-66b8269c4abd"
            limit={3}
        />
    )
}
