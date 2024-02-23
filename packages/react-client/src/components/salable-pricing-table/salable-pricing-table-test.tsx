import {SalablePricingTable} from "@salable/react-library";

export default function SalablePricingTableTest() {
    return (
        <SalablePricingTable
            apiKey="xxxxx"
            uuid="xxxxx"
            isCustomPricingTable={true}
            globalSuccessUrl="https://google.com"
            globalCancelUrl="https://google.com"
            globalGranteeId="xxxxx"
            member="xxxxx"
        />
    );
}
