import objectBuilder from "../object-builder/object-builder";

export const mockCheckout = objectBuilder({
    licenseType: "metered",
    interval: "month",
    product: {
        organisationPaymentIntegration: {
            accountId: "account_xxxxx",
        }
    },
    pricingType: 'paid',
    currencies: [
        {
            planUuid: "plan_xxxxx",
            currencyUuid: "currency_xxxxx",
            price: 999,
            paymentIntegrationPlanId: "plan_xxxxxx",
            currency: {
                uuid: "currency_xxxxx",
                shortName: "USD",
                longName: "United States Dollar",
                symbol: "$"
            }
        }
    ]
});

export default mockCheckout;