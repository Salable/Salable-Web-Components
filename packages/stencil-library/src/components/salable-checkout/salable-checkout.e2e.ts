import { test } from 'stencil-playwright';
import { salableCheckoutPaymentIntentTest, setUpCheckoutFetch } from "../../../../utilities/tests/salable-checkout-tests";
import { mockCheckout } from "../../../../utilities/mock-data/checkout.mock";

test.describe('salable-checkout Stencil E2E Tests', () => {
  const mockApiKey = 'mock_api_key';
  const mockPlanUuid = 'mock_plan_uuid';
  const mockMember = 'example-member-123'
  const mockGrantee = 'example-grantee-123'
  const mockSuccessUrl = "https://www.google.com"

  // test('Check for missing props', async ({ page }) => {
  //   await setUpCheckoutFetch(page, mockCheckout());

  //   await page.setContent(`
  //       <salable-checkout
  //         api-key="${mockApiKey}"
  //         plan-uuid="${mockPlanUuid}"
  //         member=${mockMember} grantee-id=${mockGrantee} success-url=${mockSuccessUrl}
  //       ></salable-checkout>
  //     `);

  //   await salableCheckoutPropsTests(page);
  // });

  test('Create payment intent form', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-uuid="${mockPlanUuid}"
          member=${mockMember} grantee-id=${mockGrantee} success-url=${mockSuccessUrl}
        ></salable-checkout>
      `);

    await salableCheckoutPaymentIntentTest(page);
  });
});
