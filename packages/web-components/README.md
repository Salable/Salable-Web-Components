# @salable/web-components

## Introduction

The Salable Web Components library is designed to streamline the development process for SaaS products. It is a collection of Web Components that facilitate easy integration with payment platforms and simplify the creation of flexible pricing models. Our components are seamlessly compatible with various web frameworks, making it a breeze for developers to integrate payment and licensing functionality in web applications.

## Installation

To incorporate the Salable Web Components library into your project, install the package via npm:

```
npm i @salable/web-components
```

## Getting Started

After installation, you can use our Web Components directly in your HTML. To ensure the components are loaded and properly initialized, you may need to include the library's loader script in your project.

Here's an example of how to use the `salable-pricing-table` component in your HTML:

```html
<salable-pricing-table
  session-token="your_session_token"
  uuid="your_uuid"
  global-success-url="https://example.com/success"
  global-cancel-url="https://example.com/cancel"
  global-grantee-id="your_grantee_id"
  member="your_member_id"
></salable-pricing-table>
```

Be sure to replace "your_api_key", "your_uuid", "your_grantee_id", and "your_member_id" with your actual configuration values.

This example demonstrates how to use the salable-pricing-table component, but our library includes more components that you can utilise in your projects.

## Documentation

For a full list of components and detailed guides on using them, please refer to our [core documentation](https://docs.salable.app/web-components/web-components-latest/). You'll find examples, configuration options, and best practices to help you integrate our library into your applications effectively.

## Support and Contributions

Encountering issues or have suggestions? Please submit them on our [GitHub issues page](https://github.com/Salable/Salable-Web-Components/issues)
