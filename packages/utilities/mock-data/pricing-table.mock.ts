import objectBuilder from "../object-builder/object-builder";
import {PricingTable} from "../types/pricing-table";

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

const booleanFeature = {
    feature: {
        displayName: 'Boolean',
        description: 'Something about a boolean feature',
        valueType: 'boolean',
        defaultValue: 'false',
        showUnlimited: false
    },
    value: 'true',
    isUnlimited: false
};

const enumFeature = {
    feature: {
        displayName: 'Text options feature',
        description: 'Some slightly longer text explaining what the text options feature enables',
        valueType: 'enum',
        defaultValue: 'None',
        showUnlimited: false
    },
    enumValue: {name: 'Access'},
    value: 'Access',
    isUnlimited: false
};

const numericalFeature = {
    feature: {
        displayName: 'Numerical only',
        description: 'Some text describing numerical feature',
        valueType: 'numerical',
        defaultValue: '10',
        showUnlimited: false
    },
    value: '50',
    isUnlimited: false
};

const unlimitedNumericalFeature = {
    feature: {
        displayName: 'Unlimited numerical',
        description: 'Some text describing this numerical feature which is unlimited',
        valueType: 'numerical',
        defaultValue: '10',
        showUnlimited: true
    },
    value: 'Unlimited',
    isUnlimited: true
};

const productPricingTablePlanMock = objectBuilder({
    uuid: 'default-plan-uuid',
    planType: 'Standard',
    displayName: 'Sample Plan',
    currencies: [defaultPlanCurrency],
    pricingType: 'free',
    features: [
        {feature: numericalFeature.feature},
        {feature: unlimitedNumericalFeature.feature},
        {feature: booleanFeature.feature},
        {feature: enumFeature.feature},
    ],
    evalDays: 0,
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
            unlimitedNumericalFeature,
            booleanFeature,
            enumFeature,
            numericalFeature,
        ],
        currencies: [{currency: defaultCurrency, price: 200}],
        grantee: {
            isSubscribed: false,
            isLicensed: false,
        }
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
                evalDays: 0,
                pricingType: 'paid',
                description: 'A basic monthly plan description',
                interval: 'month',
                licenseType: 'licensed',
                features: [
                    unlimitedNumericalFeature,
                    booleanFeature,
                    enumFeature,
                    numericalFeature,
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
                evalDays: 7,
                maxSeatAmount: -1,
                perSeatAmount: 1,
                pricingType: 'paid',
                description: 'A pro monthly plan description',
                interval: 'month',
                licenseType: 'licensed',
                features: [
                    unlimitedNumericalFeature,
                    booleanFeature,
                    enumFeature,
                    numericalFeature,
                ],
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
                evalDays: 0,
                pricingType: 'paid',
                description: 'A basic yearly plan description',
                features: [
                    unlimitedNumericalFeature,
                    booleanFeature,
                    enumFeature,
                    numericalFeature,
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
                evalDays: 0,
                pricingType: 'paid',
                description: 'A pro yearly plan description',
                features: [
                    unlimitedNumericalFeature,
                    booleanFeature,
                    enumFeature,
                    numericalFeature,
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
                evalDays: 0,
                description: 'A ultra yearly plan description',
                features: [
                    unlimitedNumericalFeature,
                    booleanFeature,
                    enumFeature,
                    numericalFeature,
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
                unlimitedNumericalFeature,
                booleanFeature,
                enumFeature,
                numericalFeature,
            ],
            currencies: [{currency: defaultCurrency, price: 200}]
        }),
        productPricingTablePlanMock({
            uuid: 'pro-monthly-plan-uuid',
            displayName: 'Pro Monthly Plan',
            description: 'A pro monthly plan description',
            pricingType: 'paid',
            evalDays: 7,
            features: [
                unlimitedNumericalFeature,
                booleanFeature,
                enumFeature,
                numericalFeature,
            ],
            currencies: [{currency: defaultCurrency, price: 350}]
        }),
        productPricingTablePlanMock({
            uuid: 'basic-yearly-plan-uuid',
            displayName: 'Basic Yearly Plan',
            description: 'A basic yearly plan description',
            pricingType: 'paid',
            features: [
                unlimitedNumericalFeature,
                booleanFeature,
                enumFeature,
                numericalFeature,
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
                unlimitedNumericalFeature,
                booleanFeature,
                enumFeature,
                numericalFeature,
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
                unlimitedNumericalFeature,
                booleanFeature,
                enumFeature,
                numericalFeature,
            ],
            currencies: [{currency: defaultCurrency, price: 15000}],
            interval: 'year'
        }),
    ],
});