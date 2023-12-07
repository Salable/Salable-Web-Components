import {SalablePricingTable} from "@salable/react-library";

export default function SalablePricingTableTest() {
    return (
        <SalablePricingTable
            apiKey="xxxxx"
            uuid="xxxxx"
            isCustomPricingTable={false}
            globalSuccessUrl="https://google.com"
            globalCancelUrl="https://google.com"
            globalGranteeId="xxxxx"
            member="xxxxx"
            perPlanGranteeIds="xxxxx::12345,xxxx::54321,xxxxxx::12121"
            perPlanSuccessUrls="xxxxx::https://bing.com,1234::https://aol.com,xxxx::https://yahoo.com"
            perPlanCancelUrls="xxxxx::https://bing.com,1234::https://aol.com,xxxx::https://yahoo.com"
        />
    );
}
