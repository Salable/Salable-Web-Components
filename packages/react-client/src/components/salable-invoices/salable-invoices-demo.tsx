import { SalableInvoices } from "@salable/react-web-components";
import styles from "../../theme.module.css";
import { SESSION_TOKEN } from "../../constants";

export default function SalableInvoicesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <h2>Default</h2>
      <SalableInvoices
        sessionToken={SESSION_TOKEN}
        subscriptionUuid="0145260e-99c3-49ce-88f8-9b458ab8f814"
        limit={3}
      />
      <h2>Default Themed</h2>
      <SalableInvoices
        className={styles.theme}
        sessionToken={SESSION_TOKEN}
        subscriptionUuid="1c141ab7-ae1d-464d-b9bd-94f947487aa0"
        limit={3}
      />
    </div>
  );
}
