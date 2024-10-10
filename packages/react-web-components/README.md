# @salable/react-web-components

## Introduction

The Salable React Web Component library is designed to streamline the development process for SaaS products. It is a collection of Web Components that facilitate easy integration with payment platforms and simplify the creation of flexible pricing models. Our components are seamlessly compatible with various web frameworks, making it a breeze for developers to integrate payment and licensing functionality in web applications.

## Installation

To add the Salable React Web Component library to your project, execute the following command:

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
            sessionToken="your_session_token"
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

For a full list of components and detailed guides on using them, please refer to our [core documentation](https://docs.salable.app/web-components/web-components-latest/). You'll find examples, configuration options, and best practices to help you integrate our library into your applications effectively.

## Support and Contributions

Encountering issues or have suggestions? Please submit them on our [GitHub issues page](https://github.com/Salable/Salable-Web-Components/issues)
