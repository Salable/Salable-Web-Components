# Salable Component Library

The Salable Component Library is a versatile collection of web components for all your billing and checkout needs. It contains various components such as pricing tables, invoice lists, checkouts, and payment methods and will integrate seamlessly into your web application.

Built using StencilJS and optimised for React, these Web Components offer a blend of performance, customisation, and ease of use. They make them ideal for developers looking to create intuitive and interactive user interfaces for SaaS products.

## Installation Instructions

---

You can install the packages directly from npm to integrate the Salable Component Library into your project. Ensure you have Node.js installed on your system, and then run the following commands in your project directory:

For Stencil components:
```bash
pnpm add @salable/stencil-library
```

For React components:
```bash
pnpm add @salable/react-library
```

These commands will install and add the respective libraries as dependencies in your `package.json` file.

## Usage Examples

---

### Salable Invoice Component

#### Stencil `salable-invoice` Component

Integrating the `salable-invoice` component into your Stencil project is straightforward. Here's a simple example:

```html
<salable-invoices 
        api-key="pub_xxxxx"
        subscription-uuid="123e4567-e89b-12d3-a456-426614174000" 
        limit="50"
></salable-invoices>
```

This snippet will render the `salable-invoices` component with the specified API key, subscription UUID, and a limit of 50 items.

#### React `SalableInvoices` Component

For React-based projects, you can use the `SalableInvoices` component from our React library. First, ensure you import and define the custom elements:

```jsx
import { defineCustomElements } from '@salable/react-library';

defineCustomElements();
```

Then, you can use the `SalableInvoices` component in your React components like this:

```jsx
import { SalableInvoices } from "@salable/react-library";

export default function SalableInvoicesDemo() {
    return (
        <SalableInvoices
            api-key="pub_xxxxx"
            subscription-uuid="123e4567-e89b-12d3-a456-426614174000"
            limit={50}
        />
    )
}
```

This example demonstrates rendering the `SalableInvoices` component with React, passing in the necessary props.

---

## Testing Strategy

Our project's testing framework leverages Playwright for end-to-end testing and Stencil spec tests for unit testing, with specific focus areas for different types of components:

### End-to-End Testing with Playwright (Stencil Library)

**General Overview**:
End-to-end testing in our `stencil-library` package uses Playwright. To simulate real-world scenarios to ensure our components function correctly within a browser environment. Run the tests using `pnpm test:e2e` or `pnpm test:e2e:ui`.

#### For Core Components (e.g., `salable-invoice`):
- **Mock Data Responses**: Utilise Playwright routes to mock backend data responses; this is critical for testing components in isolation from the backend.
- **Rendering Verification**: Check if the component, such as `salable-invoice`, renders correctly in the browser environment, ensuring all elements are present and visible.
- **Data Display**: Verify that data fetched or passed to the component is displayed correctly in the appropriate locations within the component.
- **User Interaction Testing**: Simulate user interactions like clicks, input, and form submissions to ensure the component behaves as expected.
- **Failure Cases**: Make sure components handle failed requests gracefully and display helpful information to end users.
- **Visual Regression Testing**: Use visual comparison tools to verify that the Tailwind CSS styles are applied correctly and consistently across updates.

#### For Common Components (e.g., `salable-button`, `salable-status`):
- **Component Rendering**: Ensure these common components render correctly, verifying basic functionality and visibility.
- **Content Accuracy**: Check that the content within these components (text, icons, etc.) is displayed as expected.
- **Interaction Testing**: Test interactions (clicks, hovers, etc.) that may change the state of the component or trigger events.
- **Props Combination Testing**: Assess different combinations of properties (props) these components accept to ensure they work under various configurations.
- **Exclusion from Visual Regression Testing**: Since these components are part of the core components and lack an independent shadow DOM, they will not have visual regression tests.

### Unit Testing with Stencil Spec Tests

**Scope and Limitations**:
In unit testing, we focus on the functionality of individual components, specifically the common components, to avoid complications with mock data. We use Stencil spec tests for this purpose.

- **Method and Functionality Testing**: Examine specific class methods and functionalities within common components to ensure they perform as expected, especially when integrated within core components.

### Testing React-Wrapped Components

**Location and Execution**:
These tests are in the `react-client` package. You can run them with `pnpm test` or `pnpm test:ui`.

- **Shared Testing Approach**: React client tests align with the Stencil library e2e tests setup and execution; this ensures consistency across different frameworks.

### End-to-End Testing Strategy for Multiple Frameworks

**Integrated Approach**:
Our project combines multiple front-end frameworks, like Stencil and React, necessitating a unified and efficient testing strategy.

