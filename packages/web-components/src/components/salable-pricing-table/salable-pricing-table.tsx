import {Component, h, Host, Prop, State, Watch} from '@stencil/core';
import {apiUrl} from "../../constants";
import {
  Plan,
  PricingTable,
  PricingTablePlan,
  ProductCurrency,
  ProductPricingTable
} from "../../../../utilities/types/pricing-table";

type PricingTableState = {
  monthly: PricingTablePlan[]
  yearly: PricingTablePlan[]
  featuredPlanUuid: string | null
  defaultCurrencyShortName: string | null
}

type PlanConfig = {
  successUrls: [string, string][]
  granteeIds: [string, string][]
  cancelUrls: [string, string][]
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
  @State() isLoadingPlanUuid: string | null = null;
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
   * The URL to send users for coming soon plans.
   **/
  @Prop() globalContactUrl?: string;
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
   * Configure granteeIds per plan, string format `{'plan-uuid-one': 'granteeIdOne', 'plan-uuid-two': 'granteeIdTwo'}`
   **/
  @Prop() perPlanGranteeIds: Record<string, string> | string;
  /**
   * Configure successUrls per plan, string format `{'plan-uuid-one': 'https://example.com/success-one' , 'plan-uuid-two': 'https://example.com/success-two'}`
   **/
  @Prop() perPlanSuccessUrls: Record<string, string> | string;
  /**
   * Configure cancelUrls per plan, string format `{'plan-uuid-one':'https://example.com/cancel-one','plan-uuid-two':'https://example.com/cancel-two'}`
   **/
  @Prop() perPlanCancelUrls: Record<string, string> | string;

  private _perPlanGranteeIds?: Record<string, string> | string;
  private _perPlanSuccessUrls?: Record<string, string> | string;
  private _perPlanCancelUrls?: Record<string, string> | string;
  private toggleIntervalEl: HTMLInputElement;

  @Watch('apiKey')
  @Watch('uuid')
  @Watch('globalSuccessUrl')
  @Watch('globalCancelUrl')
  @Watch('globalGranteeId')
  @Watch('globalContactUrl')
  @Watch('member')
  validateProp(newValue: string, propName: string) {
    if (typeof newValue !== 'string' || newValue.trim() === '') {
      console.error(`${propName} is a required property and cannot be empty`)
      this.errorMessage = 'Failed to load Pricing Table'
    }
  }

  @Watch('perPlanGranteeIds')
  perPlanGranteeIdsWatcher(newValue?: Record<string, string> | string) {
    if (!Boolean(newValue)) {
      this._perPlanGranteeIds = undefined;
      return;
    }

    if (typeof newValue === 'string') {
      this._perPlanGranteeIds = JSON.parse(newValue);
      return;
    }

    for (const value of Object.values(newValue)) {
      if (typeof value !== 'string') {
        throw new Error('All perPlanGranteeIds values must be strings')
      }
    }
    this._perPlanGranteeIds = newValue;
  }

  @Watch('perPlanSuccessUrls')
  perPlanSuccessUrlsWatcher(newValue?: Record<string, string> | string) {
    if (!Boolean(newValue)) {
      this._perPlanSuccessUrls = undefined;
      return;
    }

    if (typeof newValue === 'string') {
      this._perPlanSuccessUrls = JSON.parse(newValue);
      return;
    }

    for (const value of Object.values(newValue)) {
      if (typeof value !== 'string') {
        throw new Error('All perPlanSuccessUrls values must be strings')
      }
    }
    this._perPlanSuccessUrls = newValue;
  }

  @Watch('perPlanCancelUrls')
  perPlanCancelUrlsWatcher(newValue?: Record<string, string> | string) {
    if (!Boolean(newValue)) {
      this._perPlanCancelUrls = undefined;
      return;
    }

    if (typeof newValue === 'string') {
      this._perPlanCancelUrls = JSON.parse(newValue);
      return;
    }

    for (const value of Object.values(newValue)) {
      if (typeof value !== 'string') {
        throw new Error('All perPlanCancelUrls values must be strings')
      }
    }
    this._perPlanCancelUrls = newValue;
  }

  async componentWillLoad() {
    this.validateProps();
    if (Boolean(this.errorMessage)) return
    this.perPlanGranteeIdsWatcher(this.perPlanGranteeIds);
    this.perPlanSuccessUrlsWatcher(this.perPlanSuccessUrls);
    this.perPlanCancelUrlsWatcher(this.perPlanCancelUrls);
    this.initPlanConfig();
    try {
      const data = await this.fetchPricingTable();
      if (Boolean(data)) {
        const normalisedData: PricingTable = !this.isCustomPricingTable ? this.productPricingTableFactory(data as ProductPricingTable) : data as PricingTable;
        this.validateConditionalProps(normalisedData)
        if (Boolean(this.currency) && !Boolean(normalisedData.product.currencies.find((c) => c.currency.shortName.toLowerCase() === this.currency))) {
          this.errorMessage = 'Failed to load Pricing Table'
          console.error(`Requested Currency "${this.currency}" was not found on the pricing table's product`)
        }
        if (!Boolean(this.currency)) this.currency = normalisedData.product.currencies.find((c) => c.defaultCurrency)?.currency.shortName.toLowerCase()
        this.state = this.initialiseState(normalisedData)
      }
    } catch (e) {
      console.error(e)
      this.errorMessage = 'Failed to load Pricing Table'
    }
  }

  render() {
    const isTestMode = this.apiKey.startsWith('test_');
    return (
      <Host>
        <div class="font-sans relative">
          {isTestMode ? (
            <div class="mb-4 border-solid border-t-4 border-orange-500 w-full flex justify-center">
              <p class="px-1 bg-orange-500 rounded-b font-bold text-white uppercase text-xs">test mode</p>
            </div>
          ): null}
          {Boolean(this.errorMessage) ? (
            <div class='bg-red-500 text-white p-3 rounded-md leading-none' data-testid={`salable-pricing-table-error`}>
              {this.errorMessage}
            </div>
          ) : null}
          {!Boolean(this.errorMessage) && this.state.monthly.length > 0 && this.state.yearly.length > 0 ? (
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

          {!Boolean(this.errorMessage) ? (
            <div class={`grid ${this.getColumnCount()} gap-6 lg:items-center`}>
              {this.state[this.selectedBillingPeriodKey].map(({plan}, planIndex) => {
                return (
                  <section class={this.getCardClass(plan)} data-testid={`pricing-table-card-${planIndex}`}>
                    {this.state.featuredPlanUuid === plan.uuid ? (
                      <span class='absolute text-xs bg-primary-600 p-1 text-white leading-none uppercase rounded-sm right-0 left-0 w-fit m-auto top-[-10px]'>Featured</span>
                    ) : null}
                    <h3 class="font-medium text-lg text-gray-800 dark:text-gray-200"
                        id="pricing-table-card-heading">{plan.displayName}</h3>
                    {plan.currencies.length > 0 && plan.pricingType === 'paid' ? (
                      <div class='mt-4'>
                        <span class="font-bold text-2xl">{this.getCurrency(plan)?.currency.symbol}</span>
                        <span class="font-bold text-5xl text-gray-800 dark:text-gray-200">{this.calcPrice(this.getCurrency(plan)?.price)}</span>
                        <span class="text-xl text-grey-500"> / {plan.interval}
                          {plan.licenseType !== 'licensed' ? (
                            <span class="text-gray-500"> per {this.planUnitValue(plan.licenseType)}</span>
                          ) : null}
                        </span>
                        <span class="text-xl text-grey-500">
                        {plan.licenseType !== 'licensed' ? (
                          <span>
                            {plan.perSeatAmount > 1 && plan.maxSeatAmount === -1 ? (
                              <div class="text-gray-500 text-sm"> (min. {plan.perSeatAmount} seats)</div>
                            ) : null}
                            {plan.perSeatAmount === 1 && plan.maxSeatAmount > 0 ? (
                              <div class="text-gray-500 text-sm"> (max. {plan.maxSeatAmount} seats)</div>
                            ) : null}
                            {plan.perSeatAmount > 1 && plan.maxSeatAmount > 1 ? (
                              <div
                                class="text-gray-500 text-sm"> ({plan.perSeatAmount} - {plan.maxSeatAmount} seats)</div>
                            ) : null}
                          </span>
                        ) : null}
                      </span>
                      </div>
                    ) : null}
                    {plan.pricingType === 'free' && plan.planType === 'Standard' ? (
                      <div class='mt-4'>
                        <span class="font-bold text-5xl text-gray-800 dark:text-gray-200">Free</span>
                      </div>
                    ) : null}
                    {plan.planType === 'Coming soon' ? (
                      <div class='mt-4'>
                        <span class="font-bold text-5xl text-gray-800 dark:text-gray-200">Coming soon</span>
                      </div>
                    ) : null}
                    <p class="mt-2 text-sm text-gray-500">{plan.description}</p>

                    <ul class="mt-7 mb-5 space-y-2.5 text-sm mx-auto">
                      {plan.features?.map((feature, featureIndex) => (
                        <li class="flex space-x-2 flex-col items-center">
                          <h4 class="text-gray-800 dark:text-gray-400 text-left flex gap-2 items-center font-semibold">
                            {feature.feature.displayName}
                          </h4>
                          {Boolean(feature.feature.description) ? (
                            <span data-testid={`info_${planIndex}_${featureIndex}`}
                                  class="grow-0 flex items-center group relative" tabindex="0">
                              <div
                                class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-[9px] px-2 py-0 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                              >?</div>
                                <div
                                  data-testid={`tooltip_${planIndex}_${featureIndex}`}
                                  role="tooltip"
                                  class="absolute w-max max-w-[200px] bottom-6 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 inline-block px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
                                >
                                  {feature.feature.description}
                                </div>
                              </span>
                          ) : null}
                          {this.getFeatureValue(feature.feature.valueType, feature.value, feature.isUnlimited, feature.feature.showUnlimited, feature.enumValue?.name)}
                        </li>
                      ))}
                    </ul>

                    {plan.planType === 'Coming soon' ? (
                      <a
                        data-testid={`salable-plan-${planIndex}-button`}
                        class={`mt-auto inline-flex justify-center items-center text-white focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:text-white dark:focus:ring-primary-900 ${plan.licenseType === 'metered' && plan.grantee.isSubscribed ? 'bg-gray-500' : 'bg-primary-600 hover:bg-primary-700'}`}
                        href={this.globalContactUrl}
                      >
                        {this.planCtaLabelValue(plan)}
                      </a>
                    ) : (
                      <button
                        data-testid={`salable-plan-${planIndex}-button`}
                        class={`mt-auto inline-flex justify-center items-center text-white focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:text-white dark:focus:ring-primary-900 ${plan.licenseType === 'metered' && plan.grantee.isSubscribed ? 'bg-gray-500' : 'bg-primary-600 hover:bg-primary-700'}`}
                        onClick={this.handlePlanSelect(plan)}
                        disabled={Boolean((plan.licenseType === 'metered' && plan.grantee.isSubscribed) || this.isLoadingPlanUuid)}
                      >
                        {this.isLoadingPlanUuid === plan.uuid ? <span
                          class='h-[15px] w-[15px] mr-2 animate-spin border-2 border-s-white rounded-full border-white/[.5]' data-testid={`plan-${planIndex}-spinner`}></span> : null}
                        {this.planCtaLabelValue(plan)}
                      </button>
                    )}
                  </section>
                );
              })}
            </div>
          ) : null}
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
  private validateConditionalProps(data: PricingTable) {
    if (Boolean(data?.plans?.find(({plan}) => plan.planType === 'Coming soon'))) {
      this.validateProp(this.globalContactUrl, 'globalContactUrl');
    }
  }

  private async fetchCheckoutUrl(plan: Plan): Promise<string> {
    try {
      const params = new URLSearchParams({
        member: this.member,
      });

      let granteeId = this.globalGranteeId
      if (Boolean(this.perPlanGranteeIds)) {
        const granteeIdsPerPlan = JSON.parse(this.perPlanGranteeIds as string)
        if (granteeIdsPerPlan[plan.uuid]) granteeId = granteeIdsPerPlan[plan.uuid]
      }
      params.set('granteeId', granteeId)

      let successUrl = this.globalSuccessUrl ?? document.URL
      if (Boolean(this.perPlanSuccessUrls)) {
        const successUrlsPerPlan = JSON.parse(this.perPlanSuccessUrls as string)
        if (successUrlsPerPlan[plan.uuid]) successUrl = successUrlsPerPlan[plan.uuid]
      }
      params.set('successUrl', successUrl)

      let cancelUrl = this.globalCancelUrl
      if (Boolean(this.perPlanCancelUrls)) {
        const cancelUrlsPerPlan = JSON.parse(this.perPlanCancelUrls as string)
        if (cancelUrlsPerPlan[plan.uuid]) cancelUrl = cancelUrlsPerPlan[plan.uuid]
      }
      params.set('cancelUrl', cancelUrl)

      if (Boolean(this.promoCode)) params.set('promoCode', this.promoCode);
      if (Boolean(this.allowPromoCode)) params.set('allowPromoCode', this.allowPromoCode);
      if (Boolean(this.automaticTax)) params.set('automaticTax', this.automaticTax);
      if (Boolean(this.customerEmail)) params.set('customerEmail', this.customerEmail);
      if (Boolean(this.customerId)) params.set('customerId', this.customerId);
      if (Boolean(this.currency)) params.set('currency', this.currency);

      const checkoutUrlFetch = await fetch(`${apiUrl}/plans/${plan.uuid}/checkoutlink?${decodeURIComponent(params.toString())}`, {
        headers: {
          version: 'v2',
          'x-api-key': this.apiKey
        }
      })
      const data = await checkoutUrlFetch.json()
      if (checkoutUrlFetch.ok) {
        return data.checkoutUrl
      } else {
        if (checkoutUrlFetch.status === 401 || checkoutUrlFetch.status === 403) {
          this.errorMessage = 'Unauthorised';
          return null
        }
        this.errorMessage = 'Failed to load checkout'
        console.error(data.error ?? data)
        return null
      }
    } catch (error) {
      // Todo: add refresh/retry option
      console.error('Fetch error:', error);
      this.errorMessage = 'Error fetching data';
      return null
    }
  }

  private async fetchPricingTable(): Promise<PricingTable | ProductPricingTable |null> {
    try {
      const params = new URLSearchParams({
        granteeId: this.globalGranteeId,
      });

      const pricingTableUrl = this.isCustomPricingTable
        ? `${apiUrl}/pricing-tables/${this.uuid}?${decodeURIComponent(params.toString())}`
        : `${apiUrl}/products/${this.uuid}/pricingtable?${decodeURIComponent(params.toString())}`;

      const response = await fetch(pricingTableUrl, {headers: {version: 'v2', 'x-api-key': `${this.apiKey}`}});
      const data = await response.json()

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
        if (response.status === 400) {
          console.error(`${data.error}`);
        }
        this.errorMessage = 'Failed to load Pricing Table'
        return null
      }

      return data;
    } catch (error) {
      // Todo: add refresh/retry option
      console.error('Fetch error HERE:', error);
      this.errorMessage = 'Error fetching data';
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
    return this.currency ?? data.product.currencies.find((currency: ProductCurrency) => currency.defaultCurrency)?.currency.shortName ?? null;
  }

  private getCurrency(plan: Plan) {
    return plan.currencies.find(currenciesOnPlan => currenciesOnPlan.currency.shortName.toLowerCase() === this.currency);
  }

  private planUnitValue(licenseType: string) {
    switch (licenseType) {
      case 'licensed':
        return '';
      case 'metered':
        return 'unit';
      case 'perSeat':
        return 'seat';
      default:
        return null;
    }
  }

  private planCtaLabelValue(plan: Plan) {
    switch (plan.planType) {
      case 'Standard' :
        if (plan.licenseType === 'metered' && plan.grantee.isSubscribed) return 'Subscribed'
        if (plan.evalDays) return `Start ${plan.evalDays} day trial`
        return 'Select Plan'
      case 'Coming soon' :
        return 'Contact us'
      default :
        return ''
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

  private handlePlanSelect = (plan: Plan) => async (event: Event) => {
    if (plan.planType !== 'Coming soon') {
      event.preventDefault();
      this.isLoadingPlanUuid = plan.uuid
      try {
        if (plan.pricingType === 'paid') {
          const url = await this.fetchCheckoutUrl(plan)
          if (Boolean(url)) window.location.href = url
          return
        } else {
          await this.createLicenses(plan)
        }
      } catch (e) {
        console.error(e)
        this.errorMessage = 'Failed to load checkout'
      }
    }
  };

  private createLicenses = async (plan: Plan) => {
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
      granteeIds: [],
      successUrls: [],
      cancelUrls: [],
    };
    if (Boolean(this._perPlanGranteeIds)) {
      this.planConfig.granteeIds = Object.entries(this._perPlanGranteeIds);
    }
    if (Boolean(this._perPlanSuccessUrls)) {
      this.planConfig.successUrls = Object.entries(this._perPlanSuccessUrls);
    }
    if (Boolean(this._perPlanCancelUrls)) {
      this.planConfig.cancelUrls = Object.entries(this._perPlanCancelUrls);
    }
  }

  private getCardClass(plan: Plan) {
    return plan.uuid === this.state.featuredPlanUuid ?
      "h-full flex flex-col p-6 text-center text-gray-900 bg-white rounded-lg border shadow xl:p-8 dark:bg-gray-800 dark:text-white shadow-xl border-2 border-primary-600 relative" :
      "h-full flex flex-col p-6 text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white";
  }

  private productPricingTableFactory(pricingTable: ProductPricingTable): PricingTable {
    return {
      featuredPlanUuid: '',
      product: {currencies: pricingTable.currencies},
      plans: pricingTable.plans?.map((plan: Plan) => ({plan, currencies: plan.currencies}))
    }
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

  private calcPrice(price: number) {
    const decimal = price / 100;
    return decimal % 1 === 0 ? decimal.toString() : decimal.toFixed(2);
  }

  private getFeatureValue(valueType: string, value: string, isUnlimited: boolean, showUnlimited: boolean, enumValue?: string) {
    switch (valueType) {
      case "numerical":
        return showUnlimited && isUnlimited ? 'Unlimited' : value;
      case "enum":
        return enumValue ?? 'n/a';
      case "boolean":
        return value === 'true' ? (
          <svg class="w-6 h-6 text-primary-600 dark:stroke-white stroke-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m5 12 4.7 4.5 9.3-9"/>
          </svg>
        ) : (
          <svg class="w-6 h-6 text-primary-600 dark:stroke-white stroke-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18 18 6m0 12L6 6"/>
          </svg>
        );
    }
  }
}
