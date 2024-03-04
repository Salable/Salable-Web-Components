# @salable/react-web-components

## Introduction

The `@salable/react-web-components` is an essential part of the Salable Component Library, tailored for React applications to incorporate payment and licensing functionalities with ease. Built on top of Stencil JS, this library provides React components designed for seamless integration in SaaS products and various web applications, ensuring compatibility, performance, and scalability.

## Key Features

- **React Components**: Our library offers React components that wrap Stencil JS web components, combining the robustness of web standards with the ease of use in the React ecosystem.
- **Seamless Integration**: With minimal setup, you can integrate our components into your project, enhancing your application with payment and licensing capabilities.
- **Customizable and Scalable**: Designed to meet the demands of any scale, from small projects to complex applications, ensuring that your needs for customization and scalability are met.
- **Cross-Browser Compatibility**: Thanks to Stencil JS, enjoy consistent performance and appearance across all modern browsers.

## Installation

To add the Salable React Library to your project, execute the following command:

```
npm i @salable/react-web-components
```

## Getting Started

Once installed, you need to import and define custom elements in your React project. Here's how to get started:

```jsx
import { defineCustomElements } from '@salable/react-web-components';
import { SalablePricingTable } from "@salable/react-web-components";

defineCustomElements();

export default function SalablePricingTableDemo() {
    return (
        <SalablePricingTable
            apiKey="your_api_key"
            uuid="your_uuid"
            globalSuccessUrl="https://example.com/success"
            globalCancelUrl="https://example.com/cancel"
            globalGranteeId="your_grantee_id"
            member="your_member_id"
        />
    );
}
```

Replace `"your_api_key"`, `"your_uuid"`, `"your_grantee_id"`, and `"your_member_id"` with your actual configuration values. 

This example demonstrates how to use the `SalablePricingTable` component, but our library includes more components that you can utilize in your projects.

## Documentation

For a full list of components and detailed guides on using them, please refer to our [core documentation](https://docs.salable.app). You'll find examples, configuration options, and best practices to help you integrate our library into your applications effectively.

## Support and Contributions

Encountering issues or have suggestions? Please submit them on our [GitHub issues page](https://github.com/Salable/salable-web-components-stenciljs/issues)
