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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/demo/salable-invoices",
                element: <SalableInvoicesDemo/>,
            },
        ],
    },
    {
        path: "/test/salable-invoices",
        element: <SalableInvoicesTest/>,
    },
]);

defineCustomElements();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />

  </React.StrictMode>,
);
