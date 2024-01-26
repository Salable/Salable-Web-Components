import {Component, h, Host, Prop, State, Watch} from '@stencil/core';
import {apiUrl} from "../../constants";

type PricingTableState = {
  monthly: PricingTablePlan[],
  yearly: PricingTablePlan[],
  featuredPlanUuid: string | null,
  defaultCurrencyShortName: string | null,
}

type PlanConfig = {
  successUrls: [string, string][];
  granteeIds: [string, string][];
  cancelUrls: [string, string][];
}

type PricingTable = {
  featuredPlanUuid: string;
  product: PricingTableProduct;
  plans: PricingTablePlan[];
}

type PricingTableProduct = {
  currencies: ProductCurrency[];
}

type ProductCurrency = {
  defaultCurrency: boolean
  currency: Currency
}

type PricingTablePlan = {
  plan: Plan;
  currencies: PlanCurrency[];
  checkoutUrl?: string;
  perSeatAmount?: number;
}

type Plan = {
  uuid: string;
  name: string;
  currencies: PlanCurrency[];
  features?: Feature[];
  interval: 'month' | 'year';
  description: string;
  licenseType: 'licensed' | 'metered' | 'perSeat';
}

type PlanCurrency = {
  currency: Currency;
  price: number;
}

type Currency = {
  shortName: string;
  symbol: string;
  defaultCurrency?: boolean;
}

type Feature = {
  feature: {
    displayName: string;
    description: string;
  };
}

@Component({
  tag: 'salable-pricing-table',
  styleUrl: 'salable-pricing-table.css',
  shadow: true,
})
export class SalablePricingTable {
  @State() planConfig: PlanConfig | null = null;
  @State() state: PricingTableState | null = null; // Todo: define type
  @State() errorMessage: string | null = null;
  @State() selectedBillingPeriodKey: 'monthly' | 'yearly' = 'monthly';
  /**
   * The publishable api key, this can be generated in the Salable dashboard
   **/
  @Prop() apiKey!: string;
  /**
   * The uuid of the pricing table that you want to display.
   **/
  @Prop() uuid!: string;
  /**
   * If you provided the uuid of a custom pricing table set this to true
   **/
  @Prop() isCustomPricingTable: boolean = false;
  /**
   * The URL to send users to after a successful purchase. Must be an absolute URL.
   **/
  @Prop() globalSuccessUrl!: string;
  /**
   * The URL to send users to if the transaction fails. Must be an absolute URL.
   **/
  @Prop() globalCancelUrl!: string;
  /**
   * The unique identifier for the grantee for all plan checkouts links.
   **/
  @Prop() globalGranteeId!: string;
  /**
   * The ID of the member who will manage the license.
   **/
  @Prop() member!: string;
  /**
   * Used to pre-fill the promo code in Stripe checkout. Use the promo code ID from Stripe dashboard.
   * Customers cannot edit this field during checkout.
   **/
  @Prop() promoCode: string;
  /**
   * Enables the promo code field in Stripe checkout. Accepts 'true' or 'false'.
   * Cannot be used with promoCode.
   **/
  @Prop() allowPromoCode: string;
  /**
   * Pre-fills the customer email in Stripe checkout.
   **/
  @Prop() customerEmail: string;
  /**
   * The ID of an existing customer in your payment integration.
   * This pre-fills the email, card details, and postcode at checkout.
   **/
  @Prop() customerId: string;
  /**
   * Uses the currency short name (e.g., USD). Defaults to the default currency on the Product
   * which the Plan is linked to. Currently only supported on payment integration type 'stripe_existing'.
   **/
  @Prop() currency: string; // if this present use it otherwise use default from plan
  /**
   * Automatically calculate tax on checkout based on the customer's location and your Stripe settings.
   **/
  @Prop() automaticTax: string;
  /**
   * Configure granteeIds per plan, string format `planUuidOne:granteeIdOne,planUuidTwo:granteeIdTwo`
   **/
  @Prop() perPlanGranteeIds: string;
  /**
   * Configure successUrls per plan, string format `planUuidOne:successUrlOne,planUuidTwo:successUrlTwo`
   **/
  @Prop() perPlanSuccessUrls: string;
  /**
   * Configure cancelUrls per plan, string format `planUuidOne:cancelUrlOne,planUuidTwo:cancelUrlTwo`
   **/
  @Prop() perPlanCancelUrls: string;
  private toggleIntervalEl: HTMLInputElement;

