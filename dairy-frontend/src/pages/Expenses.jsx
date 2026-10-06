import { useEffect, useState } from "react";
import API from "../services/api";

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        title: "",
        category: "",
        amount: "",
        payment_method: "Cash",
        notes: "",
    });

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await API.get("/expenses");
            setExpenses(response.data);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to load expenses."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.title || !form.category || !form.amount) {
            setError("Title, category and amount are required.");
            return;
        }

        if (Number(form.amount) <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }

        try {
            await API.post("/expenses", {
                title: form.title,
                category: form.category,
                amount: Number(form.amount),
                payment_method: form.payment_method,
                notes: form.notes || null,
            });

            setSuccess("Expense added successfully.");

            setForm({
                title: "",
                category: "",
                amount: "",
                payment_method: "Cash",
                notes: "",
            });

            setShowModal(false);
            fetchExpenses();

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to add expense."
            );
        }
    };

    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    const cashExpenses = expenses
        .filter((expense) => expense.payment_method === "Cash")
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

    const upiExpenses = expenses
        .filter((expense) => expense.payment_method === "UPI")
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Expenses
                    </h1>
                    <p className="text-sm text-slate-500">
                        Track farm expenses and payments
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Add Expense
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="text-sm text-slate-500">
                        Total Expenses
                    </p>

                    <h2 className="text-2xl font-bold text-red-600 mt-1">
                        ₹{totalExpenses.toFixed(2)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="text-sm text-slate-500">
                        Cash Expenses
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-1">
                        ₹{cashExpenses.toFixed(2)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="text-sm text-slate-500">
                        UPI Expenses
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-1">
                        ₹{upiExpenses.toFixed(2)}
                    </h2>
                </div>

            </div>

            {/* Expense Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="px-5 py-4 border-b">
                    <h2 className="font-semibold text-slate-800">
                        Expense Records
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        Loading expenses...
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No expense records found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-5 py-3">
                                        Title
                                    </th>
                                    <th className="text-left px-5 py-3">
                                        Category
                                    </th>
                                    <th className="text-left px-5 py-3">
                                        Amount
                                    </th>
                                    <th className="text-left px-5 py-3">
                                        Payment
                                    </th>
                                    <th className="text-left px-5 py-3">
                                        Notes
                                    </th>
                                    <th className="text-left px-5 py-3">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {expenses.map((expense) => (
                                    <tr
                                        key={expense.id}
                                        className="border-t hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4 font-medium text-slate-800">
                                            {expense.title}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                                {expense.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-red-600">
                                            ₹{Number(expense.amount).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4">
                                            {expense.payment_method}
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {expense.notes || "-"}
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {new Date(
                                                expense.date
                                            ).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">
                                Add Expense
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-500 hover:text-slate-800 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-4"
                        >

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Expense Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Electricity Bill"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">
                                        Select Category
                                    </option>
                                    <option value="Medical">
                                        Medical
                                    </option>
                                    <option value="Labor">
                                        Labor
                                    </option>
                                    <option value="Utility">
                                        Utility
                                    </option>
                                    <option value="Feed Purchase">
                                        Feed Purchase
                                    </option>
                                    <option value="Maintenance">
                                        Maintenance
                                    </option>
                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    min="0"
                                    step="0.01"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Payment Method
                                </label>

                                <select
                                    name="payment_method"
                                    value={form.payment_method}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="Cash">
                                        Cash
                                    </option>
                                    <option value="UPI">
                                        UPI
                                    </option>
                                    <option value="Bank Transfer">
                                        Bank Transfer
                                    </option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Additional details..."
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
                                >
                                    Add Expense
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Expenses;