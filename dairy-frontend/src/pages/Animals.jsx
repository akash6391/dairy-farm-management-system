import { useEffect, useState } from "react";
import API from "../services/api";

export default function Animals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        tag_id: "",
        name: "",
        breed: "",
        age: "",
        gender: "Female",
        health_status: "Healthy",
        vaccination_date: "",
        status: "Milking",
    });

    // Fetch animals
    const fetchAnimals = async () => {
        try {
            setLoading(true);

            const response = await API.get("/animals");

            setAnimals(response.data);
        } catch (error) {
            console.error("Error fetching animals:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load animals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    // Input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Basic frontend validation
        if (!formData.tag_id.trim()) {
            setError("Tag ID is required.");
            return;
        }

        if (!formData.breed.trim()) {
            setError("Breed is required.");
            return;
        }

        if (!formData.age || Number(formData.age) < 0) {
            setError("Please enter a valid age.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                tag_id: formData.tag_id.trim(),
                name: formData.name.trim() || null,
                breed: formData.breed.trim(),
                age: Number(formData.age),
                gender: formData.gender,
                health_status: formData.health_status,
                vaccination_date: formData.vaccination_date
                    ? `${formData.vaccination_date}T00:00:00`
                    : null,
                status: formData.status,
            };

            await API.post("/animals", payload);

            setSuccess("Animal added successfully.");

            // Reset form
            setFormData({
                tag_id: "",
                name: "",
                breed: "",
                age: "",
                gender: "Female",
                health_status: "Healthy",
                vaccination_date: "",
                status: "Milking",
            });

            // Close modal
            setShowModal(false);

            // Reload animals
            await fetchAnimals();

        } catch (error) {
            console.error("Error creating animal:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to add animal."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Milking":
                return "bg-green-100 text-green-700";

            case "Pregnant":
                return "bg-blue-100 text-blue-700";

            case "Dry":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Animals
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage your dairy farm animals.
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
                    + Add Animal
                </button>

            </div>

            {/* Success message */}
            {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    {success}
                </div>
            )}

            {/* Error message */}
            {error && !showModal && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {/* Animals table */}
            <div className="overflow-hidden rounded-xl bg-white shadow">

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading animals...
                    </div>
                ) : animals.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="text-lg font-semibold text-slate-700">
                            No animals found
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first animal to get started.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Tag ID
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Breed
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Age
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Gender
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Health
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Vaccination
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {animals.map((animal) => (
                                    <tr
                                        key={animal.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {animal.tag_id}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {animal.name || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {animal.breed}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {animal.age} years
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {animal.gender}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                {animal.health_status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {formatDate(
                                                animal.vaccination_date
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                    animal.status
                                                )}`}
                                            >
                                                {animal.status}
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Add Animal Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">

                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Add New Animal
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter animal information.
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

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                {/* Tag ID */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Tag ID *
                                    </label>

                                    <input
                                        type="text"
                                        name="tag_id"
                                        value={formData.tag_id}
                                        onChange={handleChange}
                                        placeholder="e.g. A002"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Ganga"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Breed */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Breed *
                                    </label>

                                    <input
                                        type="text"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        placeholder="e.g. HF Cross"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Age *
                                    </label>

                                    <input
                                        type="number"
                                        name="age"
                                        min="0"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 3"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="Female">
                                            Female
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>
                                    </select>
                                </div>

                                {/* Health */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Health Status
                                    </label>

                                    <select
                                        name="health_status"
                                        value={formData.health_status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="Healthy">
                                            Healthy
                                        </option>

                                        <option value="Sick">
                                            Sick
                                        </option>

                                        <option value="Under Treatment">
                                            Under Treatment
                                        </option>
                                    </select>
                                </div>

                                {/* Vaccination */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Vaccination Date
                                    </label>

                                    <input
                                        type="date"
                                        name="vaccination_date"
                                        value={formData.vaccination_date}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="Milking">
                                            Milking
                                        </option>

                                        <option value="Pregnant">
                                            Pregnant
                                        </option>

                                        <option value="Dry">
                                            Dry
                                        </option>
                                    </select>
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
                                        ? "Adding..."
                                        : "Add Animal"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}