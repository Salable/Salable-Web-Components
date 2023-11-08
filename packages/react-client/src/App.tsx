import './App.css';
import {defineCustomElements, SalableInvoices} from "@salable/react-library";

defineCustomElements();

function App() {
    return (
        <div className="App">
            <h1 role='heading'>Test</h1>
            <SalableInvoices data-testid="component" api-key="live_6c93207e7a06015f8cfd9169613fd43a65fb9dfc" subscription-uuid="6491cfdb-e3b1-4749-bd26-eefa7bcb6fc3" limit={5}/>
        </div>
    );
}

export default App;