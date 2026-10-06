import { useEffect, useState } from "react";
import API from "../services/api";

function Medical() {
    const [medicalLogs, setMedicalLogs] = useState([]);
    const [animals, setAnimals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        animal_tag_id: "",
        diagnosis: "",
        treatment_details: "",
        veterinarian_name: "",
        cost: "",
        next_vaccination_date: "",
    });

    // Fetch medical records + animals
    const fetchData = async () => {
        try {
            setLoading(true);

            const [medicalResponse, animalsResponse] = await Promise.all([
                API.get("/medical-logs"),
                API.get("/animals"),
            ]);

            setMedicalLogs(medicalResponse.data);
            setAnimals(animalsResponse.data);

            setError("");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to load medical records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Add medical record
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.animal_tag_id ||
            !form.diagnosis ||
            !form.treatment_details
        ) {
            setError(
                "Animal, diagnosis and treatment details are required."
            );
            return;
        }

        if (form.cost && Number(form.cost) < 0) {
            setError("Cost cannot be negative.");
            return;
        }

        try {
            const payload = {
                animal_tag_id: form.animal_tag_id,
                diagnosis: form.diagnosis,
                treatment_details: form.treatment_details,
                veterinarian_name: form.veterinarian_name || null,
                cost: form.cost ? Number(form.cost) : 0,
                next_vaccination_date:
                    form.next_vaccination_date || null,
            };

            await API.post("/medical-logs", payload);

            setSuccess("Medical record added successfully.");

            setForm({
                animal_tag_id: "",
                diagnosis: "",
                treatment_details: "",
                veterinarian_name: "",
                cost: "",
                next_vaccination_date: "",
            });

            setShowModal(false);

            fetchData();

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to add medical record."
            );
        }
    };

    // Summary
    const totalRecords = medicalLogs.length;

    const totalMedicalCost = medicalLogs.reduce(
        (sum, log) => sum + Number(log.cost || 0),
        0
    );

    const upcomingVaccinations = medicalLogs.filter((log) => {
        if (!log.next_vaccination_date) return false;

        return new Date(log.next_vaccination_date) >= new Date();
    }).length;

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Medical Records
                    </h1>

                    <p className="text-sm text-slate-500">
                        Track animal health, treatment and vaccination
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Add Medical Record
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
                        Medical Records
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-1">
                        {totalRecords}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="text-sm text-slate-500">
                        Total Medical Cost
                    </p>

                    <h2 className="text-2xl font-bold text-red-600 mt-1">
                        ₹{totalMedicalCost.toFixed(2)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="text-sm text-slate-500">
                        Upcoming Vaccinations
                    </p>

                    <h2 className="text-2xl font-bold text-green-600 mt-1">
                        {upcomingVaccinations}
                    </h2>
                </div>

            </div>

            {/* Medical Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="px-5 py-4 border-b">
                    <h2 className="font-semibold text-slate-800">
                        Medical History
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        Loading medical records...
                    </div>
                ) : medicalLogs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No medical records found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-5 py-3">
                                        Animal
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Diagnosis
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Treatment
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Veterinarian
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Cost
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Next Vaccination
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {medicalLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-t hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4 font-medium text-slate-800">
                                            {log.animal_tag_id}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                                {log.diagnosis}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 max-w-xs">
                                            <p className="text-slate-600 truncate">
                                                {log.treatment_details}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {log.veterinarian_name || "-"}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-red-600">
                                            ₹{Number(log.cost || 0).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {log.next_vaccination_date
                                                ? new Date(
                                                      log.next_vaccination_date
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : "-"}
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {new Date(
                                                log.date
                                            ).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>

            {/* Add Medical Record Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b">

                            <h2 className="text-lg font-semibold text-slate-800">
                                Add Medical Record
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-500 hover:text-slate-800 text-xl"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-4"
                        >

                            {/* Animal */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Animal
                                </label>

                                <select
                                    name="animal_tag_id"
                                    value={form.animal_tag_id}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">
                                        Select Animal
                                    </option>

                                    {animals.map((animal) => (
                                        <option
                                            key={animal.id}
                                            value={animal.tag_id}
                                        >
                                            {animal.tag_id}
                                            {animal.name
                                                ? ` - ${animal.name}`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Diagnosis
                                </label>

                                <input
                                    type="text"
                                    name="diagnosis"
                                    value={form.diagnosis}
                                    onChange={handleChange}
                                    placeholder="e.g. Fever, Mastitis, Injury"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Treatment */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Treatment Details
                                </label>

                                <textarea
                                    name="treatment_details"
                                    value={form.treatment_details}
                                    onChange={handleChange}
                                    placeholder="Enter medicines and treatment details"
                                    rows="4"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Vet + Cost */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Veterinarian Name
                                    </label>

                                    <input
                                        type="text"
                                        name="veterinarian_name"
                                        value={form.veterinarian_name}
                                        onChange={handleChange}
                                        placeholder="Dr. Name"
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Treatment Cost
                                    </label>

                                    <input
                                        type="number"
                                        name="cost"
                                        value={form.cost}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                            </div>

                            {/* Vaccination */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Next Vaccination Date
                                </label>

                                <input
                                    type="datetime-local"
                                    name="next_vaccination_date"
                                    value={form.next_vaccination_date}
                                    onChange={handleChange}
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
                                    Add Medical Record
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Medical;