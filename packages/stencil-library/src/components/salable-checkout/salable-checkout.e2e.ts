import { test } from 'stencil-playwright';
import { salableCheckoutPaymentIntentTest, salableCheckoutPropsTests, setUpCheckoutFetch } from "../../../../utilities/tests/salable-checkout-tests";
import { mockCheckout } from "../../../../utilities/mock-data/checkout.mock";

test.describe('salable-checkout Stencil E2E Tests', () => {
  const mockApiKey = 'mock_api_key';
  const mockPlanUuid = 'mock_plan_uuid';

  test('Check for missing props', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-id="${mockPlanUuid}"
        ></salable-checkout>
      `);

    await salableCheckoutPropsTests(page);
  });

  test('Create payment intent form', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-id="${mockPlanUuid}" member-id="example-member-123" grantee-id='example-grantee-123' success-url="https://www.salable.app"
        ></salable-checkout>
      `);

    await salableCheckoutPaymentIntentTest(page);
  });
});
