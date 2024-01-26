import { SalableCheckout } from "@salable/react-library";
import {API_KEY} from "../../constants.ts";
import styles from "../../theme.module.css";

export default function SalableCheckoutDemo() {
    return (
        <>
            <div>
                <SalableCheckout
                    apiKey={API_KEY}
                    planUuid="351eefac-9b21-4299-8cde-302249d6fb1e"
                    member='example-member-123'
                    granteeId='example-grantee-123'
                    successUrl="https://www.google.com"
                />
            </div>
            <div className={styles.theme}>
                <SalableCheckout
                    apiKey={API_KEY}
                    planUuid="351eefac-9b21-4299-8cde-302249d6fb1e"
                    member='example-member-123'
                    granteeId='example-grantee-123'
                    successUrl="https://www.google.com"
                />
            </div>
        </>


    )
}
