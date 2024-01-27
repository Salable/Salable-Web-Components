import {Component, h, Prop, State, Watch} from '@stencil/core';
import {loadStripe, Stripe, StripeElements, StripeElementsOptions, StripePaymentElement} from '@stripe/stripe-js'
import {apiUrl, stripePublicKey} from "../../constants";

type IOrganisationPaymentIntegration = {
  accountId: string;
}

type IProduct = {
  organisationPaymentIntegration: IOrganisationPaymentIntegration;
}

type IPlan = {
  name: string;
  interval: string;
  pricingType: string;
  product: IProduct;
  currencies: IPlanCurrency[];
}

type IPlanCurrency = {
  planUuid: string;
  currencyUuid: string;
  price: number;
  paymentIntegrationPlanId: string;
  currency: ICurrency;
}

type ICurrency = {
  shortName: string;
  longName: string;
  symbol: string;
}


type IState = {
  componentError: string | null;
  plan: IPlan | null
}

type IFormState = {
  userEmail: string;
  userEmailError: string | null;
  formError: string | null;
  isSubmitting: boolean
}

@Component({
  tag: 'salable-checkout',
  styleUrl: 'salable-checkout.css',
  scoped: true,
  shadow: false,
})
export class SalableCheckout {

  @State() clientSecret: string | null = null;

  @State() state: IState = {
    componentError: '',
    plan: null,
  };

  @State() formState: IFormState = {
    userEmail: '',
    formError: null,
    userEmailError: null,
    isSubmitting: false,
  };

  /**
   * A unique identifier to authenticate HTTP calls to Salable API
   */
  @Prop() apiKey!: string;

  /**
   * A unique identifier for a specific plan
   */
  @Prop() planUuid!: string;

  /**
   * A unique identifier used in licensing that represents the entity to which a license is granted
   */
  @Prop() granteeId!: string;

  /**
   * A unique identifier for a member or user
   */
  @Prop() member!: string;

  /**
   * The URL the user is sent to if they successfully completed a payment
   */
  @Prop() successUrl!: string;

  /**
   * A user's email address to be used for the checkout.
   *
   * Providing the user's email skips the provide email step during checkout
   */
  @Prop() email: string;

  private stripe: Stripe;
  private elements: StripeElements;
  private paymentElement: StripePaymentElement;

  async componentWillLoad() {
    this.validateProps();
    await this.fetchPlan();
    await this.handleEmailPrefill();
  }

  /**
   * Only initialize the stripe element when the client secret
   * is available. Mounting the element in the DOM will be done
   * by the `ComponentDidUpdate` lifecycle
   */
  @Watch('clientSecret')
  async watchClientSecret() {
    if (!Boolean(this.clientSecret)) return;

    const paymentIntegration = this.state.plan?.product.organisationPaymentIntegration;
    this.stripe = await loadStripe(stripePublicKey, {
      stripeAccount: paymentIntegration.accountId,
    });

    const options: StripeElementsOptions = {
      clientSecret: this.clientSecret,
      appearance: {
        variables: {
          borderRadius: '4px',
          colorPrimary: 'rgb(37, 99, 235)',
        },
      },
    };
    this.elements = this.stripe.elements(options);

    this.paymentElement = this.elements.create('payment', {
      layout: 'tabs',
    });
  }

  /**
   * Once component is updated and client secrete is available,
   * mount the stripe payment element
   * This approach was taken and not done in the watch decorate
   * to allow the element with the id to be mounted in the DOM
   */
  componentDidUpdate() {
    if (!Boolean(this.clientSecret)) return;
    this.paymentElement.mount('#slb_payment_element')
  }

  render() {
    if (Boolean(this.state.componentError)) {
      return (
        <div class="font-sans bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700 p-4">
          <ErrorMessage message={this.state.componentError}/>
        </div>
      )
    }

    if (Boolean(this.clientSecret)) {
      return (
        <div class="font-sans bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700 p-4">
          <PriceTag plan={this.state.plan}/>
          <form onSubmit={this.handlePayment}>
            <div id="slb_payment_element" class="mb-6 p-20"/>
            <button type="submit"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              Pay
            </button>
          </form>
          <ErrorMessage message={this.formState.formError}/>
        </div>
      )
    }

    return (
      <div class="font-sans bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700 p-4">
        <PriceTag plan={this.state.plan}/>
        <form onSubmit={this.handleCreateSubscription}>
          <div class="mb-6">
            <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              id="email"
              class="bg-gray-50 dark:bg-gray-700 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 dark:text-white focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:focus:border-primary-500 dark:border-gray-600"
              value={this.formState.userEmail}
              onInput={this.handleEmailChange}
            />
            <p class="text-sm text-red-600 mt-2">{this.formState.userEmailError}</p>
          </div>
          <button type="submit"
                  class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            Continue
          </button>
        </form>
        <ErrorMessage message={this.formState.formError}/>
      </div>
    );
  }

  @Watch('apiKey')
  @Watch('planUuid')
  @Watch('successUrl')
  @Watch('granteeId')
  @Watch('member')
  validateProp(newValue: string, propName: string) {
    if (typeof newValue !== 'string' || newValue.trim() === '') {
      throw new Error(`${propName} is a required property and cannot be empty`);
    }
  }

