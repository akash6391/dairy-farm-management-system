import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-slate-100">

            <Sidebar />

            <Topbar />

            <main className="ml-64 pt-16">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}