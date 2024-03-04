# @salable/web-components

## Introduction

Welcome to the `@salable/web-components`, a comprehensive suite of web components designed for the seamless integration of payment and licensing services into web applications. Our library leverages the power of Stencil JS to provide high-performance, standards-compliant components suitable for any project, especially those within the SaaS domain.

## Key Features

- **Web Standards Compliance**: Built with Stencil JS, our components are fully compliant with web standards, ensuring compatibility across all modern web browsers.
- **Seamless Integration**: Our components are crafted to be easily integrated into any web application, facilitating the addition of payment and licensing functionalities with minimal setup.
- **Customizable and Scalable**: With a wide range of customization options, our components can be tailored to meet the specific needs of your project, ensuring scalability from small applications to large-scale enterprise solutions.
- **SaaS-Focused**: Specifically designed for SaaS products, our components provide out-of-the-box solutions for integrating payment services like Stripe and creating versatile pricing models.

## Installation

To incorporate the Salable Stencil Web Component Library into your project, install the package via npm:

```
npm i @salable/web-components
```

## Getting Started

After installation, you can use our web components directly in your HTML. To ensure the components are loaded and properly initialized, you may need to include the library's loader script in your project.

Here's an example of how to use the `salable-pricing-table` component in your HTML:

```html
<salable-pricing-table
  api-key="your_api_key"
  uuid="your_uuid"
  global-success-url="https://example.com/success"
  global-cancel-url="https://example.com/cancel"
  global-grantee-id="your_grantee_id"
  member="your_member_id"
></salable-pricing-table>
```

Be sure to replace `"your_api_key"`, `"your_uuid"`, `"your_grantee_id"`, and `"your_member_id"` with your actual configuration values.

This example demonstrates how to use the `salable-pricing-table` component, but our library includes more components that you can utilize in your projects.

## Documentation

For a full list of components and detailed guides on using them, please refer to our [core documentation](https://docs.salable.app). You'll find examples, configuration options, and best practices to help you integrate our library into your applications effectively.

## Support and Contributions

Encountering issues or have suggestions? Please submit them on our [GitHub issues page](https://github.com/Salable/salable-web-components-stenciljs/issues)
