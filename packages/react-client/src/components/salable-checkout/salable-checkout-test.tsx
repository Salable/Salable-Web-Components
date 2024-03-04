import { SalableCheckout } from "@salable/react-web-components";

export default function SalableCheckoutTest({ email }: { email?: string }) {
    return (
        <SalableCheckout
            data-testid="component"
            apiKey="test_xxxxx"
            planUuid="xxxxx"
            granteeId="xxxxx"
            member="xxxxx"
            successUrl="xxxxx"
            email={email}
        />
    );
}
