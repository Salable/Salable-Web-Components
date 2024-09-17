import objectBuilder from "../object-builder/object-builder";

export type PricingTable = {
    featuredPlanUuid: string
    product: PricingTableProduct
    plans: PricingTablePlan[]
}

export type PricingTablePlan = {
    plan: Plan
}

type PricingTableProduct = {
    currencies: ProductCurrency[]
}

export type ProductPricingTable = PricingTableProduct & {
    plans: Plan[]
}

export type ProductCurrency = {
    defaultCurrency: boolean
    currency: Currency
}

export type Plan = {
    uuid: string
    planType: string;
    displayName: string
    currencies: PlanCurrency[]
    features?: FeaturesOnPlans[]
    interval: string
    description: string
    licenseType: string
    pricingType: string
    perSeatAmount: number;
    maxSeatAmount: number;
    grantee?: {
        isSubscribed: boolean;
        isLicensed: boolean
    }
}

type PlanCurrency = {
    currency: Currency
    price: number
}

type Currency = {
    shortName: string
    symbol: string
    defaultCurrency?: boolean
}

export type FeaturesOnPlans = {
    value: string
    isUnlimited: boolean
    enumValue?: {
        name: string
    }
    feature: Feature;
}

export type Feature = {
    displayName: string
    valueType: string
    defaultValue: string
    showUnlimited: boolean
    description?: string
}

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

const featureOne = {
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

const featureTwo = {
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

const featureThree = {
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
    pricingType: 'free',
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

export const pricingTablePlanMock = objectBuilder({
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
        currencies: [{currency: defaultCurrency, price: 200}],
        grantee: {
            isSubscribed: false,
            isLicensed: false,
        }
    }
})


export const pricingTableMock = objectBuilder({
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
                currencies: [{currency: defaultCurrency, price: 200}],
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
            pricingType: 'paid',
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
            pricingType: 'paid',
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
            pricingType: 'paid',
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
            pricingType: 'paid',
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
            pricingType: 'paid',
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