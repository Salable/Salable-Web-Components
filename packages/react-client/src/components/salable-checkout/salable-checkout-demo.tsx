import { SalableCheckout } from "@salable/react-library";

export default function SalableCheckoutDemo({ email }: { email?: string }) {
    return (
        <SalableCheckout
            apiKey="rQLiYnXRAjndJbijbz2WalGvtL7oeeq1Am5cCDva"
            planUuid="351eefac-9b21-4299-8cde-302249d6fb1e"
            member='example-member-123'
            granteeId='example-grantee-123'
            successUrl="https://www.google.com"
            email={email}
        />
    )
}
