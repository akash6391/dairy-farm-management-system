import { useEffect, useState } from "react";
import API from "../services/api";

export default function Breeding() {
    const [logs, setLogs] = useState([]);
    const [animals, setAnimals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        animal_tag_id: "",
        insemination_date: new Date().toISOString().slice(0, 16),
        pregnancy_status: "Pending",
        notes: "",
    });

    // -----------------------------
    // Fetch breeding logs + animals
    // -----------------------------

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [breedingResponse, animalsResponse] =
                await Promise.all([
                    API.get("/breeding-logs"),
                    API.get("/animals"),
                ]);

            setLogs(breedingResponse.data);
            setAnimals(animalsResponse.data);

        } catch (error) {
            console.error("Error loading breeding data:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load breeding records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // -----------------------------
    // Input change
    // -----------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // -----------------------------
    // Calculate due date
    // -----------------------------

    const calculateDueDate = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);

        // Approx 9 months pregnancy period
        date.setMonth(date.getMonth() + 9);

        return date.toISOString();
    };

    // -----------------------------
    // Submit
    // -----------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.animal_tag_id) {
            setError("Please select an animal.");
            return;
        }

        if (!formData.insemination_date) {
            setError("Insemination date is required.");
            return;
        }

        try {
            setSubmitting(true);

            const expectedDueDate = calculateDueDate(
                formData.insemination_date
            );

            const payload = {
                animal_tag_id: formData.animal_tag_id,

                insemination_date:
                    new Date(
                        formData.insemination_date
                    ).toISOString(),

                expected_due_date: expectedDueDate,

                pregnancy_status: formData.pregnancy_status,

                notes: formData.notes.trim() || null,
            };

            await API.post("/breeding-logs", payload);

            setSuccess(
                "Breeding record added successfully."
            );

            setFormData({
                animal_tag_id: "",
                insemination_date: new Date()
                    .toISOString()
                    .slice(0, 16),
                pregnancy_status: "Pending",
                notes: "",
            });

            setShowModal(false);

            await fetchData();

        } catch (error) {
            console.error(
                "Error creating breeding record:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to add breeding record."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // -----------------------------
    // Date formatting
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
    // Status styling
    // -----------------------------

    const getStatusStyle = (status) => {
        switch (status) {
            case "Pregnant":
                return "bg-green-100 text-green-700";

            case "Delivered":
                return "bg-blue-100 text-blue-700";

            case "Failed":
                return "bg-red-100 text-red-700";

            case "Pending":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Breeding Management
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage breeding and pregnancy records.
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
                    + Add Breeding Record
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
                        Loading breeding records...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-10 text-center">

                        <p className="text-lg font-semibold text-slate-700">
                            No breeding records
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first breeding record.
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
                                        Insemination Date
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Expected Due Date
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Pregnancy Status
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Notes
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {log.animal_tag_id}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {formatDate(
                                                log.insemination_date
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {formatDate(
                                                log.expected_due_date
                                            )}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                    log.pregnancy_status
                                                )}`}
                                            >
                                                {log.pregnancy_status}
                                            </span>

                                        </td>

                                        <td className="max-w-xs px-6 py-4 text-slate-600">
                                            {log.notes || "-"}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Add Breeding Record
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Record animal insemination details.
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

                                {/* Animal */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Animal *
                                    </label>

                                    <select
                                        name="animal_tag_id"
                                        value={
                                            formData.animal_tag_id
                                        }
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="">
                                            Select animal
                                        </option>

                                        {animals.map(
                                            (animal) => (
                                                <option
                                                    key={
                                                        animal.id
                                                    }
                                                    value={
                                                        animal.tag_id
                                                    }
                                                >
                                                    {animal.tag_id}{" "}
                                                    -{" "}
                                                    {animal.name ||
                                                        "Unnamed"}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* Insemination date */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Insemination Date *
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="insemination_date"
                                        value={
                                            formData.insemination_date
                                        }
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* Expected due date preview */}
                                <div className="rounded-lg bg-slate-50 p-4">

                                    <p className="text-sm font-medium text-slate-600">
                                        Expected Due Date
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-800">
                                        {formData.insemination_date
                                            ? formatDate(
                                                calculateDueDate(
                                                    formData.insemination_date
                                                )
                                            )
                                            : "-"}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Automatically estimated at
                                        approximately 9 months.
                                    </p>

                                </div>

                                {/* Pregnancy status */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Pregnancy Status
                                    </label>

                                    <select
                                        name="pregnancy_status"
                                        value={
                                            formData.pregnancy_status
                                        }
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Pregnant">
                                            Pregnant
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Failed">
                                            Failed
                                        </option>

                                    </select>

                                </div>

                                {/* Notes */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Notes
                                    </label>

                                    <textarea
                                        name="notes"
                                        value={
                                            formData.notes
                                        }
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter notes..."
                                        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

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