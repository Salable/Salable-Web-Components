---
sidebar_position: 2
title: Checkout
description: How to use the checkout web component and React wrapper
---

## Web Components

### HTML Example

```html
<!doctype html>
<head>
    <title>Salable Web Component Example</title>
    <script type="module">
        import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/@salable/stencil-library/loader/index.es2017.js';
        defineCustomElements();
    </script>
</head>
<body>
<salable-checkout
    api-key="xxxxx"
    plan-uuid="xxxxx"
    member="xxxxx"
    grantee-id="xxxxx"
    success-url="https://example.com/success"
></salable-checkout>
</body>
</html>

### Svelte Example

*+page.svelte*
```sveltehtml
<script>
    import {defineCustomElements} from "@salable/stencil-library/loader";
    defineCustomElements();
</script>

<salable-checkout
    api-key="xxxxx"
    plan-uuid="xxxxx"
    member="xxxxx"
    grantee-id="xxxxx"
    success-url="https://example.com/success"
></salable-checkout>
```

*+page.js*
```js
export const ssr = false;
```

## React Component Example

```tsx
import { defineCustomElements } from '@salable/react-library';
import { SalableCheckout } from "@salable/react-library";

defineCustomElements();

export default function SalableCheckoutDemo() {
    return (
        <SalableCheckout
            apiKey="xxxxx"
            planUuid="xxxxx"
            member="xxxxx"
            granteeId="xxxxx"
            successUrl="https://example.com/success"
        />
    )
}

```

## Properties

| Property                  | Attribute     | Description                                                                                                                  | Type     | Default     |
| ------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `apiKey` _(required)_     | `api-key`     | A unique identifier to authenticate HTTP calls to Salable API                                                                | `string` | `undefined` |
| `planUuid` _(required)_   | `plan-uuid`   | A unique identifier for a specific plan                                                                                      | `string` | `undefined` |
| `member` _(required)_     | `member`      | A unique identifier for a member or user                                                                                     | `string` | `undefined` |
| `granteeId` _(required)_  | `grantee-id`  | A unique identifier used in licensing that represents the entity to which a license is granted                               | `string` | `undefined` |
| `successUrl` _(required)_ | `success-url` | The URL the user is sent to if they successfully completed a payment                                                         | `string` | `undefined` |
| `email`                   | `email`       | A user's email address to be used for the checkout.  Providing the user's email skips the provide email step during checkout | `string` | `undefined` |
