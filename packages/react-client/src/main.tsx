import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {defineCustomElements} from '@salable/react-web-components';
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
]);

defineCustomElements();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
