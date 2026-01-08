import { api } from "../../api/http";
import { useQuery } from "@tanstack/react-query";
import type { MedicationFormData } from "../../schemas/healthSchema";

interface MedicationsDisplayProps {
    onAdd: () => void;
    onEdit: (medication: MedicationFormData) => void;
}

const MedicationsDisplay = ({ onAdd, onEdit }: MedicationsDisplayProps) => {
    const fetchMedications = async (): Promise<MedicationFormData[]> => {
        const res = await api.get("/patients/medication");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["medication"],
        queryFn: fetchMedications,
    });

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="text-red-500 p-4">
                Error: {error instanceof Error ? error.message : "Failed to load medications"}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
                <button
                    onClick={onAdd}
                    className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto block"
                >
                    Add Medication
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Medications</h3>
                <button
                    onClick={onAdd}
                    className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded px-4"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((medication, index) => (
                    <div key={index} className="border border-gray-200 bg-gray-100 p-4 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-lg">{medication.medication_name}</h4>
                            <button
                                onClick={() => onEdit(medication)}
                                className="border border-gray-200 active:bg-gray-100 focus:outline-none px-3 py-1 rounded text-sm"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {medication.medication_purpose && (
                                <div>
                                    <p className="text-sm text-gray-600">Purpose</p>
                                    <p className="font-medium">{medication.medication_purpose}</p>
                                </div>
                            )}

                            {medication.dosage && (
                                <div>
                                    <p className="text-sm text-gray-600">Dosage</p>
                                    <p className="font-medium">{medication.dosage}</p>
                                </div>
                            )}

                            {medication.frequency && (
                                <div>
                                    <p className="text-sm text-gray-600">Frequency</p>
                                    <p className="font-medium">{medication.frequency}</p>
                                </div>
                            )}

                            {medication.route && (
                                <div>
                                    <p className="text-sm text-gray-600">Route</p>
                                    <p className="font-medium">{medication.route}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="font-medium">{medication.isActive ? "Yes" : "No"}</p>
                            </div>

                            {medication.notes && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="font-medium">{medication.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicationsDisplay;
