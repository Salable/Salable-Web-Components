import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { defineCustomElements } from '@salable/react-library';
import SalableInvoicesDemo from "./components/salable-invoices/salable-invoices-demo.tsx";
import SalableInvoicesTest from "./components/salable-invoices/salable-invoices-test.tsx";
import Root from "./root.tsx";
import SalablePricingTableTestCustomPricingTable from "./components/salable-pricing-table/salable-pricing-table-test-custom-pricing-table.tsx";
import SalablePricingTableDemo from "./components/salable-pricing-table/salable-pricing-table-demo.tsx";
import SalableCheckoutDemo from './components/salable-checkout/salable-checkout-demo.tsx';
import SalableCheckoutTest from './components/salable-checkout/salable-checkout-test.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/demo/salable-invoices",
                element: <SalableInvoicesDemo />,
            },
            {
                path: "/demo/salable-pricing-table",
                element: <SalablePricingTableDemo />,
            },
            {
                path: "/demo/salable-checkout",
                element: <SalableCheckoutDemo />,
            },
            {
                path: "/demo/salable-checkout/invalid-email",
                element: <SalableCheckoutDemo email='johnnydoe@email' />,
            },
            {
                path: "/demo/salable-checkout/valid-email",
                element: <SalableCheckoutDemo email='johnnydoe@email.com' />,
            },
        ],
    },
    {
        path: "/test/salable-invoices",
        element: <SalableInvoicesTest />,
    },
    {
        path: "/test/salable-checkout",
        element: <SalableCheckoutTest />,
    },
    {
        path: "/test/salable-checkout/invalid-email",
        element: <SalableCheckoutTest email='johnnydoe@email' />,
    },
    {
        path: "/test/salable-checkout/valid-email",
        element: <SalableCheckoutTest email='johnnydoe@email.com' />,
    },
    {
        path: "/test/salable-pricing-table",
        element: <SalablePricingTableTestCustomPricingTable />,
    },
]);

defineCustomElements();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
