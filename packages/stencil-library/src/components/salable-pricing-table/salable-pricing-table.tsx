import {Component, h, Host, Prop, State, Watch} from '@stencil/core';
import {apiUrl} from "../../constants";

// TODO: featured plan style
// TODO: show intervals/units for pricing
// TODO: currency handling
// TODO: add per plan query params
// TODO: per plan config

@Component({
  tag: 'salable-pricing-table',
  styleUrl: 'salable-pricing-table.css',
  shadow: true,
})
export class SalablePricingTable {
  @State() planConfig:  {
    successUrls: [string, string][];
    granteeIds: [string, string][];
    cancelUrls: [string, string][]
  } = null;
  @State() state: any = null; // Todo: define type
  @State() errorMessage: string = null;
  @State() selectedBillingPeriodKey: 'monthly' | 'yearly' = 'monthly';

  /**
   * The publishable api key, this can be generated in the Salable dashboard
   **/
  @Prop() apiKey!: string;

  /**
   * The uuid of the pricing table that you want to display.
   **/
  @Prop() pricingTableUuid!: string;

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

  @Watch('apiKey')
  @Watch('pricingTableUuid')
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
    this.initPlanConfig()
    const data = await this.fetchPricingTable();
    this.state = this.initialiseState(data);
  }

  render() {
    return (
      <Host>
        {this.errorMessage}
        <div class="font-sans max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          {
            this.state.monthly.length > 0 && this.state.yearly.length > 0 ? (
              <div class="flex justify-center items-center">
                <label class="min-w-[3.5rem] text-sm text-gray-500 me-3 dark:text-gray-400">Monthly</label>

                <input
                  type="checkbox"
                  id="hs-basic-with-description"
                  class="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-white before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-white"
                  onInput={this.handleToggleBillingPeriod}
                />

                <label class="relative min-w-[3.5rem] text-sm text-gray-500 ms-3 dark:text-gray-400">
                  Annual {Boolean(this.selectedBillingPeriodKey) ? 'y' : 'n'}
                </label>
              </div>
            ) : null
          }

          <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:items-center">

            {this.state[this.selectedBillingPeriodKey].map(({plan}) => (
              <div class="flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-gray-700">
                <h4 class="font-medium text-lg text-gray-800 dark:text-gray-200">{plan.name}</h4>

                {plan.currencies.length > 0 ? (
                  <span class="mt-5 font-bold text-5xl text-gray-800 dark:text-gray-200">
                      <span class="font-bold text-2xl">{plan.currencies[0]?.currency.symbol}</span>
                    {plan.currencies[0]?.price}
                      </span>
                ) : (
                  <span class="mt-5 font-bold text-5xl text-gray-800 dark:text-gray-200">
                      Free
                  </span>
                )}
                <p class="mt-2 text-sm text-gray-500">{plan.description}</p>

                <ul class="mt-7 space-y-2.5 text-sm mx-auto">
                  {plan.features?.map(feature => (
                    <li class="flex space-x-2">
                      <svg class="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-500"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span class="text-gray-800 dark:text-gray-400 text-left">
                        {feature.feature.displayName}<br/>
                        {feature.feature.description}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  onClick={this.handlePlanSelect(plan)}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </Host>
    );
  }

  private validateProps() {
    this.validateProp(this.apiKey, 'apiKey');
    this.validateProp(this.pricingTableUuid, 'pricingTableUuid');
    this.validateProp(this.globalSuccessUrl, 'globalSuccessUrl');
    this.validateProp(this.globalCancelUrl, 'globalCancelUrl');
    this.validateProp(this.globalGranteeId, 'globalGranteeId');
    this.validateProp(this.member, 'member');
  }

  private async fetchPricingTable() {
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
      console.log('pc1', this.planConfig);

      if (Boolean(this.planConfig)) {
        if(this.planConfig.granteeIds.length > 0)
          params.set('granteeIds', this.planConfig.granteeIds.flat().join(','));
        if(this.planConfig.successUrls.length > 0)
          params.set('successUrls', this.planConfig.successUrls.flat().join(','));
        if(this.planConfig.cancelUrls.length > 0)
          params.set('cancelUrls', this.planConfig.cancelUrls.flat().join(','));
      }

      const response = await fetch(
        `${apiUrl}/pricing-tables/${this.pricingTableUuid}?${decodeURIComponent(params.toString())}`,
        {headers: {'x-api-key': `${this.apiKey}`}},
      );

      if (!response.ok) {
        // Todo: add refresh/retry option
        // Todo: 401 Unauthenticated | 403 Unauthorised (when API is fixed)
        if (response.status === 401 || response.status === 403) {
          this.errorMessage = 'Unauthorised';
          return
        }
        if (response.status === 404) {
          this.errorMessage = 'Not found';
          return
        }
      }

      return response.json();
    } catch (error) {
      // Todo: add refresh/retry option
      console.error('Fetch error:', error);
      this.errorMessage = 'Error fetching data';
    }
  }

  private initialiseState(data: any) {
    const result = {
      monthly: [],
      yearly: [],
      defaultCurrency: data?.currencies?.find((currencyOnPricingTable: any) => currencyOnPricingTable.defaultCurrency),
    };

    console.log('d', data);
    console.log('dcs', data?.currencies);
    console.log('dc', result.defaultCurrency);

    for (let plan of data.plans) {
      switch (plan.plan.interval) {
        case 'year':
          result.yearly.unshift(plan);
          break;
        case 'month':
          result.monthly.unshift(plan);
          break;
      }
    }

    if (result.monthly.length === 0 && result.yearly.length > 0) {
      this.selectedBillingPeriodKey = 'yearly'
    }

    return result;
  }

  // private getCurrency(plan: any) {
  //   return
  // }

  private handleToggleBillingPeriod = (event: Event) => {
    this.selectedBillingPeriodKey = (event.target as HTMLInputElement).checked ? 'yearly' : 'monthly';
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
}