  @Watch('apiKey')
  @Watch('uuid')
  @Watch('globalSuccessUrl')
  @Watch('globalCancelUrl')
  @Watch('globalGranteeId')
  @Watch('member')
  validateProp(newValue: string, propName: string) {
    if (typeof newValue !== 'string' || newValue.trim() === '') {
      throw new Error(`${propName} is a required property and cannot be empty`);
    }
  }

  async componentWillLoad() {
    this.validateProps();
    this.initPlanConfig();
    const data = await this.fetchPricingTable();
    if (Boolean(data)) {
      const normalisedData = this.pricingTableFactory(data);
      this.state = this.initialiseState(normalisedData)
    }
  }

  render() {
    return (
      <Host>
        <div class="font-sans">
          {this.errorMessage}
          {this.state.monthly.length > 0 && this.state.yearly.length > 0 ? (
            <section class="flex justify-center items-center mb-12">
              <label
                class="min-w-[3.5rem] text-sm text-gray-500 me-3 dark:text-gray-400"
                htmlfor="interval-toggle"
                onClick={this.handleToggleBillingPeriodMonthly}
              >Monthly</label>

              <input
                type="checkbox"
                id="interval-toggle"
                class="relative w-[3.25rem] h-7 p-px bg-gray-200 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-primary-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-primary-600 checked:border-primary-600 focus:checked:border-primary-600 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-primary-500 dark:checked:border-primary-500 dark:focus:ring-offset-gray-600 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-white before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-white"
                ref={(el) => {
                  this.toggleIntervalEl = el as HTMLInputElement
                }}
                onInput={this.handleToggleBillingPeriod}
              />

              <label
                class="relative min-w-[3.5rem] text-sm text-gray-500 ms-3 dark:text-gray-400"
                htmlfor="interval-toggle"
                onClick={this.handleToggleBillingPeriodYearly}
              >Annual</label>
            </section>
          ) : null}

          <div class={`grid ${this.getColumnCount()} gap-6 lg:items-center`}>
            {this.state[this.selectedBillingPeriodKey].map(({plan}, i) => (
              <section class={this.getCardClass(plan)} data-testid={`pricing-table-card-${i}`}>
                <h3 class="font-medium text-lg text-gray-800 dark:text-gray-200"
                    id="pricing-table-card-heading">{plan.name}</h3>
                {plan.currencies.length > 0 ? (
                  <div class='mt-4'>
                    <span class="font-bold text-2xl">{this.getCurrency(plan)?.currency.symbol}</span>
                    <span class="font-bold text-5xl text-gray-800 dark:text-gray-200">
                        {this.getCurrency(plan)?.price}
                      </span>
                    <span
                      class="text-xl text-grey-500"> per {this.planUnitValue(plan.licenseType, plan.interval)}</span>
                  </div>
                ) : (
                  <div class='mt-4'>
                    <span class="font-bold text-5xl text-gray-800 dark:text-gray-200">Free</span>
                  </div>
                )}
                <p class="mt-2 text-sm text-gray-500">{plan.description}</p>

                <ul class="mt-7 mb-5 space-y-2.5 text-sm mx-auto">
                  {plan.features?.map(feature => (
                    <li class="flex space-x-2">
                      <svg class="flex-shrink-0 mt-0.5 h-4 w-4 text-primary-600 dark:text-primary-500"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <div>
                        <h4 class="text-gray-800 dark:text-gray-400 text-left">
                          {feature.feature.displayName}
                        </h4>
                        <p class="text-gray-800 dark:text-gray-400 text-left">
                          {feature.feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  class="mt-auto inline-flex justify-center items-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                  onClick={this.handlePlanSelect(plan)}>
                  Select Plan
                </button>
              </section>
            ))}
          </div>
        </div>
      </Host>
    );
  }

  private validateProps() {
    this.validateProp(this.apiKey, 'apiKey');
    this.validateProp(this.uuid, 'uuid');
    this.validateProp(this.globalSuccessUrl, 'globalSuccessUrl');
    this.validateProp(this.globalCancelUrl, 'globalCancelUrl');
    this.validateProp(this.globalGranteeId, 'globalGranteeId');
    this.validateProp(this.member, 'member');
  }

  private async fetchPricingTable(): Promise<PricingTable | null> {
    try {
      const params = new URLSearchParams({
        globalSuccessUrl: this.globalSuccessUrl,
        globalCancelUrl: this.globalCancelUrl,
        globalGranteeId: this.globalGranteeId,
        member: this.member,
      });

      if (Boolean(this.promoCode)) {
        params.set('promoCode', this.promoCode);
      }

      if (Boolean(this.allowPromoCode)) {
        params.set('allowPromoCode', this.allowPromoCode);
      }

      if (Boolean(this.automaticTax)) {
        params.set('automaticTax', this.automaticTax);
      }

      if (Boolean(this.customerEmail)) {
        params.set('customerEmail', this.customerEmail);
      }

      if (Boolean(this.customerId)) {
        params.set('customerId', this.customerId);
      }

      if (Boolean(this.currency)) {
        params.set('currency', this.currency);
      }

      if (Boolean(this.planConfig)) {
        if (this.planConfig.granteeIds.length > 0)
          params.set('granteeIds', this.planConfig.granteeIds.flat().join(','));
        if (this.planConfig.successUrls.length > 0)
          params.set('successUrls', this.planConfig.successUrls.flat().join(','));
        if (this.planConfig.cancelUrls.length > 0)
          params.set('cancelUrls', this.planConfig.cancelUrls.flat().join(','));
      }

      const pricingTableUrl = this.isCustomPricingTable
        ? `${apiUrl}/pricing-tables/${this.uuid}?${decodeURIComponent(params.toString())}`
        : `${apiUrl}/products/${this.uuid}/pricingtable?${decodeURIComponent(params.toString())}`

      const response = await fetch(pricingTableUrl, {headers: {'x-api-key': `${this.apiKey}`}});

      if (!response.ok) {
        // Todo: add refresh/retry option
        // Todo: 401 Unauthenticated | 403 Unauthorised (when API is fixed)
        if (response.status === 401 || response.status === 403) {
          this.errorMessage = 'Unauthorised';
          return null
        }
        if (response.status === 404) {
          this.errorMessage = 'Not found';
          return null
        }
      }

      return response.json();
    } catch (error) {
      // Todo: add refresh/retry option
      console.error('Fetch error:', error);
      this.errorMessage = 'Error fetching data';
      return null
    }
  }

  private initialiseState(data: PricingTable): PricingTableState {
    const result = {
      monthly: [],
      yearly: [],
      featuredPlanUuid: data.featuredPlanUuid,
      defaultCurrencyShortName: this.getPricingTableDefaultCurrency(data),
    };

    for (let plan of data.plans) {
      switch (plan.plan.interval) {
        case 'year':
          result.yearly.push(plan);
          break;
        case 'month':
          result.monthly.push(plan);
          break;
      }
    }

    if (result.monthly.length === 0 && result.yearly.length > 0) {
      this.selectedBillingPeriodKey = 'yearly'
    }

    return result;
  }

  private getPricingTableDefaultCurrency(data: PricingTable) {
    return this.currency ?? data.product.currencies.find((currency: any) => currency.defaultCurrency)?.currency.shortName ?? null;
  }

  private getCurrency(plan: any) {
    return plan.currencies.find(currenciesOnPlan => currenciesOnPlan.currency.shortName === this.state.defaultCurrencyShortName);
  }

  private planUnitValue(licenseType, interval) {
    switch (licenseType) {
      case 'licensed':
        return interval;
      case 'metered':
        return 'unit';
      case 'perSeat':
        return 'seat';
      default:
        return null;
    }
  }

  private handleToggleBillingPeriod = (event: Event) => {
    this.selectedBillingPeriodKey = (event.target as HTMLInputElement).checked ? 'yearly' : 'monthly';
  };

  private handleToggleBillingPeriodMonthly = (event: Event) => {
    event.preventDefault();
    this.toggleIntervalEl.checked = false;
    this.selectedBillingPeriodKey = 'monthly';
  };

  private handleToggleBillingPeriodYearly = (event: Event) => {
    event.preventDefault();
    this.toggleIntervalEl.checked = true;
    this.selectedBillingPeriodKey = 'yearly';
  };

  private handlePlanSelect = (plan: any) => async (event: Event) => {
    event.preventDefault();
    if (plan.checkoutUrl) {
      window.location = plan.checkoutUrl;
    } else {
      await this.createLicenses(plan)
    }
  };

  private createLicenses = async (plan) => {
    const body = Array.from({length: plan.perSeatAmount}, () => ({
      planUuid: plan.uuid,
      member: this.member,
      granteeId: null,
      ...(this.customerEmail && {email: this.customerEmail}),
    }));

    const granteeId = this.planConfig.granteeIds.find(([planUuid]) => planUuid === plan.uuid)?.[1] ?? this.globalGranteeId;
    const successUrl = this.planConfig.successUrls.find(([planUuid]) => planUuid === plan.uuid)?.[1] ?? this.globalSuccessUrl;
    const cancelUrl = this.planConfig.cancelUrls.find(([planUuid]) => planUuid === plan.uuid)?.[1] ?? this.globalCancelUrl;

    body[0].granteeId = granteeId;

    try {
      const licensesResponse = await fetch(`${apiUrl}/licenses`, {
        method: 'POST',
        headers: {'x-api-key': this.apiKey},
        body: JSON.stringify(body),
      });
      if (licensesResponse.status === 200) {
        location.href = successUrl;
      } else {
        console.error('Salable Pricing Table Error: License create did not return a success response');
        location.href = cancelUrl;
      }
    } catch (e) {
      console.error('Salable Pricing Table Error: Failed to create license/s');
      this.errorMessage = 'Failed to select plan';
      location.href = cancelUrl;
    }
  };

  private initPlanConfig() {
    this.planConfig = {
      granteeIds: this.perPlanGranteeIds?.split(',').map(pair => pair.split('::') as [string, string]) ?? [],
      successUrls: this.perPlanSuccessUrls?.split(',').map(pair => pair.split('::') as [string, string]) ?? [],
      cancelUrls: this.perPlanCancelUrls?.split(',').map(pair => pair.split('::') as [string, string]) ?? [],
    };
  }

  private getCardClass(plan: any) {
    return plan.uuid === this.state.featuredPlanUuid ?
      "h-full flex flex-col p-6 text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white shadow-xl border-2" :
      "h-full flex flex-col p-6 text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white";
  }

  private pricingTableFactory(pricingTable: any) {
    if (!this.isCustomPricingTable) {
      return {
        featuredPlanUuid: '',
        product: {currencies: pricingTable.currencies},
        plans: pricingTable.plans.map((plan: Plan) => ({plan}))
      }
    }
    return pricingTable
  }

  private getColumnCount = () => {
    const columnLookup = {
      1: 'sm:grid-cols-1 lg:grid-cols-1',
      2: 'sm:grid-cols-2 lg:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    };
    switch (this.selectedBillingPeriodKey) {
      case 'monthly':
        return columnLookup[this.calculateColumnCount(this.state.monthly.length)];
      case 'yearly':
        return columnLookup[this.calculateColumnCount(this.state.yearly.length)];
    }
  };

  private calculateColumnCount = (length: number): number => length <= 4 ? length : length % 4 === 0 ? 4 : 3;
}
