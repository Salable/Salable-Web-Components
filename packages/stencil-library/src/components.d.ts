/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { StatusType } from "./enums/status-type";
export { StatusType } from "./enums/status-type";
export namespace Components {
    /**
     * button component
     */
    interface SalableButton {
    }
    interface SalableCheckout {
        /**
          * A unique identifier to authenticate HTTP calls to Salable API
         */
        "apiKey": string;
        /**
          * A user's email address to be used for the checkout.  Providing the user's email skips the provide email step during checkout
         */
        "email": string;
        /**
          * A unique identifier used in licensing that represents the entity to which a license is granted
         */
        "granteeId": string;
        /**
          * A unique identifier for a member or user
         */
        "member": string;
        /**
          * A unique identifier for a specific plan
         */
        "planUuid": string;
        /**
          * The URL the user is sent to if they successfully completed a payment
         */
        "successUrl": string;
    }
    interface SalableDate {
        /**
          * The date to display
         */
        "date": string | number;
    }
    interface SalableInvoices {
        /**
          * The publishable api key, this can be generated in the Salable dashboard
         */
        "apiKey": string;
        /**
          * The number of rows to display per page
         */
        "limit": number;
        /**
          * The uuid of the subscription that you want to display invoices for.
         */
        "subscriptionUuid": string;
    }
    interface SalablePricingTable {
        /**
          * Enables the promo code field in Stripe checkout. Accepts 'true' or 'false'. Cannot be used with promoCode.
         */
        "allowPromoCode": string;
        /**
          * The publishable api key, this can be generated in the Salable dashboard
         */
        "apiKey": string;
        /**
          * Automatically calculate tax on checkout based on the customer's location and your Stripe settings.
         */
        "automaticTax": string;
        /**
          * Uses the currency short name (e.g., USD). Defaults to the default currency on the Product which the Plan is linked to. Currently only supported on payment integration type 'stripe_existing'.
         */
        "currency": string;
        /**
          * Pre-fills the customer email in Stripe checkout.
         */
        "customerEmail": string;
        /**
          * The ID of an existing customer in your payment integration. This pre-fills the email, card details, and postcode at checkout.
         */
        "customerId": string;
        /**
          * The URL to send users to if the transaction fails. Must be an absolute URL.
         */
        "globalCancelUrl": string;
        /**
          * The unique identifier for the grantee for all plan checkouts links.
         */
        "globalGranteeId": string;
        /**
          * The URL to send users to after a successful purchase. Must be an absolute URL.
         */
        "globalSuccessUrl": string;
        /**
          * If you provided the uuid of a custom pricing table set this to true
         */
        "isCustomPricingTable": boolean;
        /**
          * The ID of the member who will manage the license.
         */
        "member": string;
        /**
          * Configure cancelUrls per plan, string format `{'plan-uuid-one':'https://example.com/cancel-one','plan-uuid-two':'https://example.com/cancel-two'}`
         */
        "perPlanCancelUrls": Record<string, string> | string;
        /**
          * Configure granteeIds per plan, string format `{'plan-uuid-one': 'granteeIdOne', 'plan-uuid-two': 'granteeIdTwo'}`
         */
        "perPlanGranteeIds": Record<string, string> | string;
        /**
          * Configure successUrls per plan, string format `{'plan-uuid-one': 'https://example.com/success-one' , 'plan-uuid-two': 'https://example.com/success-two'}`
         */
        "perPlanSuccessUrls": Record<string, string> | string;
        /**
          * Used to pre-fill the promo code in Stripe checkout. Use the promo code ID from Stripe dashboard. Customers cannot edit this field during checkout.
         */
        "promoCode": string;
        /**
          * The uuid of the pricing table that you want to display.
         */
        "uuid": string;
    }
    interface SalableStatus {
        /**
          * The status type
         */
        "statusType": StatusType;
    }
}
declare global {
    /**
     * button component
     */
    interface HTMLSalableButtonElement extends Components.SalableButton, HTMLStencilElement {
    }
    var HTMLSalableButtonElement: {
        prototype: HTMLSalableButtonElement;
        new (): HTMLSalableButtonElement;
    };
    interface HTMLSalableCheckoutElement extends Components.SalableCheckout, HTMLStencilElement {
    }
    var HTMLSalableCheckoutElement: {
        prototype: HTMLSalableCheckoutElement;
        new (): HTMLSalableCheckoutElement;
    };
    interface HTMLSalableDateElement extends Components.SalableDate, HTMLStencilElement {
    }
    var HTMLSalableDateElement: {
        prototype: HTMLSalableDateElement;
        new (): HTMLSalableDateElement;
    };
    interface HTMLSalableInvoicesElement extends Components.SalableInvoices, HTMLStencilElement {
    }
    var HTMLSalableInvoicesElement: {
        prototype: HTMLSalableInvoicesElement;
        new (): HTMLSalableInvoicesElement;
    };
    interface HTMLSalablePricingTableElement extends Components.SalablePricingTable, HTMLStencilElement {
    }
    var HTMLSalablePricingTableElement: {
        prototype: HTMLSalablePricingTableElement;
        new (): HTMLSalablePricingTableElement;
    };
    interface HTMLSalableStatusElement extends Components.SalableStatus, HTMLStencilElement {
    }
    var HTMLSalableStatusElement: {
        prototype: HTMLSalableStatusElement;
        new (): HTMLSalableStatusElement;
    };
    interface HTMLElementTagNameMap {
        "salable-button": HTMLSalableButtonElement;
        "salable-checkout": HTMLSalableCheckoutElement;
        "salable-date": HTMLSalableDateElement;
        "salable-invoices": HTMLSalableInvoicesElement;
        "salable-pricing-table": HTMLSalablePricingTableElement;
        "salable-status": HTMLSalableStatusElement;
    }
}
declare namespace LocalJSX {
    /**
     * button component
     */
    interface SalableButton {
    }
    interface SalableCheckout {
        /**
          * A unique identifier to authenticate HTTP calls to Salable API
         */
        "apiKey": string;
        /**
          * A user's email address to be used for the checkout.  Providing the user's email skips the provide email step during checkout
         */
        "email"?: string;
        /**
          * A unique identifier used in licensing that represents the entity to which a license is granted
         */
        "granteeId": string;
        /**
          * A unique identifier for a member or user
         */
        "member": string;
        /**
          * A unique identifier for a specific plan
         */
        "planUuid": string;
        /**
          * The URL the user is sent to if they successfully completed a payment
         */
        "successUrl": string;
    }
    interface SalableDate {
        /**
          * The date to display
         */
        "date"?: string | number;
    }
    interface SalableInvoices {
        /**
          * The publishable api key, this can be generated in the Salable dashboard
         */
        "apiKey": string;
        /**
          * The number of rows to display per page
         */
        "limit"?: number;
        /**
          * The uuid of the subscription that you want to display invoices for.
         */
        "subscriptionUuid": string;
    }
    interface SalablePricingTable {
        /**
          * Enables the promo code field in Stripe checkout. Accepts 'true' or 'false'. Cannot be used with promoCode.
         */
        "allowPromoCode"?: string;
        /**
          * The publishable api key, this can be generated in the Salable dashboard
         */
        "apiKey": string;
        /**
          * Automatically calculate tax on checkout based on the customer's location and your Stripe settings.
         */
        "automaticTax"?: string;
        /**
          * Uses the currency short name (e.g., USD). Defaults to the default currency on the Product which the Plan is linked to. Currently only supported on payment integration type 'stripe_existing'.
         */
        "currency"?: string;
        /**
          * Pre-fills the customer email in Stripe checkout.
         */
        "customerEmail"?: string;
        /**
          * The ID of an existing customer in your payment integration. This pre-fills the email, card details, and postcode at checkout.
         */
        "customerId"?: string;
        /**
          * The URL to send users to if the transaction fails. Must be an absolute URL.
         */
        "globalCancelUrl": string;
        /**
          * The unique identifier for the grantee for all plan checkouts links.
         */
        "globalGranteeId": string;
        /**
          * The URL to send users to after a successful purchase. Must be an absolute URL.
         */
        "globalSuccessUrl": string;
        /**
          * If you provided the uuid of a custom pricing table set this to true
         */
        "isCustomPricingTable"?: boolean;
        /**
          * The ID of the member who will manage the license.
         */
        "member": string;
        /**
          * Configure cancelUrls per plan, string format `{'plan-uuid-one':'https://example.com/cancel-one','plan-uuid-two':'https://example.com/cancel-two'}`
         */
        "perPlanCancelUrls"?: Record<string, string> | string;
        /**
          * Configure granteeIds per plan, string format `{'plan-uuid-one': 'granteeIdOne', 'plan-uuid-two': 'granteeIdTwo'}`
         */
        "perPlanGranteeIds"?: Record<string, string> | string;
        /**
          * Configure successUrls per plan, string format `{'plan-uuid-one': 'https://example.com/success-one' , 'plan-uuid-two': 'https://example.com/success-two'}`
         */
        "perPlanSuccessUrls"?: Record<string, string> | string;
        /**
          * Used to pre-fill the promo code in Stripe checkout. Use the promo code ID from Stripe dashboard. Customers cannot edit this field during checkout.
         */
        "promoCode"?: string;
        /**
          * The uuid of the pricing table that you want to display.
         */
        "uuid": string;
    }
    interface SalableStatus {
        /**
          * The status type
         */
        "statusType"?: StatusType;
    }
    interface IntrinsicElements {
        "salable-button": SalableButton;
        "salable-checkout": SalableCheckout;
        "salable-date": SalableDate;
        "salable-invoices": SalableInvoices;
        "salable-pricing-table": SalablePricingTable;
        "salable-status": SalableStatus;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            /**
             * button component
             */
            "salable-button": LocalJSX.SalableButton & JSXBase.HTMLAttributes<HTMLSalableButtonElement>;
            "salable-checkout": LocalJSX.SalableCheckout & JSXBase.HTMLAttributes<HTMLSalableCheckoutElement>;
            "salable-date": LocalJSX.SalableDate & JSXBase.HTMLAttributes<HTMLSalableDateElement>;
            "salable-invoices": LocalJSX.SalableInvoices & JSXBase.HTMLAttributes<HTMLSalableInvoicesElement>;
            "salable-pricing-table": LocalJSX.SalablePricingTable & JSXBase.HTMLAttributes<HTMLSalablePricingTableElement>;
            "salable-status": LocalJSX.SalableStatus & JSXBase.HTMLAttributes<HTMLSalableStatusElement>;
        }
    }
}
