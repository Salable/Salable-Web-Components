import {Outlet} from "react-router-dom";

export default function Root() {
    return (
        <div style={{padding: "40px"}}>
            <nav>
                <ul>
                    <li>
                        <a href={`/demo/salable-invoices`}>Salable Invoices</a>
                    </li>
                    <li>
                        <a href={`/demo/salable-pricing-table`}>Salable Pricing Table</a>
                    </li>
                </ul>
            </nav>
            <div id="detail">
                <Outlet />
            </div>
        </div>
    )
}
