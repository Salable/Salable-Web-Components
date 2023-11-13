
# Salable Component Library

The Salable Component Library is a robust and versatile collection of web components designed to enhance the functionality and visual appeal of Salable dashboards. This library includes a range of components such as pricing tables, invoice lists, checkouts, and payment methods, each meticulously crafted to integrate seamlessly into a variety of web applications. Built using StencilJS and optimized for React, these components offer a blend of performance, customization, and ease of use, making them an ideal choice for developers looking to create intuitive and interactive user interfaces for financial and e-commerce platforms.

## Installation Instructions

---

To integrate the Salable Component Library into your project, you can install the packages directly from npm. Ensure you have Node.js installed on your system, and then run the following commands in your project directory:

For Stencil components:
```bash
pnpm add @salable/stencil-library
```

For React components:
```bash
pnpm add @salable/react-library
```

These commands will install the respective libraries and add them as dependencies in your `package.json` file.

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

This example demonstrates how to render the `SalableInvoices` component with React, passing in the necessary props.

Understood! I'll adjust the testing strategy section to reflect the nuances of testing common components versus core components, especially considering the use of Tailwind CSS and the absence of shadow DOM in common components. Here's the revised section:

---

## Testing Strategy

Our project's testing framework leverages Playwright for end-to-end testing and Stencil spec tests for unit testing, with specific focus areas for different types of components:

### End-to-End Testing with Playwright (Stencil Library)

End-to-end testing ensures our components function correctly in a real browser environment:

Location: `stencil-library` package.
Run: `pnpm test:e2e` or `pnpm test:e2e:ui`

#### For Core Components (e.g., `salable-invoice`):
   - Mock any data responses using Playwright routes.
   - Confirm the component renders correctly
   - Ensure data is displayed in the expected locations
   - Make sure any user interactions work as expected
   - Perform visual regression testing to ensure styles (provided by Tailwind CSS) are correctly applied.

#### For Common Components (e.g., `salable-button`, `salable-status`):
   - Ensure the component renders
   - Check the content is displayed correctly
   - Test any user interactions that affect the component state or trigger events
   - If there are various combinations of props make sure they're tested sensibly
   - As these components are used within core components and don't have a shadow DOM, they are not subjected to individual visual regression testing.

### Unit Testing with Stencil Spec Tests

Unit testing is targeted at verifying the functionality of individual components, we will limit unit tests to common components only to avoid having mock data there:

- Focus on testing specific class methods and functionalities, ensuring they operate as expected when used within core components.

### Testing React-Wrapped Components

Location: `react-client` package.
Run: `pnpm test` or `pnpm test:ui`

- React client tests share the same setup and testing scripts as Stencil library e2e tests. The next section explains more

## End-to-End Testing Strategy
The project integrates multiple front-end frameworks like Stencil and React. We've adopted a specific testing strategy to ensure consistency, efficiency, and maintainability. Here's how we approach it:

### Unified End-to-End Test Suites and Shared Resources
 - **We Share Test Utilities**: We have developed a suite of standard test utilities applicable across both frameworks. They include setup routines, simulations of user actions, and assertion functions.
 - **We Use Common Mock Data**: We maintain a centralized repository of mock data, ensuring all tests across frameworks are using the same datasets for consistency.
 - **We Design Abstract Test Scenarios**: Our test scenarios should be independent of the specificities of any framework, allowing us to apply the same test logic in both Stencil and React environments.
 - **We Focus on Component Interactions**: Our e2e tests are more about how components interact with the shared utilities and mock data than their internal implementation specifics.
 - **We Address Framework-Specific Features Separately**: If features are unique to a particular framework, we create additional, targeted tests for those aspects. These complement our shared tests and ensure comprehensive coverage. 

By adopting this approach, we've created a robust testing environment that supports multiple frameworks while maintaining the integrity and consistency of our application across different technologies. This strategy enhances our development process and ensures a high-quality end product.

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
- **Framework Specifics**: Utilizes `@playwright/test` for React testing.
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

   This will publish the packages to npm, ensuring that any updates are made available to users.

Remember to document your changes in a `CHANGELOG.md` file for each package, providing clear and concise descriptions of features, fixes, and any breaking changes introduced with each release.
