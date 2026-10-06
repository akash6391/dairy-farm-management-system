import { useEffect, useState } from "react";
import API from "../services/api";

export default function MilkProduction() {
    const [milkLogs, setMilkLogs] = useState([]);
    const [animals, setAnimals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        animal_tag_id: "",
        date: new Date().toISOString().slice(0, 16),
        shift: "morning",
        quantity_liters: "",
        fat_percentage: "",
        snf_percentage: "",
    });

    // ----------------------------------
    // Fetch milk logs + animals
    // ----------------------------------

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [milkResponse, animalResponse] = await Promise.all([
                API.get("/milk-logs"),
                API.get("/animals"),
            ]);

            setMilkLogs(milkResponse.data);
            setAnimals(animalResponse.data);

        } catch (error) {
            console.error("Error loading milk data:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load milk production data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ----------------------------------
    // Handle input
    // ----------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ----------------------------------
    // Submit milk record
    // ----------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.animal_tag_id) {
            setError("Please select an animal.");
            return;
        }

        if (!formData.quantity_liters || Number(formData.quantity_liters) <= 0) {
            setError("Please enter a valid milk quantity.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                animal_tag_id: formData.animal_tag_id,
                date: formData.date,
                shift: formData.shift,
                quantity_liters: Number(formData.quantity_liters),
                fat_percentage: formData.fat_percentage
                    ? Number(formData.fat_percentage)
                    : null,
                snf_percentage: formData.snf_percentage
                    ? Number(formData.snf_percentage)
                    : null,
            };

            await API.post("/milk-logs", payload);

            setSuccess("Milk production record added successfully.");

            setFormData({
                animal_tag_id: "",
                date: new Date().toISOString().slice(0, 16),
                shift: "morning",
                quantity_liters: "",
                fat_percentage: "",
                snf_percentage: "",
            });

            setShowModal(false);

            await fetchData();

        } catch (error) {
            console.error("Error creating milk log:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to add milk production record."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ----------------------------------
    // Format date
    // ----------------------------------

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ----------------------------------
    // Shift badge
    // ----------------------------------

    const getShiftStyle = (shift) => {
        if (shift === "morning") {
            return "bg-yellow-100 text-yellow-700";
        }

        if (shift === "evening") {
            return "bg-indigo-100 text-indigo-700";
        }

        return "bg-slate-100 text-slate-700";
    };

    return (
        <div>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Milk Production
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Track daily milk production from your animals.
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
                    + Add Milk Record
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

            {/* Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow">

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading milk production records...
                    </div>
                ) : milkLogs.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="text-lg font-semibold text-slate-700">
                            No milk production records
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first milk production record.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b bg-slate-50">
                                <tr>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Animal
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Shift
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Quantity
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Fat %
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        SNF %
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {milkLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {log.animal_tag_id}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {formatDate(log.date)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getShiftStyle(
                                                    log.shift
                                                )}`}
                                            >
                                                {log.shift}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {log.quantity_liters} L
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {log.fat_percentage ?? "-"}%
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {log.snf_percentage ?? "-"}%
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Add Milk Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Add Milk Production
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Record milk produced by an animal.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
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

                                {/* Animal */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Animal *
                                    </label>

                                    <select
                                        name="animal_tag_id"
                                        value={formData.animal_tag_id}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="">
                                            Select animal
                                        </option>

                                        {animals.map((animal) => (
                                            <option
                                                key={animal.id}
                                                value={animal.tag_id}
                                            >
                                                {animal.tag_id} -{" "}
                                                {animal.name || "Unnamed"} (
                                                {animal.breed})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Date & Time *
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Shift */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Shift *
                                    </label>

                                    <select
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="morning">
                                            Morning
                                        </option>

                                        <option value="evening">
                                            Evening
                                        </option>
                                    </select>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Quantity (Liters) *
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity_liters"
                                        value={formData.quantity_liters}
                                        onChange={handleChange}
                                        min="0.1"
                                        step="0.1"
                                        placeholder="e.g. 7"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Fat */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Fat Percentage
                                    </label>

                                    <input
                                        type="number"
                                        name="fat_percentage"
                                        value={formData.fat_percentage}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        placeholder="e.g. 3.8"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* SNF */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        SNF Percentage
                                    </label>

                                    <input
                                        type="number"
                                        name="snf_percentage"
                                        value={formData.snf_percentage}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        placeholder="e.g. 7.8"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="mt-7 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                        : "Add Record"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}