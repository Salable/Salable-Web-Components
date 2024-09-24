import { SalableInvoices } from "@salable/react-web-components";
import styles from "../../theme.module.css";

export default function SalableInvoicesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <h2>Default</h2>
      <SalableInvoices
        sessionToken="58062bb89881fa99379f9f1065404c5c"
        subscriptionUuid="04c4bada-7133-4829-a27c-8e5b00558b9e"
        limit={3}
      />
      <h2>Default Themed</h2>
      <SalableInvoices
        className={styles.theme}
        sessionToken="a0b037804148dcc70b6826b622ab9c1b"
        subscriptionUuid="04c4bada-7133-4829-a27c-8e5b00558b9e"
        limit={3}
      />
    </div>
  );
}
