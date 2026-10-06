import { useEffect, useState } from "react";
import API from "../services/api";

export default function Sales() {
    const [sales, setSales] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        customer_name: "",
        quantity_liters: "",
        rate_per_liter: "",
        payment_status: "Pending",
    });

    // -----------------------------
    // Fetch sales
    // -----------------------------

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/sales");

            setSales(response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load sales records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // -----------------------------
    // Handle input
    // -----------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // -----------------------------
    // Submit sale
    // -----------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.customer_name.trim()) {
            setError("Customer name is required.");
            return;
        }

        if (
            !formData.quantity_liters ||
            Number(formData.quantity_liters) <= 0
        ) {
            setError("Enter a valid quantity.");
            return;
        }

        if (
            !formData.rate_per_liter ||
            Number(formData.rate_per_liter) <= 0
        ) {
            setError("Enter a valid rate per liter.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                customer_name: formData.customer_name.trim(),
                quantity_liters: Number(
                    formData.quantity_liters
                ),
                rate_per_liter: Number(
                    formData.rate_per_liter
                ),
                payment_status: formData.payment_status,
            };

            // total_amount intentionally NOT sent.
            // Backend calculates it.

            await API.post("/sales", payload);

            setSuccess("Milk sale added successfully.");

            setFormData({
                customer_name: "",
                quantity_liters: "",
                rate_per_liter: "",
                payment_status: "Pending",
            });

            setShowModal(false);

            await fetchSales();

        } catch (error) {
            console.error("Error creating sale:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to add sale."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // -----------------------------
    // Format date
    // -----------------------------

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // -----------------------------
    // Payment badge
    // -----------------------------

    const getPaymentStyle = (status) => {
        if (status === "Paid") {
            return "bg-green-100 text-green-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    // -----------------------------
    // Statistics
    // -----------------------------

    const totalRevenue = sales.reduce(
        (total, sale) =>
            total + Number(sale.total_amount || 0),
        0
    );

    const paidAmount = sales
        .filter((sale) => sale.payment_status === "Paid")
        .reduce(
            (total, sale) =>
                total + Number(sale.total_amount || 0),
            0
        );

    const pendingAmount = sales
        .filter((sale) => sale.payment_status !== "Paid")
        .reduce(
            (total, sale) =>
                total + Number(sale.total_amount || 0),
            0
        );

    return (
        <div>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Milk Sales
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage milk sales and customer payments.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setError("");
                        setSuccess("");
                        setShowModal(true);
                    }}
                    className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white shadow hover:bg-green-700"
                >
                    + Add Sale
                </button>

            </div>

            {/* Success */}
            {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    {success}
                </div>
            )}

            {/* Error */}
            {error && !showModal && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-medium text-slate-500">
                        Total Revenue
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-800">
                        ₹ {totalRevenue.toLocaleString("en-IN")}
                    </p>

                </div>

                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-medium text-slate-500">
                        Paid Amount
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                        ₹ {paidAmount.toLocaleString("en-IN")}
                    </p>

                </div>

                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-medium text-slate-500">
                        Pending Amount
                    </p>

                    <p className="mt-2 text-3xl font-bold text-yellow-600">
                        ₹ {pendingAmount.toLocaleString("en-IN")}
                    </p>

                </div>

            </div>

            {/* Sales Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow">

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading sales records...
                    </div>
                ) : sales.length === 0 ? (
                    <div className="p-10 text-center">

                        <p className="text-lg font-semibold text-slate-700">
                            No sales records
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first milk sale.
                        </p>

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Quantity
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Rate / Liter
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Total
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {sales.map((sale) => (
                                    <tr
                                        key={sale.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {sale.customer_name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {sale.quantity_liters} L
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            ₹ {sale.rate_per_liter}
                                        </td>

                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            ₹{" "}
                                            {Number(
                                                sale.total_amount
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                                                    sale.payment_status
                                                )}`}
                                            >
                                                {sale.payment_status}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(sale.date)}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Add Sale Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Add Milk Sale
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Record a milk sale to a customer.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="text-2xl text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >

                            {error && (
                                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">

                                {/* Customer */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Customer Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="customer_name"
                                        value={
                                            formData.customer_name
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. Local Dairy"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* Quantity */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Quantity (Liters) *
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity_liters"
                                        value={
                                            formData.quantity_liters
                                        }
                                        onChange={handleChange}
                                        min="0.1"
                                        step="0.1"
                                        placeholder="e.g. 10"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* Rate */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Rate per Liter (₹) *
                                    </label>

                                    <input
                                        type="number"
                                        name="rate_per_liter"
                                        value={
                                            formData.rate_per_liter
                                        }
                                        onChange={handleChange}
                                        min="0.1"
                                        step="0.01"
                                        placeholder="e.g. 39"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* Total Preview */}
                                {formData.quantity_liters &&
                                    formData.rate_per_liter && (
                                        <div className="rounded-lg bg-green-50 p-4">

                                            <p className="text-sm text-green-700">
                                                Estimated Total
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-green-800">
                                                ₹{" "}
                                                {(
                                                    Number(
                                                        formData.quantity_liters
                                                    ) *
                                                    Number(
                                                        formData.rate_per_liter
                                                    )
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-green-600">
                                                Final amount is calculated
                                                by the backend.
                                            </p>

                                        </div>
                                    )}

                                {/* Payment Status */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Payment Status
                                    </label>

                                    <select
                                        name="payment_status"
                                        value={
                                            formData.payment_status
                                        }
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Paid">
                                            Paid
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="mt-7 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Saving..."
                                        : "Add Sale"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}