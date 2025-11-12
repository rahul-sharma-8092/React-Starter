import { BrowserRouter } from "react-router-dom";
import AppProvider from "./AppProvider";
import AppRouter from "./AppRouter";

function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRouter />
            </AppProvider>
        </BrowserRouter>
    );
}

export default App;