- **Shared Test Utilities**: We utilise a suite of standard test utilities applicable to Stencil and React. These include shared setup routines, user action simulations, and standard assertion functions.
- **Common Mock Data Repository**: A centralised mock data repository is maintained to ensure consistency across all framework tests.
- **Abstract Test Scenarios**: We design framework-agnostic test scenarios, enabling the application of the same testing logic in both Stencil and React environments.
- **Focus on Component Interactions**: The primary aim of our e2e tests is to evaluate how components interact with shared utilities and mock data rather than delving into the internal specifics of their implementation.
- **Framework-Specific Testing**: Where features are unique to a specific framework, we develop targeted tests to address these individual aspects. This approach complements our shared tests and ensures comprehensive coverage.

#### Example Stencil and React Shared End-to-End Tests

##### Stencil Component Testing: 'stencil-library'

```javascript
import {test} from 'stencil-playwright';
import InvoiceRepository from "../../../../../utilities/respository/invoice-repository";
import {salableInvoicePaginationTests, setUpInvoicePagination} from "../../../../../utilities/tests/salable-invoice-tests";
import {mockInvoices} from "../../../../../utilities/mock-data/invoice.mock";

test.describe('salable-invoices Stencil E2E Tests', () => {
   const mockApiKey = 'mock_api_key';
   const mockSubscriptionUuid = 'mock_subscription_uuid';
   const invoiceRepository = new InvoiceRepository(mockInvoices);

   test.describe('Fetch Success Cases', () => {
      test('Displays first page of paginated invoice results', async ({page}) => {
         await setUpInvoicePagination(page, invoiceRepository);

         await page.setContent(`
        <salable-invoices
          api-key="${mockApiKey}"
          subscription-uuid="${mockSubscriptionUuid}"
          limit="2"
        ></salable-invoices>
      `);

         await salableInvoicePaginationTests(page, invoiceRepository);
      });
   });
});
```
*Notes*:
- **Framework Specifics**: Uses `stencil-playwright` for E2E testing.
- **Shared Resources**: Implements `InvoiceRepository` with `mockInvoices`.
- **Test Scenario**: Validates the rendering and pagination of invoices using shared test methods.

##### React Component Testing: 'react-client'

```javascript
import {test} from '@playwright/test';
import {salableInvoicePaginationTests, setUpInvoicePagination} from "../../utilities/tests/salable-invoice-tests";
import InvoiceRepository from "../../utilities/respository/invoice-repository";
import {mockInvoices} from "../../utilities/mock-data/invoice.mock";

test.describe('salable-invoices React Client E2E Tests', () => {
   const invoiceRepository = new InvoiceRepository(mockInvoices);

   test.describe('Fetch Success Cases', () => {
      test('Displays first page of paginated invoice results', async ({page}) => {
         await setUpInvoicePagination(page, invoiceRepository);

         await page.goto('http://localhost:5173/test/salable-invoices');

         await salableInvoicePaginationTests(page, invoiceRepository);
      });
   });
});

```
*Notes:*
- **Framework Specifics**: Utilises `@playwright/test` for React testing.
- **Shared Resources**: Uses the same `InvoiceRepository` and `mockInvoices` as in Stencil tests.
- **Test Scenario**: Checks for similar functionalities as the Stencil tests, demonstrating consistency across frameworks.

### Key Implementation Details

- **Unified Test Suites**: Both examples use the same testing utilities (`salableInvoicePaginationTests`, `setUpInvoicePagination`) and mock data (`mockInvoices`), highlighting our strategy of shared resources.

- **Framework-Specific Adaptations**: While the core logic of the tests is the same, the setup differs - direct content setting in Stencil vs. navigating to a URL in React.

- **Consistent Testing Approach**: Both tests focus on component interactions, ensuring that the behavior of the components is consistent, regardless of the underlying framework.

Through these examples, we demonstrate our commitment to a testing strategy that is both flexible and efficient, ensuring our applications perform reliably across multiple frameworks.

### Versioning Guide

---

Our project adheres to [Semantic Versioning](http://semver.org/) guidelines. Versioning is managed through Lerna, facilitating the maintenance and update of multiple packages within our monorepo.

To create a new version:

1. Make sure all changes are committed.
2. Run the following command to automatically update the version numbers in `package.json` files based on the changes:

   ```bash
   pnpm lerna:version
   ```

   This command will also create a new tag in the Git repository.

3. To publish the new versions to npm, use:

   ```bash
   pnpm lerna:publish
   ```

This command will publish the packages to npm, ensuring that updates are available to users.

Remember to document your changes in a `CHANGELOG.md` file for each package, providing clear and concise descriptions of features, fixes, and any breaking changes introduced with each release.
