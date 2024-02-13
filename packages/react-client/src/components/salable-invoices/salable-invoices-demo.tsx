import {SalableInvoices} from "@salable/react-library";
import {API_KEY} from "../../constants.ts";
import styles from "../../theme.module.css";

export default function SalableInvoicesDemo() {
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <h2>Default</h2>
            <SalableInvoices
                apiKey={API_KEY}
                subscriptionUuid="4ffe5998-77af-49b0-815b-66b8269c4abd"
                limit={3}
            />
            <h2>Default Themed</h2>
            <SalableInvoices
                className={styles.theme}
                apiKey={API_KEY}
                subscriptionUuid="4ffe5998-77af-49b0-815b-66b8269c4abd"
                limit={3}
            />
        </div>
    )
}
