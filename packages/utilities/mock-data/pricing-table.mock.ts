import objectBuilder from "../object-builder/object-builder";

const defaultCurrency = {
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
        value: 'true'
    },
};

const featureTwo = {
    feature: {
        displayName: 'Feature Two',
        description: 'Some slightly longer text explaining what feature two enables',
        valueType: 'enum',
        value: 'Access'
    },
};

const featureThree = {
    feature: {
        displayName: 'Feature Three',
        description: 'Some text describing feature three this is only available on higher tiers',
        valueType: 'numerical',
        value: '50'
    },
};

const pricingTablePlanBaseMock = objectBuilder({
    plan: {
        uuid: 'default-plan-uuid',
        name: 'Sample Plan',
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
    },
    currencies: [defaultPlanCurrency],
    checkoutUrl: 'http://example.com/checkout',
    perSeatAmount: 10,
});

const productPricingTablePlanMock = objectBuilder({
    uuid: 'default-plan-uuid',
    name: 'Sample Plan',
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

const pricingTablePlanMock = (currencies: any, overrides: any) =>
    pricingTablePlanBaseMock({...overrides, plan: {...overrides.plan, currencies}, currencies});


export const pricingTableMock = objectBuilder({
    featuredPlanUuid: 'pro-monthly-plan-uuid',
    product: {currencies: [defaultProductCurrency]},
    plans: [
        pricingTablePlanMock(
            [{currency: defaultCurrency, price: 200}],
            {
                plan: {
                    uuid: 'basic-monthly-plan-uuid',
                    name: 'Basic Monthly Plan',
                    description: 'A basic monthly plan description',
                    features: [
                        featureOne,
                        featureTwo,
                    ]
                }
            }
        ),
        pricingTablePlanMock(
            [{currency: defaultCurrency, price: 350}],
            {
                plan: {
                    uuid: 'pro-monthly-plan-uuid',
                    name: 'Pro Monthly Plan',
                    description: 'A pro monthly plan description',
                    features: [
                        featureOne,
                        featureTwo,
                        featureThree
                    ]
                }
            }
        ),
        pricingTablePlanMock(
            [{currency: defaultCurrency, price: 1000}],
            {
                plan: {
                    uuid: 'basic-yearly-plan-uuid',
                    name: 'Basic Yearly Plan',
                    description: 'A basic yearly plan description',
                    features: [
                        featureOne,
                        featureTwo,
                    ],
                    interval: 'year'
                }
            }
        ),
        pricingTablePlanMock(
            [{currency: defaultCurrency, price: 1250}],
            {
                plan: {
                    uuid: 'pro-yearly-plan-uuid',
                    name: 'Pro Yearly Plan',
                    description: 'A pro yearly plan description',
                    features: [
                        featureOne,
                        featureTwo,
                        featureThree
                    ],
                    interval: 'year'
                }
            }
        ),
        pricingTablePlanMock(
            [{currency: defaultCurrency, price: 15000}],
            {
                plan: {
                    uuid: 'ultra-yearly-plan-uuid',
                    name: 'Ultra Yearly Plan',
                    description: 'A ultra yearly plan description',
                    features: [
                        featureOne,
                        featureTwo,
                        featureThree
                    ],
                    interval: 'year'
                }
            }
        ),
    ],
});

export const productPricingTableMock = objectBuilder({
    currencies: [defaultProductCurrency],
    plans: [
        productPricingTablePlanMock({
            uuid: 'basic-monthly-plan-uuid',
            name: 'Basic Monthly Plan',
            description: 'A basic monthly plan description',
            features: [
                featureOne,
                featureTwo,
            ],
            currencies: [{currency: defaultCurrency, price: 200}]
        }),
        productPricingTablePlanMock({
            uuid: 'pro-monthly-plan-uuid',
            name: 'Pro Monthly Plan',
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
            name: 'Basic Yearly Plan',
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
            name: 'Pro Yearly Plan',
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
            name: 'Ultra Yearly Plan',
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