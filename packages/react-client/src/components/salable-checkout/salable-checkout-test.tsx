import { SalableCheckout } from "@salable/react-library";

export default function SalableCheckoutTest() {
    return (
        <SalableCheckout
            data-testid="component"
            apiKey="xxxxx"
            planUuid="xxxxx"
            granteeId="xxxxx"
            member="xxxxx"
            successUrl="xxxxx"
        />
    );
}
