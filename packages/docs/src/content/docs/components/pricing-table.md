---
title: Pricing Table
description: How to use the pricing table web component and React wrapper
---

## Web Component Example 

```html
  <salable-pricing-table
    api-key="xxxxx"
    uuid="xxxxx"
    global-success-url="https://cataas.com/cat/cute"
    global-cancel-url="https://cataas.com/cat/angry"
    global-grantee-id="123"
    member="456"
  ></salable-pricing-table>
```

## React Component Example

```tsx
import { defineCustomElements } from '@salable/react-library';
import {SalablePricingTable} from "@salable/react-library";

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

| Property                        | Attribute           | Description                                                             | Type     | Default     |
| ------------------------------- | ------------------- | ----------------------------------------------------------------------- | -------- | ----------- |
| `apiKey` _(required)_           | `api-key`           | The publishable api key, this can be generated in the Salable dashboard | `string` | `undefined` |
| `subscriptionUuid` _(required)_ | `subscription-uuid` | The uuid of the subscription that you want to display invoices for.     | `string` | `undefined` |
| `limit`                         | `limit`             | The number of rows to display per page                                  | `number` | `25`        |
