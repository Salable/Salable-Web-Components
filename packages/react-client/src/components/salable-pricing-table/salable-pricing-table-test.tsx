import {SalablePricingTable} from "@salable/react-web-components";

export default function SalablePricingTableTest() {
    return (
        <SalablePricingTable
            apiKey="test_xxxxx"
            uuid="xxxxx"
            isCustomPricingTable={true}
            globalSuccessUrl="https://google.com"
            globalCancelUrl="https://google.com"
            globalGranteeId="xxxxx"
            member="xxxxx"
            currency="USD"
        />
    );
}
