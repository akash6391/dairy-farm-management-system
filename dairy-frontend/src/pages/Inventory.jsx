import { useEffect, useState } from "react";
import API from "../services/api";

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        item_name: "",
        category: "feed",
        quantity: "",
        unit: "kg",
        unit_price: "",
    });

    // -------------------------
    // Fetch inventory
    // -------------------------

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/inventory");

            setItems(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load inventory."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // -------------------------
    // Handle input
    // -------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // -------------------------
    // Add inventory
    // -------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.item_name.trim()) {
            setError("Item name is required.");
            return;
        }

        if (
            formData.quantity === "" ||
            Number(formData.quantity) <= 0
        ) {
            setError("Quantity must be greater than 0.");
            return;
        }

        if (
            formData.unit_price === "" ||
            Number(formData.unit_price) < 0
        ) {
            setError("Enter a valid unit price.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                item_name: formData.item_name.trim(),
                category: formData.category,
                quantity: Number(formData.quantity),
                unit: formData.unit,
                unit_price: Number(formData.unit_price),
            };

            await API.post("/inventory", payload);

            setSuccess("Inventory item added successfully.");

            setFormData({
                item_name: "",
                category: "feed",
                quantity: "",
                unit: "kg",
                unit_price: "",
            });

            setShowModal(false);

            await fetchInventory();

        } catch (error) {
            console.error(
                "Error adding inventory:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to add inventory item."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // -------------------------
    // Format date
    // -------------------------

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

    // -------------------------
    // Category badge
    // -------------------------

    const getCategoryStyle = (category) => {
        switch (category?.toLowerCase()) {
            case "feed":
                return "bg-green-100 text-green-700";

            case "medicine":
                return "bg-blue-100 text-blue-700";

            case "equipment":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    // -------------------------
    // Statistics
    // -------------------------

    const totalItems = items.length;

    const totalStockValue = items.reduce(
        (total, item) =>
            total +
            Number(item.quantity || 0) *
            Number(item.unit_price || 0),
        0
    );

    return (
        <div>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Inventory
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage farm feed, medicines and other inventory.
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
                    + Add Item
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

            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-medium text-slate-500">
                        Total Inventory Items
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-800">
                        {totalItems}
                    </p>

                </div>

                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-medium text-slate-500">
                        Total Stock Value
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-800">
                        ₹ {totalStockValue.toLocaleString("en-IN")}
                    </p>

                </div>

            </div>

            {/* Inventory table */}
            <div className="overflow-hidden rounded-xl bg-white shadow">

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading inventory...
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-10 text-center">

                        <p className="text-lg font-semibold text-slate-700">
                            No inventory items
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first inventory item.
                        </p>

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Item
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Quantity
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Unit
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Unit Price
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Stock Value
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Last Updated
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {items.map((item) => {

                                    const stockValue =
                                        Number(item.quantity || 0) *
                                        Number(item.unit_price || 0);

                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                {item.item_name}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(
                                                        item.category
                                                    )}`}
                                                >
                                                    {item.category}
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {item.quantity}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {item.unit}
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                ₹ {item.unit_price}
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                ₹{" "}
                                                {stockValue.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(
                                                    item.last_updated
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Add Item Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">

                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Add Inventory Item
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add feed, medicine or other stock.
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

                                {/* Item name */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Item Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="item_name"
                                        value={formData.item_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Bhoosa"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* Category */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category *
                                    </label>

                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="feed">
                                            Feed
                                        </option>

                                        <option value="medicine">
                                            Medicine
                                        </option>

                                        <option value="equipment">
                                            Equipment
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                {/* Quantity + unit */}
                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Quantity *
                                        </label>

                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            placeholder="50"
                                            required
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Unit *
                                        </label>

                                        <select
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        >

                                            <option value="kg">
                                                kg
                                            </option>

                                            <option value="liter">
                                                Liter
                                            </option>

                                            <option value="piece">
                                                Piece
                                            </option>

                                            <option value="bag">
                                                Bag
                                            </option>

                                            <option value="unit">
                                                Unit
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                {/* Unit price */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Unit Price (₹) *
                                    </label>

                                    <input
                                        type="number"
                                        name="unit_price"
                                        value={formData.unit_price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="8"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* Preview */}
                                {formData.quantity &&
                                    formData.unit_price && (
                                        <div className="rounded-lg bg-slate-50 p-4">

                                            <p className="text-sm text-slate-500">
                                                Estimated Stock Value
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-slate-800">
                                                ₹{" "}
                                                {(
                                                    Number(
                                                        formData.quantity
                                                    ) *
                                                    Number(
                                                        formData.unit_price
                                                    )
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </div>
                                    )}

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
                                        : "Add Item"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}