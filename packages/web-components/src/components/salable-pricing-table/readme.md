# salable-pricing-table



<!-- Auto Generated Below -->


## Properties

| Property                        | Attribute                 | Description                                                                                                                                               | Type                                 | Default     |
| ------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------- |
| `allowPromoCode`                | `allow-promo-code`        | Enables the promo code field in Stripe checkout. Accepts 'true' or 'false'. Cannot be used with promoCode.                                                | `string`                             | `undefined` |
| `automaticTax`                  | `automatic-tax`           | Automatically calculate tax on checkout based on the customer's location and your Stripe settings.                                                        | `string`                             | `undefined` |
| `currency`                      | `currency`                | Uses the currency short name (e.g. USD). Required if pricing table contains paid plans                                                                    | `string`                             | `undefined` |
| `customerEmail`                 | `customer-email`          | Pre-fills the customer email in Stripe checkout.                                                                                                          | `string`                             | `undefined` |
| `customerId`                    | `customer-id`             | The ID of an existing customer in your payment integration. This pre-fills the email, card details, and postcode at checkout.                             | `string`                             | `undefined` |
| `environment`                   | `environment`             |                                                                                                                                                           | `string`                             | `undefined` |
| `globalCancelUrl` _(required)_  | `global-cancel-url`       | The URL to send users to if the transaction fails. Must be an absolute URL.                                                                               | `string`                             | `undefined` |
| `globalContactUrl`              | `global-contact-url`      | The URL to send users for coming soon plans.                                                                                                              | `string`                             | `undefined` |
| `globalGranteeId` _(required)_  | `global-grantee-id`       | The unique identifier for the grantee for all plan checkouts links.                                                                                       | `string`                             | `undefined` |
| `globalSuccessUrl` _(required)_ | `global-success-url`      | The URL to send users to after a successful purchase. Must be an absolute URL.                                                                            | `string`                             | `undefined` |
| `isCustomPricingTable`          | `is-custom-pricing-table` | If you provided the uuid of a custom pricing table set this to true                                                                                       | `boolean`                            | `false`     |
| `member` _(required)_           | `member`                  | The ID of the member who will manage the license.                                                                                                         | `string`                             | `undefined` |
| `perPlanCancelUrls`             | `per-plan-cancel-urls`    | Configure cancelUrls per plan, string format `{'plan-uuid-one':'https://example.com/cancel-one','plan-uuid-two':'https://example.com/cancel-two'}`        | `string \| { [x: string]: string; }` | `undefined` |
| `perPlanGranteeIds`             | `per-plan-grantee-ids`    | Configure granteeIds per plan, string format `{'plan-uuid-one': 'granteeIdOne', 'plan-uuid-two': 'granteeIdTwo'}`                                         | `string \| { [x: string]: string; }` | `undefined` |
| `perPlanSuccessUrls`            | `per-plan-success-urls`   | Configure successUrls per plan, string format `{'plan-uuid-one': 'https://example.com/success-one' , 'plan-uuid-two': 'https://example.com/success-two'}` | `string \| { [x: string]: string; }` | `undefined` |
| `promoCode`                     | `promo-code`              | Used to pre-fill the promo code in Stripe checkout. Use the promo code ID from Stripe dashboard. Customers cannot edit this field during checkout.        | `string`                             | `undefined` |
| `sessionToken` _(required)_     | `session-token`           | The generated token for this session from the Salable API                                                                                                 | `string`                             | `undefined` |
| `uuid` _(required)_             | `uuid`                    | The uuid of the pricing table that you want to display.                                                                                                   | `string`                             | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
