import {
    FeaturesOnPlans,
    PricingTable,
    PricingTablePlan
} from "../../web-components/src/components/salable-pricing-table/salable-pricing-table";
import objectBuilder from "../object-builder/object-builder";

export const defaultCurrency = {
    shortName: 'USD',
    symbol: '$',
};

const defaultProductCurrency = {
    defaultCurrency: true,
    currency: defaultCurrency,
};

const defaultPlanCurrency = {
    currency: defaultCurrency,
    price: 10,
};

const featureOne: FeaturesOnPlans = {
    feature: {
        displayName: 'Feature One',
        description: 'Something about feature one',
        valueType: 'boolean',
        defaultValue: 'false',
        showUnlimited: false
    },
    value: 'true',
    isUnlimited: false
};

const featureTwo: FeaturesOnPlans = {
    feature: {
        displayName: 'Feature Two',
        description: 'Some slightly longer text explaining what feature two enables',
        valueType: 'enum',
        defaultValue: 'None',
        showUnlimited: false
    },
    value: 'Access',
    isUnlimited: false
};

const featureThree: FeaturesOnPlans = {
    feature: {
        displayName: 'Feature Three',
        description: 'Some text describing feature three this is only available on higher tiers',
        valueType: 'numerical',
        defaultValue: '10',
        showUnlimited: false
    },
    value: '50',
    isUnlimited: false
};

const productPricingTablePlanMock = objectBuilder({
    uuid: 'default-plan-uuid',
    planType: 'Standard',
    displayName: 'Sample Plan',
    currencies: [defaultPlanCurrency],
    features: [
        {
            feature: {
                displayName: 'Sample Feature',
                description: 'This is a sample feature one description',
            },
        }
    ],
    interval: 'month',
    description: 'This is a sample plan',
    licenseType: 'licensed',
    checkoutUrl: 'http://example.com/checkout',
    perSeatAmount: 10,
});

export const pricingTablePlanMock = objectBuilder<PricingTablePlan>({
    plan: {
        uuid: 'basic-monthly-plan-uuid',
        displayName: 'Basic Monthly Plan',
        planType: 'Standard',
        maxSeatAmount: -1,
        perSeatAmount: 1,
        pricingType: 'paid',
        description: 'A basic monthly plan description',
        interval: 'month',
        licenseType: 'licensed',
        features: [
            featureOne,
            featureTwo,
        ],
        currencies: [{currency: defaultCurrency, price: 200}]
    }
})


export const pricingTableMock = objectBuilder<PricingTable>({
    featuredPlanUuid: 'pro-monthly-plan-uuid',
    product: {currencies: [defaultProductCurrency]},
    plans: [
        {
            plan: {
                uuid: 'basic-monthly-plan-uuid',
                displayName: 'Basic Monthly Plan',
                planType: 'Standard',
                maxSeatAmount: -1,
                perSeatAmount: 1,
                pricingType: 'paid',
                description: 'A basic monthly plan description',
                interval: 'month',
                licenseType: 'licensed',
                features: [
                    featureOne,
                    featureTwo,
                ],
                currencies: [{currency: defaultCurrency, price: 200}]
            }
        },
        {
            plan: {
                currencies: [{currency: defaultCurrency, price: 350}],
                uuid: 'pro-monthly-plan-uuid',
                displayName: 'Pro Monthly Plan',
                planType: 'Standard',
                maxSeatAmount: -1,
                perSeatAmount: 1,
                pricingType: 'paid',
                description: 'A pro monthly plan description',
                interval: 'month',
                licenseType: 'licensed',
                features: [
                    featureOne,
                    featureTwo,
                    featureThree
                ]
            }
        },
        {
            plan: {
                currencies: [{currency: defaultCurrency, price: 1000}],
                uuid: 'basic-yearly-plan-uuid',
                displayName: 'Basic Yearly Plan',
                planType: 'Standard',
                licenseType: 'licensed',
                maxSeatAmount: -1,
                perSeatAmount: 1,
                pricingType: 'paid',
                description: 'A basic yearly plan description',
                features: [
                    featureOne,
                    featureTwo,
                ],
                interval: 'year'
            }
        },
        {
            plan: {
                currencies: [{currency: defaultCurrency, price: 1250}],
                uuid: 'pro-yearly-plan-uuid',
                displayName: 'Pro Yearly Plan',
                planType: 'Standard',
                licenseType: 'licensed',
                maxSeatAmount: -1,
                perSeatAmount: 1,
                pricingType: 'paid',
                description: 'A pro yearly plan description',
                features: [
                    featureOne,
                    featureTwo,
                    featureThree
                ],
                interval: 'year'
            }
        },
        {
            plan: {
                currencies: [{currency: defaultCurrency, price: 15000}],
                uuid: 'ultra-yearly-plan-uuid',
                displayName: 'Ultra Yearly Plan',
                planType: 'Standard',
                maxSeatAmount: -1,
                perSeatAmount: 1,
                pricingType: 'paid',
                licenseType: 'licensed',
                description: 'A ultra yearly plan description',
                features: [
                    featureOne,
                    featureTwo,
                    featureThree
                ],
                interval: 'year'
            }
        }
    ],
});

export const productPricingTableMock = objectBuilder({
    currencies: [defaultProductCurrency],
    plans: [
        productPricingTablePlanMock({
            uuid: 'basic-monthly-plan-uuid',
            displayName: 'Basic Monthly Plan',
            description: 'A basic monthly plan description',
            features: [
                featureOne,
                featureTwo,
            ],
            currencies: [{currency: defaultCurrency, price: 200}]
        }),
        productPricingTablePlanMock({
            uuid: 'pro-monthly-plan-uuid',
            displayName: 'Pro Monthly Plan',
            description: 'A pro monthly plan description',
            features: [
                featureOne,
                featureTwo,
                featureThree
            ],
            currencies: [{currency: defaultCurrency, price: 350}]
        }),
        productPricingTablePlanMock({
            uuid: 'basic-yearly-plan-uuid',
            displayName: 'Basic Yearly Plan',
            description: 'A basic yearly plan description',
            features: [
                featureOne,
                featureTwo,
            ],
            currencies: [{currency: defaultCurrency, price: 1000}],
            interval: 'year'
        }),
        productPricingTablePlanMock({
            uuid: 'pro-yearly-plan-uuid',
            displayName: 'Pro Yearly Plan',
            description: 'A pro yearly plan description',
            features: [
                featureOne,
                featureTwo,
                featureThree
            ],
            currencies: [{currency: defaultCurrency, price: 1250}],
            interval: 'year'
        }),
        productPricingTablePlanMock({
            uuid: 'ultra-yearly-plan-uuid',
            displayName: 'Ultra Yearly Plan',
            description: 'A ultra yearly plan description',
            features: [
                featureOne,
                featureTwo,
                featureThree
            ],
            currencies: [{currency: defaultCurrency, price: 15000}],
            interval: 'year'
        }),
    ],
});