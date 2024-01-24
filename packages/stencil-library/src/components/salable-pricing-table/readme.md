# salable-pricing-table



<!-- Auto Generated Below -->


## Properties

| Property                        | Attribute                 | Description                                                                                                                                                                                    | Type      | Default     |
| ------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `allowPromoCode`                | `allow-promo-code`        | Enables the promo code field in Stripe checkout. Accepts 'true' or 'false'. Cannot be used with promoCode.                                                                                     | `string`  | `undefined` |
| `apiKey` _(required)_           | `api-key`                 | The publishable api key, this can be generated in the Salable dashboard                                                                                                                        | `string`  | `undefined` |
| `automaticTax`                  | `automatic-tax`           | Automatically calculate tax on checkout based on the customer's location and your Stripe settings.                                                                                             | `string`  | `undefined` |
| `currency`                      | `currency`                | Uses the currency short name (e.g., USD). Defaults to the default currency on the Product which the Plan is linked to. Currently only supported on payment integration type 'stripe_existing'. | `string`  | `undefined` |
| `customerEmail`                 | `customer-email`          | Pre-fills the customer email in Stripe checkout.                                                                                                                                               | `string`  | `undefined` |
| `customerId`                    | `customer-id`             | The ID of an existing customer in your payment integration. This pre-fills the email, card details, and postcode at checkout.                                                                  | `string`  | `undefined` |
| `globalCancelUrl` _(required)_  | `global-cancel-url`       | The URL to send users to if the transaction fails. Must be an absolute URL.                                                                                                                    | `string`  | `undefined` |
| `globalGranteeId` _(required)_  | `global-grantee-id`       | The unique identifier for the grantee for all plan checkouts links.                                                                                                                            | `string`  | `undefined` |
| `globalSuccessUrl` _(required)_ | `global-success-url`      | The URL to send users to after a successful purchase. Must be an absolute URL.                                                                                                                 | `string`  | `undefined` |
| `isCustomPricingTable`          | `is-custom-pricing-table` | If you provided the uuid of a custom pricing table set this to true                                                                                                                            | `boolean` | `false`     |
| `member` _(required)_           | `member`                  | The ID of the member who will manage the license.                                                                                                                                              | `string`  | `undefined` |
| `perPlanCancelUrls`             | `per-plan-cancel-urls`    | Configure cancelUrls per plan, string format `planUuidOne:cancelUrlOne,planUuidTwo:cancelUrlTwo`                                                                                               | `string`  | `undefined` |
| `perPlanGranteeIds`             | `per-plan-grantee-ids`    | Configure granteeIds per plan, string format `planUuidOne:granteeIdOne,planUuidTwo:granteeIdTwo`                                                                                               | `string`  | `undefined` |
| `perPlanSuccessUrls`            | `per-plan-success-urls`   | Configure successUrls per plan, string format `planUuidOne:successUrlOne,planUuidTwo:successUrlTwo`                                                                                            | `string`  | `undefined` |
| `promoCode`                     | `promo-code`              | Used to pre-fill the promo code in Stripe checkout. Use the promo code ID from Stripe dashboard. Customers cannot edit this field during checkout.                                             | `string`  | `undefined` |
| `uuid` _(required)_             | `uuid`                    | The uuid of the pricing table that you want to display.                                                                                                                                        | `string`  | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
