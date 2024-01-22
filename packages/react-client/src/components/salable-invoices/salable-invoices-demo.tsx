import {SalableInvoices} from "@salable/react-library";
import {API_KEY} from "../../constants.ts";

export default function SalableInvoicesDemo() {
    return (
        <SalableInvoices
            apiKey={API_KEY}
            subscriptionUuid="4ffe5998-77af-49b0-815b-66b8269c4abd"
            limit={3}
        />
    )
}
