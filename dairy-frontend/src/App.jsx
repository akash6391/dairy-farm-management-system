import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import MilkProduction from "./pages/MilkProduction";
import Breeding from "./pages/Breeding";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Medical from "./pages/Medical";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<DashboardLayout />}>

                    <Route path="/" element={<Dashboard />} />

                    <Route
                        path="/animals"
                        element={<Animals />}
                    />

                    <Route
                        path="/milk-production"
                        element={<MilkProduction />}
                    />

                    <Route
                        path="/breeding"
                        element={<Breeding />}
                    />

                    <Route
                        path="/inventory"
                        element={<Inventory />}
                    />

                    <Route
                        path="/sales"
                        element={<Sales />}
                    />

                    <Route
                        path="/expenses"
                        element={<Expenses />}
                    />

                    <Route
                        path="/medical"
                        element={<Medical />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;