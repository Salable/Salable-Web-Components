---
sidebar_position: 1
title: Pricing Table
description: How to use the pricing table web component and React wrapper
---

## Web Component

### HTML

```html
<!doctype html>
<head>
    <title>Salable Web Component Example</title>
    <script type="module">
        import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/@salable/web-components/loader/index.es2017.js';
        defineCustomElements();
    </script>
</head>
<body>
<salable-pricing-table
    api-key="xxxxx"
    uuid="xxxxx"
    global-success-url="https://cataas.com/cat/cute"
    global-cancel-url="https://cataas.com/cat/angry"
    global-grantee-id="123"
    member="456"
></salable-pricing-table>
</body>
</html>
```

### Svelte

*+page.svelte*
```sveltehtml
<script>
    import {defineCustomElements} from "@salable/web-components/loader";
    defineCustomElements();
</script>

<salable-pricing-table
    api-key="xxxxx"
    uuid="xxxxx"
    global-success-url="https://cataas.com/cat/cute"
    global-cancel-url="https://cataas.com/cat/angry"
    global-grantee-id="123"
    member="456"
></salable-pricing-table>
```

*+page.js*
```js
export const ssr = false;
```

## React Web Component

### React

```tsx
import { defineCustomElements, SalablePricingTable } from '@salable/react-web-components';

defineCustomElements();

export default function SalablePricingTableDemo() {
    return (
        <SalablePricingTable
            apiKey="xxxxx"
            uuid="xxxxx"
            globalSuccessUrl="https://google.co.uk"
            globalCancelUrl="https://google.co.uk"
            globalGranteeId="123"
            member="456"
        />
    )
}
```

## Properties

| Property                        | Attribute                 | Description                                                                                                                                                                                    | Type                                 | Default     |
|---------------------------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|-------------|
| `apiKey` _(required)_           | `api-key`                 | The publishable api key, this can be generated in the Salable dashboard                                                                                                                        | `string`                             | `undefined` |
| `uuid` _(required)_             | `uuid`                    | The uuid of the pricing table that you want to display.                                                                                                                                        | `string`                             | `undefined` |
| `member` _(required)_           | `member`                  | The ID of the member who will manage the license.                                                                                                                                              | `string`                             | `undefined` |
| `globalCancelUrl` _(required)_  | `global-cancel-url`       | The URL to send users to if the transaction fails. Must be an absolute URL.                                                                                                                    | `string`                             | `undefined` |
| `globalGranteeId` _(required)_  | `global-grantee-id`       | The unique identifier for the grantee for all plan checkouts links.                                                                                                                            | `string`                             | `undefined` |
| `globalSuccessUrl` _(required)_ | `global-success-url`      | The URL to send users to after a successful purchase. Must be an absolute URL.                                                                                                                 | `string`                             | `undefined` |
| `globalContactUrl`              | `global-contact-url`      | The URL for the "Coming soon" plan cta.                                                                                                                                                        | `string`                             | `undefined` |
| `perPlanCancelUrls`             | `per-plan-cancel-urls`    | Configure cancelUrls per plan, string format `{'plan-uuid-one':'https://example.com/cancel-one','plan-uuid-two':'https://example.com/cancel-two'}`                                             | `string \| { [x: string]: string; }` | `undefined` |
| `perPlanGranteeIds`             | `per-plan-grantee-ids`    | Configure granteeIds per plan, string format `{'plan-uuid-one': 'granteeIdOne', 'plan-uuid-two': 'granteeIdTwo'}`                                                                              | `string \| { [x: string]: string; }` | `undefined` |
| `perPlanSuccessUrls`            | `per-plan-success-urls`   | Configure successUrls per plan, string format `{'plan-uuid-one': 'https://example.com/success-one' , 'plan-uuid-two': 'https://example.com/success-two'}`                                      | `string \| { [x: string]: string; }` | `undefined` |
| `isCustomPricingTable`          | `is-custom-pricing-table` | If you provided the uuid of a custom pricing table set this to true                                                                                                                            | `boolean`                            | `false`     |
| `customerEmail`                 | `customer-email`          | Pre-fills the customer email in Stripe checkout.                                                                                                                                               | `string`                             | `undefined` |
| `customerId`                    | `customer-id`             | The ID of an existing customer in your payment integration. This pre-fills the email, card details, and postcode at checkout.                                                                  | `string`                             | `undefined` |
| `currency`                      | `currency`                | Uses the currency short name (e.g., USD). Defaults to the default currency on the Product which the Plan is linked to. Currently only supported on payment integration type 'stripe_existing'. | `string`                             | `undefined` |
| `promoCode`                     | `promo-code`              | Used to pre-fill the promo code in Stripe checkout. Use the promo code ID from Stripe dashboard. Customers cannot edit this field during checkout.                                             | `string`                             | `undefined` |
| `allowPromoCode`                | `allow-promo-code`        | Enables the promo code field in Stripe checkout. Accepts 'true' or 'false'. Cannot be used with promoCode.                                                                                     | `string`                             | `undefined` |
| `automaticTax`                  | `automatic-tax`           | Automatically calculate tax on checkout based on the customer's location and your Stripe settings.                                                                                             | `string`                             | `undefined` |
