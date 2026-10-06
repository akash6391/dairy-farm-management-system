import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/",
    },
    {
        name: "Animals",
        path: "/animals",
    },
    {
        name: "Milk Production",
        path: "/milk-production",
    },
    {
        name: "Breeding",
        path: "/breeding",
    },
    {
        name: "Inventory",
        path: "/inventory",
    },
    {
        name: "Milk Sales",
        path: "/sales",
    },
    {
        name: "Expenses",
        path: "/expenses",
    },
    {
        name: "Medical",
        path: "/medical",
    },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">
            
            <div className="border-b border-slate-700 p-6">
                <h1 className="text-xl font-bold">
                    Dairy Farm
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Management System
                </p>
            </div>

            <nav className="p-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `mb-2 block rounded-lg px-4 py-3 text-sm font-medium transition ${
                                isActive
                                    ? "bg-green-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
                <button className="w-full rounded-lg px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-800">
                    Logout
                </button>
            </div>

        </aside>
    );
}