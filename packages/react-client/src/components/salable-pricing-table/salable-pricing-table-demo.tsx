import { SalablePricingTable } from "@salable/react-web-components";
import { PRICING_TABLE_UUID, SESSION_TOKEN } from "../../constants.ts";
import styles from "../../theme.module.css";

export default function SalablePricingTableDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <h2>Default</h2>
      <SalablePricingTable
        sessionToken={SESSION_TOKEN}
        uuid={PRICING_TABLE_UUID}
        globalSuccessUrl="https://google.co.uk"
        globalCancelUrl="https://google.co.uk"
        globalGranteeId="123"
        globalContactUrl="https://example.com/contact"
        currency="gbp"
        member="456"
        isCustomPricingTable={false}
      />
      <h2>Default Themed</h2>
      <SalablePricingTable
        className={styles.theme}
        sessionToken={SESSION_TOKEN}
        uuid={PRICING_TABLE_UUID}
        globalSuccessUrl="https://google.co.uk"
        globalCancelUrl="https://google.co.uk"
        globalGranteeId="123"
        globalContactUrl="https://example.com/contact"
        currency="gbp"
        member="456"
        isCustomPricingTable={false}
        perPlanGranteeIds='{"5a866dba-20c9-466f-88ac-e05c8980c90b": "654321", "22266dba-20c9-466f-88ac-e05c8980c222": "123456", "111eefac-9b21-4299-8cde-302249d6f111": "123321"}'
        perPlanSuccessUrls='{"5a866dba-20c9-466f-88ac-e05c8980c90b": "https://example.com/success-one", "22266dba-20c9-466f-88ac-e05c8980c222": "https://example.com/success-two", "111eefac-9b21-4299-8cde-302249d6f111": "https://example.com/success-three"}'
        perPlanCancelUrls='{"5a866dba-20c9-466f-88ac-e05c8980c90b": "https://example.com/cancel-one", "22266dba-20c9-466f-88ac-e05c8980c222": "https://example.com/cancel-two", "111eefac-9b21-4299-8cde-302249d6f111": "https://example.com/cancel-three"}'
      />
    </div>
  );
}
