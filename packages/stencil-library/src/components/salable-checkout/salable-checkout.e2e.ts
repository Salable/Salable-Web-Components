import { test } from 'stencil-playwright';
import { clientSecret, salableCheckoutInvalidEmailPrefillTest, salableCheckoutPaymentIntentTest, salableCheckoutPrefillWithEmailTest, setUpCheckoutFetch, setUpPaymentIntent } from "../../../../utilities/tests/salable-checkout-tests";
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
  test('Prefill checkout with invalid email', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-uuid="${mockPlanUuid}"
          member=${mockMember} grantee-id=${mockGrantee} success-url=${mockSuccessUrl} email="johndoe@email"
        ></salable-checkout>
      `);

    await salableCheckoutInvalidEmailPrefillTest(page);
  });

  test('Prefill checkout with email', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());
    // mock create payment intent endpoint
    await setUpPaymentIntent(page, { clientSecret })

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-uuid="${mockPlanUuid}"
          member=${mockMember} grantee-id=${mockGrantee} success-url=${mockSuccessUrl} email="johndoe@email.com"
        ></salable-checkout>
      `);

    await salableCheckoutPrefillWithEmailTest(page);
  });
});
