import { SalableCheckout } from "@salable/react-web-components";
import { API_KEY } from "../../constants.ts";
import styles from "../../theme.module.css";

export default function SalableCheckoutDemo() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <h2>Default</h2>
            <SalableCheckout
                apiKey={API_KEY}
                planUuid="351eefac-9b21-4299-8cde-302249d6fb1e"
                member='example-member-123'
                granteeId='example-grantee-123'
                successUrl="https://www.google.com"
                currency="USD"
            />
            <h2>With Valid Email</h2>
            <SalableCheckout
                apiKey={API_KEY}
                planUuid="351eefac-9b21-4299-8cde-302249d6fb1e"
                member='example-member-123'
                granteeId='example-grantee-123'
                successUrl="https://www.google.com"
                email='johnnydoe@email.com'
                currency="USD"
            />
             <h2>Theming</h2>
            <SalableCheckout
                className={styles.theme}
                apiKey={API_KEY}
                planUuid="351eefac-9b21-4299-8cde-302249d6fb1e"
                member='example-member-123'
                granteeId='example-grantee-123'
                successUrl="https://www.google.com"
                currency="USD"
            />
        </div>
    )
}
