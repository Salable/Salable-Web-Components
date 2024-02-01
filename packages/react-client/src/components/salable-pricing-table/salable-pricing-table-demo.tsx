import {SalablePricingTable} from "@salable/react-library";
import {API_KEY} from "../../constants.ts";
import styles from "../../theme.module.css";

export default function SalablePricingTableDemo() {
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <SalablePricingTable
                apiKey={API_KEY}
                uuid="29c9a7c8-9a41-4e87-9e7e-7c62d293c131"
                globalSuccessUrl="https://google.co.uk"
                globalCancelUrl="https://google.co.uk"
                globalGranteeId="123"
                member="456"
                isCustomPricingTable={false}
                perPlanGranteeIds="351eefac-9b21-4299-8cde-302249d6fb1e::654321,1234::4321,5a866dba-20c9-466f-88ac-e05c8980c90b::54321"
                perPlanSuccessUrls="351eefac-9b21-4299-8cde-302249d6fb1e::https://bing.com,1234::https://aol.com,5a866dba-20c9-466f-88ac-e05c8980c90b::https://yahoo.com"
                perPlanCancelUrls="351eefac-9b21-4299-8cde-302249d6fb1e::https://bing.com,1234::https://aol.com,5a866dba-20c9-466f-88ac-e05c8980c90b::https://yahoo.com"
            />
            <SalablePricingTable
                className={styles.theme}
                apiKey={API_KEY}
                uuid="29c9a7c8-9a41-4e87-9e7e-7c62d293c131"
                globalSuccessUrl="https://google.co.uk"
                globalCancelUrl="https://google.co.uk"
                globalGranteeId="123"
                member="456"
                isCustomPricingTable={false}
                perPlanGranteeIds="351eefac-9b21-4299-8cde-302249d6fb1e::654321,1234::4321,5a866dba-20c9-466f-88ac-e05c8980c90b::54321"
                perPlanSuccessUrls="351eefac-9b21-4299-8cde-302249d6fb1e::https://bing.com,1234::https://aol.com,5a866dba-20c9-466f-88ac-e05c8980c90b::https://yahoo.com"
                perPlanCancelUrls="351eefac-9b21-4299-8cde-302249d6fb1e::https://bing.com,1234::https://aol.com,5a866dba-20c9-466f-88ac-e05c8980c90b::https://yahoo.com"
            />
        </div>
    )
}
