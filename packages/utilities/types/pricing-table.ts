/**
 * File required due to sharing types between packages
 * */

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
  evalDays: number;
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