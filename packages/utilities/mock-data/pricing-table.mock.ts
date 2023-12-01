import objectBuilder from "../object-builder/object-builder";
import {
    Currency, Feature, Plan, PlanCurrency, PricingTable,
    PricingTablePlan, PricingTableProduct, ProductCurrency
} from "../../stencil-library/src/components/salable-pricing-table/salable-pricing-table";

const defaultCurrency: Currency = {
    shortName: 'USD',
    symbol: '$',
};

const defaultProductCurrency: ProductCurrency = {
    defaultCurrency: true,
    currency: defaultCurrency,
};

const defaultFeature: Feature = {
    feature: {
        displayName: 'Sample Feature',
        description: 'This is a sample feature description',
    },
};

const defaultPlanCurrency: PlanCurrency = {
    currency: defaultCurrency,
    price: 100,
};

const defaultPlan: Plan = {
    uuid: 'default-plan-uuid',
    name: 'Sample Plan',
    currencies: [defaultPlanCurrency],
    features: [defaultFeature],
    interval: 'month',
    description: 'This is a sample plan',
    licenseType: 'licensed',
};

const defaultPricingTablePlan: PricingTablePlan = {
    plan: defaultPlan,
    currencies: [defaultPlanCurrency],
    checkoutUrl: 'http://example.com/checkout',
    perSeatAmount: 10,
};

const defaultPricingTableProduct: PricingTableProduct = {
    currencies: [defaultProductCurrency],
};

const defaultPricingTable: PricingTable = {
    featuredPlanUuid: 'default-plan-uuid',
    product: defaultPricingTableProduct,
    plans: [defaultPricingTablePlan],
};

export const currencyMock = objectBuilder<Currency>(defaultCurrency);
export const productCurrencyMock = objectBuilder<ProductCurrency>(defaultProductCurrency);
export const featureMock = objectBuilder<Feature>(defaultFeature);
export const planCurrencyMock = objectBuilder<PlanCurrency>(defaultPlanCurrency);
export const planMock = objectBuilder<Plan>(defaultPlan);
export const pricingTablePlanMock = objectBuilder<PricingTablePlan>(defaultPricingTablePlan);
export const pricingTableProductMock = objectBuilder<PricingTableProduct>(defaultPricingTableProduct);
export const pricingTableMock = objectBuilder<PricingTable>(defaultPricingTable);