  private async handleEmailPrefill() {
    if (!Boolean(this.email)) return;

    const validEmail = this.validateEmail(this.email)

    this.formState = {
      ...this.formState,
      userEmail: this.email,
      userEmailError: !validEmail ? 'A valid email is required' : null,
    };

    if (!validEmail) return;

    await this.createSubscription()
  }

  private validateProps() {
    this.validateProp(this.apiKey, 'apiKey');
    this.validateProp(this.planUuid, 'planUuid');
    this.validateProp(this.successUrl, 'successUrl');
    this.validateProp(this.granteeId, 'granteeId');
    this.validateProp(this.member, 'member');
  }

  private validateEmail = (email: string) => {
    if (!Boolean(email)) return false;
    const validateEmailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return validateEmailRegex.test(email);
  };

  private handleEmailChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const email = input.value;
    this.formState = {
      ...this.formState,
      userEmail: email,
      userEmailError: !this.validateEmail(email) ? 'A valid email is required' : null,
    }
  };

  private handleCreateSubscription = async (event: Event) => {
    event.preventDefault();
    await this.createSubscription()
  };

  private createSubscription = async () => {
    if (Boolean(this.formState.userEmailError)) return;

    this.formState = {
      ...this.formState,
      isSubmitting: true,
    };

    try {
      const response = await fetch(
        `${apiUrl}/checkout/create-subscription`,
        {
          method: 'POST',
          headers: {
            'x-api-key': `${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            planUuid: this.planUuid,
            email: this.formState.userEmail,
            member: this.member,
            granteeId: this.granteeId
          })
        },
      );
      if (!response.ok) {
        // Todo: handle errors, display failure message, refresh options
        this.state = {
          ...this.state,
          componentError: 'Failed to create subscription intent'
        };
        console.error('Failed to fetch data:', response.statusText);
        return;
      }

      const data = await response.json();

      this.clientSecret = data.clientSecret;
      this.formState = {
        ...this.formState,
        isSubmitting: false,
      }
    } catch (error) {
      this.clientSecret = null;
      this.formState = {
        ...this.formState,
        formError: "Error creating subscription",
        isSubmitting: false,
      }
    }
  };

  private handlePayment = async (event: Event) => {
    event.preventDefault();
    if (!Boolean(this.stripe) || !Boolean(this.elements)) {
      // Then Stripe.js has not yet loaded.
      // Todo: Make sure to disable form submission until Stripe.js has loaded.
      this.formState = {
        ...this.formState,
        formError: "Payment element unavailable. Please try again"
      };
      return;
    }

    this.formState = {
      ...this.formState,
      isSubmitting: true,
    };

    const {error} = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email: this.formState.userEmail
          }
        },
        return_url: this.successUrl,
        receipt_email: this.formState.userEmail,
      },
    });

    /**
     * This point will only be reached if there is an immediate error when
     * confirming the payment. Otherwise, your customer will be redirected to
     * your `return_url`. For some payment methods like iDEAL, your customer will
     * be redirected to an intermediate site first to authorize the payment, then
     * redirected to the `return_url`.
     */
    if (Boolean(error)) {
      let formError: string;
      if (error.type === 'card_error' || error.type === 'validation_error') {
        formError = error.message ?? 'A card or validation error has occurred. Please try again or with a different card';
      } else {
        formError = 'An unexpected error occurred. Please try again';
      }

      this.formState = {
        ...this.formState,
        formError,
        isSubmitting: false,
      }
    }
  };

  private async fetchPlan() {
    try {
      const response = await fetch(
        `${apiUrl}/plans/${this.planUuid}?expand=product.organisationPaymentIntegration,currencies.currency`,
        {method: 'GET', headers: {'x-api-key': `${this.apiKey}`}},
      );
      if (!response.ok) {
        // Todo: handle errors, display failure message, refresh options
        this.state = {
          ...this.state,
          componentError: 'Failed to fetch plan'
        };
        console.error('Failed to fetch data:', response.statusText);
        return;
      }
      const data = await response.json() as IPlan;
      this.state = {
        ...this.state,
        plan: data
      }
    } catch (error) {
      this.state = {
        ...this.state,
        componentError: 'Failed to initialise plan data'
      };
      console.error('Error fetching data:', error);
    }
  }
}

const PriceTag = ({plan}: { plan: IPlan }) => {
  const planCurrency = plan.currencies[0];
  return (
    <div class="flex justify-between mb-6">
      <p class="text-2xl">Price</p>
      <p class="text-base">{
        plan.pricingType === 'paid' && Boolean(planCurrency)
          ? `${new Intl.NumberFormat(planCurrency.currency.shortName, {
            style: 'currency',
            currency: planCurrency.currency.shortName,
          }).format(planCurrency.price / 100)} / ${plan?.interval}`
          : 'Free'
      }</p>
    </div>
  )
};

const ErrorMessage = ({message}: { message?: string | null }) => {
  if (!Boolean(message)) return null;
  return (
    <div id="alert-additional-content-2"
         class="p-4 my-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
         role="alert">
      <div class="flex items-center">
        <span class="sr-only">Info</span>
        <h3 class="text-base font-medium"> {message}</h3>
      </div>
    </div>
  )
};
