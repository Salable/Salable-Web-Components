import {SalableInvoices} from "@salable/react-library";

export default function SalableInvoicesDemo() {
    return (
        <SalableInvoices
            apiKey="live_6c93207e7a06015f8cfd9169613fd43a65fb9dfc"
            subscriptionUuid="6491cfdb-e3b1-4749-bd26-eefa7bcb6fc3"
            limit={5}
        />
    )
}
