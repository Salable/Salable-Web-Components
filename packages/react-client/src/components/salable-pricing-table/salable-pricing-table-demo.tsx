import {SalablePricingTable} from "@salable/react-library";

export default function SalablePricingTableDemo() {
    return (
        <SalablePricingTable
            apiKey="q96kzgtnz5acBX73gjQy47d4GowStfNc6VgasQRS"
            uuid="aec06de8-3a3e-46eb-bd09-f1094c1b1b8d"
            globalSuccessUrl="https://google.co.uk"
            globalCancelUrl="https://google.co.uk"
            globalGranteeId="123"
            member="456"
            perPlanGranteeIds="351eefac-9b21-4299-8cde-302249d6fb1e::654321,1234::4321,5a866dba-20c9-466f-88ac-e05c8980c90b::54321"
            perPlanSuccessUrls="351eefac-9b21-4299-8cde-302249d6fb1e::https://bing.com,1234::https://aol.com,5a866dba-20c9-466f-88ac-e05c8980c90b::https://yahoo.com"
            perPlanCancelUrls="351eefac-9b21-4299-8cde-302249d6fb1e::https://bing.com,1234::https://aol.com,5a866dba-20c9-466f-88ac-e05c8980c90b::https://yahoo.com"
        />
    )
}
