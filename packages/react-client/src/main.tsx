import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {defineCustomElements, SalablePricingTable} from '@salable/react-web-components';
import Root from "./root.tsx";
import SalablePricingTableDemo from "./components/salable-pricing-table/salable-pricing-table-demo.tsx";
import SalableCheckoutDemo from './components/salable-checkout/salable-checkout-demo.tsx';
import SalableCheckoutTest from './components/salable-checkout/salable-checkout-test.tsx';
import SalablePricingTableTest from "./components/salable-pricing-table/salable-pricing-table-test.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                path: "/demo/salable-pricing-table",
                element: <SalablePricingTableDemo/>,
            },
            {
                path: "/demo/salable-checkout",
                element: <SalableCheckoutDemo/>,
            },
        ],
    },
    {
        path: "/test/salable-checkout",
        element: <SalableCheckoutTest/>,
    },
    {
        path: "/test/salable-checkout/invalid-email",
        element: <SalableCheckoutTest email='johnnydoe@email'/>,
    },
    {
        path: "/test/salable-checkout/valid-email",
        element: <SalableCheckoutTest email='johnnydoe@email.com'/>,
    },
    {
        path: "/test/salable-pricing-table",
        element: <SalablePricingTableTest/>,
    },
    {
        path: "/test/salable-pricing-table/is-subscribed",
        element: <SalablePricingTableTest />,
    },
    {
        path: "/test/salable-pricing-table/per-seat",
        element: <SalablePricingTableTest />,
    },
    {
        path: "/test/salable-pricing-table/coming-soon",
        element: <SalablePricingTable
          apiKey="test_xxxxx"
          uuid="xxxxx"
          isCustomPricingTable={true}
          globalSuccessUrl="https://google.com"
          globalCancelUrl="https://google.com"
          globalContactUrl="https://example.com/contact"
          globalGranteeId="xxxxx"
          member="xxxxx"
        />
    },
    {
        path: "/test/salable-pricing-table/checkout",
        element: <SalablePricingTableTest />,
    },
    {
        path: "/test/salable-pricing-table/currency",
        element: <SalablePricingTable
          apiKey="test_xxxxx"
          uuid="xxxxx"
          isCustomPricingTable={true}
          globalSuccessUrl="https://google.com"
          globalCancelUrl="https://google.com"
          globalGranteeId="xxxxx"
          member="xxxxx"
          currency="gbp"
        />,
    },
    {
        path: "/test/salable-pricing-table/errors/unauthorised",
        element: <SalablePricingTableTest />,
    },
    {
        path: "/test/salable-pricing-table/errors/fetch-fails",
        element: <SalablePricingTableTest />,
    },
    {
        path: "/test/salable-pricing-table/errors/required-prop",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        element: <SalablePricingTable
          apiKey="test_xxxxx"
          uuid="xxxxx"
          isCustomPricingTable={true}
          globalSuccessUrl="https://google.com"
          globalCancelUrl="https://google.com"
          globalGranteeId="xxxxx"
        />,
    },
    {
        path: "/test/salable-pricing-table/errors/checkout",
        element: <SalablePricingTableTest />,
    },
    {
        path: "/test/salable-pricing-table/errors/currency",
        element: <SalablePricingTable
          apiKey="test_xxxxx"
          uuid="xxxxx"
          isCustomPricingTable={true}
          globalSuccessUrl="https://google.com"
          globalCancelUrl="https://google.com"
          globalGranteeId="xxxxx"
          member="xxxxx"
          currency="cad"
        />,
    },
]);

defineCustomElements();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
