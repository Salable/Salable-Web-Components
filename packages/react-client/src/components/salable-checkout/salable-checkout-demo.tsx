import { SalableCheckout } from "@salable/react-library";

export default function SalableCheckoutDemo() {
    return (
        <SalableCheckout
            apiKey="live_6c93207e7a06015f8cfd9169613fd43a65fb9dfc"
            planUuid="2410d3bb-3a1e-41dd-8643-6c3d9772445d"
            member='example-member-123'
            granteeId='example-grantee-123'
            successUrl="https://www.google.com"
        />
    )
}
