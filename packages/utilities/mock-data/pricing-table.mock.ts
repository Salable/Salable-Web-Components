import objectBuilder, {DeepPartial} from "../object-builder/object-builder";
import {
    Currency,
    PlanCurrency,
    PricingTable, PricingTablePlan,
    ProductCurrency
} from "../../stencil-library/src/components/salable-pricing-table/salable-pricing-table";

const defaultCurrency: Currency = {
    shortName: 'USD',
    symbol: '$',
};

const defaultProductCurrency: ProductCurrency = {
    defaultCurrency: true,
    currency: defaultCurrency,
};

const defaultPlanCurrency: PlanCurrency = {
    currency: defaultCurrency,
    price: 10,
};

const featureOne = {
    feature: {
        displayName: 'Feature One',
        description: 'Something about feature one',
    },
};

const featureTwo = {
    feature: {
        displayName: 'Feature Two',
        description: 'Some slightly longer text explaining what feature two enables',
    },
};

const featureThree = {
    feature: {
        displayName: 'Feature Three',
        description: 'Some text describing feature three this is only available on higher tiers',
    },
};

const pricingTablePlanBaseMock = objectBuilder<PricingTablePlan>({
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

const pricingTablePlanMock = (currencies: PlanCurrency[], overrides: DeepPartial<PricingTablePlan>) =>
    pricingTablePlanBaseMock({...overrides, plan: {...overrides.plan, currencies}, currencies});

export const pricingTableMock = objectBuilder<PricingTable>({
    featuredPlanUuid: 'pro-monthly-plan-uuid',
    product: {currencies: [defaultProductCurrency]},
    plans: [
        pricingTablePlanMock(
            [{currency: defaultCurrency, price: 300}],
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
            [{currency: defaultCurrency, price: 100}],
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
            [{currency: defaultCurrency, price: 3000}],
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
    ],
});
