import { test } from 'stencil-playwright';
import {
  salableCheckoutInvalidEmailPrefillTest,
  salableCheckoutPaymentIntentTest, salableCheckoutPerSeatTest,
  salableCheckoutPrefillWithEmailTest,
  setUpCheckoutFetch,
  setUpPaymentIntent,
} from '../../../../utilities/tests/salable-checkout-tests';
import { mockCheckout } from '../../../../utilities/mock-data/checkout.mock';

const STRIPE_PLAN_ID = process.env.STRIPE_PLAN_ID;

test.describe('salable-checkout Stencil E2E Tests', () => {
  const mockApiKey = 'test_xxxxxxx';
  const mockPlanUuid = STRIPE_PLAN_ID;
  const mockMember = 'example-member-123';
  const mockGrantee = 'example-grantee-123';
  const mockSuccessUrl = 'https://www.google.com';

  test('Create payment intent form', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());
    await setUpPaymentIntent(page);

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-uuid="${mockPlanUuid}"
          member=${mockMember}
          grantee-id=${mockGrantee}
          success-url=${mockSuccessUrl}
          currency="USD"
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
          member=${mockMember}
          grantee-id=${mockGrantee}
          success-url=${mockSuccessUrl}
          email="johndoe@email"
          currency="USD"
        ></salable-checkout>
      `);

    await salableCheckoutInvalidEmailPrefillTest(page);
  });

  test('Prefill checkout with email', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout());
    await setUpPaymentIntent(page);

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-uuid="${mockPlanUuid}"
          member=${mockMember}
          grantee-id=${mockGrantee}
          success-url=${mockSuccessUrl}
          email="johndoe@email.com"
          currency="USD"
        ></salable-checkout>
      `);

    await salableCheckoutPrefillWithEmailTest(page);
  });

  test('Displays per seat cost breakdown correctly', async ({ page }) => {
    await setUpCheckoutFetch(page, mockCheckout({
      perSeatAmount: 5,
      interval: 'year',
      licenseType: 'perSeat',
      currencies: [
        {
          planUuid: "plan_xxxxx",
          currencyUuid: "currency_xxxxx",
          price: 100,
          paymentIntegrationPlanId: "plan_xxxxxx",
          currency: {
            uuid: "currency_xxxxx",
            shortName: "USD",
            longName: "United States Dollar",
            symbol: "$"
          }
        }
      ]
    }));
    await setUpPaymentIntent(page);

    await page.setContent(`
        <salable-checkout
          api-key="${mockApiKey}"
          plan-uuid="${mockPlanUuid}"
          member=${mockMember}
          grantee-id=${mockGrantee}
          success-url=${mockSuccessUrl}
          email="johndoe@email.com"
          currency="USD"
        ></salable-checkout>
      `);

    await salableCheckoutPerSeatTest(page);
  });
});
