import { useEffect, useState } from "react";
import API from "../services/api";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [trends, setTrends] = useState(null);
    const [trendsLoading, setTrendsLoading] = useState(true);

    // ==============================
    // Fetch Summary
    // ==============================

    const fetchSummary = async () => {
        try {
            setLoading(true);

            const response = await API.get("/analytics/summary");

            setSummary(response.data);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // Fetch Trends
    // ==============================

    const fetchTrends = async () => {
        try {
            setTrendsLoading(true);

            const response = await API.get("/analytics/trends");

            setTrends(response.data);
        } catch (err) {
            console.error(
                "Failed to load analytics trends:",
                err
            );
        } finally {
            setTrendsLoading(false);
        }
    };

    // ==============================
    // Initial Load
    // ==============================

    useEffect(() => {
        fetchSummary();
        fetchTrends();
    }, []);

    // ==============================
    // Loading
    // ==============================

    if (loading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-xl border p-8 text-center text-slate-500">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    // ==============================
    // Error
    // ==============================

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>

                <button
                    onClick={() => {
                        fetchSummary();
                        fetchTrends();
                    }}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    // ==============================
    // Calculations
    // ==============================

    const profit = Number(
        summary.net_profit_loss || 0
    );

    const revenue = Number(
        summary.total_sales_revenue || 0
    );

    const expenses = Number(
        summary.total_expenses || 0
    );

    const milk = Number(
        summary.total_milk_produced_liters || 0
    );

    const milkData =
        trends?.milk_production || [];

    const financialData =
        trends?.financial || [];

    // ==============================
    // Format Date
    // ==============================

    const formatDate = (date) => {
        const d = new Date(date);

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        });
    };

    // ==============================
    // Prepare Chart Data
    // ==============================

    const formattedMilkData = milkData.map((item) => ({
        ...item,
        displayDate: formatDate(item.date),
    }));

    const formattedFinancialData =
        financialData.map((item) => ({
            ...item,
            displayDate: formatDate(item.date),
        }));

    return (
        <div className="p-6">

            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Farm Dashboard
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Overview of your dairy farm
                    </p>
                </div>

                <button
                    onClick={() => {
                        fetchSummary();
                        fetchTrends();
                    }}
                    className="border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ================================= */}
            {/* Main Statistics */}
            {/* ================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Total Animals */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Animals
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {summary.total_animals}
                            </h2>
                        </div>

                        <div className="bg-green-100 text-green-700 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            🐄
                        </div>

                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Registered animals
                    </p>

                </div>

                {/* Milk */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-sm text-slate-500">
                                Milk Produced
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {milk.toFixed(1)}
                                <span className="text-base font-medium ml-1">
                                    L
                                </span>
                            </h2>
                        </div>

                        <div className="bg-blue-100 text-blue-700 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            🥛
                        </div>

                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Total recorded production
                    </p>

                </div>

                {/* Inventory */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-sm text-slate-500">
                                Inventory Items
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {summary.total_inventory_items}
                            </h2>
                        </div>

                        <div className="bg-purple-100 text-purple-700 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            📦
                        </div>

                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Items currently recorded
                    </p>

                </div>

                {/* Revenue */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Revenue
                            </p>

                            <h2 className="text-3xl font-bold text-green-600 mt-2">
                                ₹{revenue.toFixed(2)}
                            </h2>
                        </div>

                        <div className="bg-green-100 text-green-700 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            💰
                        </div>

                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        From milk sales
                    </p>

                </div>

                {/* Expenses */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Expenses
                            </p>

                            <h2 className="text-3xl font-bold text-red-600 mt-2">
                                ₹{expenses.toFixed(2)}
                            </h2>
                        </div>

                        <div className="bg-red-100 text-red-700 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            💸
                        </div>

                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Total farm expenses
                    </p>

                </div>

                {/* Profit */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-sm text-slate-500">
                                Net Profit / Loss
                            </p>

                            <h2
                                className={`text-3xl font-bold mt-2 ${
                                    profit >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                ₹{profit.toFixed(2)}
                            </h2>
                        </div>

                        <div
                            className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${
                                profit >= 0
                                    ? "bg-green-100"
                                    : "bg-red-100"
                            }`}
                        >
                            {profit >= 0 ? "📈" : "📉"}
                        </div>

                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Revenue − Expenses
                    </p>

                </div>

            </div>

            {/* ================================= */}
            {/* Financial Overview */}
            {/* ================================= */}

            <div className="mt-6 bg-white border rounded-xl shadow-sm">

                <div className="px-6 py-4 border-b">
                    <h2 className="font-semibold text-slate-800">
                        Financial Overview
                    </h2>
                </div>

                <div className="p-6">

                    {/* Revenue */}

                    <div className="mb-5">

                        <div className="flex justify-between mb-2">

                            <span className="text-sm text-slate-600">
                                Revenue
                            </span>

                            <span className="text-sm font-semibold text-green-600">
                                ₹{revenue.toFixed(2)}
                            </span>

                        </div>

                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                    width:
                                        revenue + expenses > 0
                                            ? `${(
                                                (revenue /
                                                    (revenue + expenses)) *
                                                100
                                            ).toFixed(1)}%`
                                            : "0%",
                                }}
                            />

                        </div>

                    </div>

                    {/* Expenses */}

                    <div>

                        <div className="flex justify-between mb-2">

                            <span className="text-sm text-slate-600">
                                Expenses
                            </span>

                            <span className="text-sm font-semibold text-red-600">
                                ₹{expenses.toFixed(2)}
                            </span>

                        </div>

                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                    width:
                                        revenue + expenses > 0
                                            ? `${(
                                                (expenses /
                                                    (revenue + expenses)) *
                                                100
                                            ).toFixed(1)}%`
                                            : "0%",
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================= */}
            {/* Performance */}
            {/* ================================= */}

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Farm Performance */}

                <div className="bg-white border rounded-xl p-6 shadow-sm">

                    <h2 className="font-semibold text-slate-800 mb-4">
                        Farm Performance
                    </h2>

                    <div className="space-y-4">

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Animals
                            </span>

                            <span className="font-semibold">
                                {summary.total_animals}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Milk Production
                            </span>

                            <span className="font-semibold">
                                {milk.toFixed(1)} L
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Inventory
                            </span>

                            <span className="font-semibold">
                                {summary.total_inventory_items}
                            </span>
                        </div>

                    </div>

                </div>

                {/* Financial Performance */}

                <div className="bg-white border rounded-xl p-6 shadow-sm">

                    <h2 className="font-semibold text-slate-800 mb-4">
                        Financial Performance
                    </h2>

                    <div className="space-y-4">

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Revenue
                            </span>

                            <span className="font-semibold text-green-600">
                                ₹{revenue.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Expenses
                            </span>

                            <span className="font-semibold text-red-600">
                                ₹{expenses.toFixed(2)}
                            </span>
                        </div>

                        <div className="border-t pt-4 flex justify-between">

                            <span className="font-medium text-slate-700">
                                Net Result
                            </span>

                            <span
                                className={`font-bold ${
                                    profit >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                ₹{profit.toFixed(2)}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================= */}
            {/* Analytics Charts */}
            {/* ================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                {/* ================================= */}
                {/* Milk Production Chart */}
                {/* ================================= */}

                <div className="bg-white border rounded-xl shadow-sm">

                    <div className="px-6 py-4 border-b">

                        <h2 className="font-semibold text-slate-800">
                            Milk Production
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Last 30 days
                        </p>

                    </div>

                    <div className="p-6 h-[350px]">

                        {trendsLoading ? (

                            <div className="h-full flex items-center justify-center text-slate-500">
                                Loading chart...
                            </div>

                        ) : formattedMilkData.length === 0 ? (

                            <div className="h-full flex items-center justify-center text-slate-500">
                                No milk production data available.
                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={formattedMilkData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 0,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="displayDate"
                                        tick={{
                                            fontSize: 12,
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 12,
                                        }}
                                        unit=" L"
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            `${value} L`,
                                            "Milk",
                                        ]}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="liters"
                                        name="Milk Production"
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        )}

                    </div>

                </div>

                {/* ================================= */}
                {/* Revenue vs Expenses */}
                {/* ================================= */}

                <div className="bg-white border rounded-xl shadow-sm">

                    <div className="px-6 py-4 border-b">

                        <h2 className="font-semibold text-slate-800">
                            Revenue vs Expenses
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Last 30 days
                        </p>

                    </div>

                    <div className="p-6 h-[350px]">

                        {trendsLoading ? (

                            <div className="h-full flex items-center justify-center text-slate-500">
                                Loading chart...
                            </div>

                        ) : formattedFinancialData.length === 0 ? (

                            <div className="h-full flex items-center justify-center text-slate-500">
                                No financial data available.
                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={formattedFinancialData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 0,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="displayDate"
                                        tick={{
                                            fontSize: 12,
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 12,
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹${Number(value).toFixed(2)}`
                                        }
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="revenue"
                                        name="Revenue"
                                        fill="#16a34a"
                                        radius={[
                                            4,
                                            4,
                                            0,
                                            0,
                                        ]}
                                    />

                                    <Bar
                                        dataKey="expenses"
                                        name="Expenses"
                                        fill="#dc2626"
                                        radius={[
                                            4,
                                            4,
                                            0,
                                            0,
                                        ]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;