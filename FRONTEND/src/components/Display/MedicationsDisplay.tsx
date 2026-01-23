import { api } from "../../api/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { MedicationFormData } from "../../schemas/healthSchema";


interface MedicationsDisplayProps {
    onAdd: () => void;
    onEdit: (medication: MedicationFormData) => void;
}

const MedicationsDisplay = ({ onAdd, onEdit }: MedicationsDisplayProps) => {
    const queryClient = useQueryClient();
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const fetchMedications = async (): Promise<MedicationFormData[]> => {
        const res = await api.get("/medications/");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["medications"],
        queryFn: fetchMedications,
    });

    async function deleteMedication(id: number) {
        const res = await api.delete(`/medications/${id}`);
        return res.data;
    }

    const deleteMutation = useMutation({
        mutationFn: deleteMedication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medications"] });
            setConfirmDelete(null);
        }
    });

    const handleDelete = (medication: MedicationFormData) => {
        if (!medication.id) return;

        if (confirmDelete === medication.id) {
            deleteMutation.mutate(medication.id);
        } else {
            setConfirmDelete(medication.id);
            setTimeout(() => setConfirmDelete(null), 3000);
        }
    };

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
            <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-6">Medications</h3>
                <div className="border border-gray-300 bg-gray-100 p-4 rounded">
                    <button
                        onClick={onAdd}
                        className="border bg-gray-50 border-gray-300 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto block text-sm"
                    >
                        Add Medication
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Medications</h3>
                <button
                    onClick={onAdd}
                    className="border bg-gray-100 border-gray-300 active:bg-gray-100 focus:outline-none p-2 rounded px-4"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((medication, index) => (
                    <div key={index} className="border border-gray-200 bg-gray-100 p-4 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-lg">{medication.medication_name}</h4>

                            <div className="flex gap-2">
                                <button
                                    className="border bg-gray-50 border-gray-300 active:bg-gray-100 focus:outline-none px-3 py-1 rounded text-sm"
                                    //onClick={() => onEdit(medication)}
                                    onClick={() => onEdit({
                                        ...medication,
                                        is_active: medication.is_active === "yes" ? "yes" : "no"
                                    })}
                                >
                                    Edit
                                </button>

                                <button
                                    className={`border bg-gray-50 border-gray-300 active:bg-gray-100 focus:outline-none px-3 py-1 rounded text-sm ${confirmDelete === medication.id
                                        ? 'text-red-600'
                                        : 'text-[#81c784]'
                                        }`}
                                    onClick={() => handleDelete(medication)}
                                    disabled={deleteMutation.isPending}
                                >
                                    {confirmDelete === medication.id
                                        ? "Are you sure?"
                                        : "X"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {medication.medication_purpose && (
                                <div>
                                    <p className="text-sm text-gray-600">Purpose</p>
                                    <p className="text-md">{medication.medication_purpose}</p>
                                </div>
                            )}

                            {medication.dosage && (
                                <div>
                                    <p className="text-sm text-gray-600">Dosage</p>
                                    <p className="text-md">{medication.dosage}</p>
                                </div>
                            )}

                            {medication.frequency && (
                                <div>
                                    <p className="text-sm text-gray-600">Frequency</p>
                                    <p className="text-md">{medication.frequency}</p>
                                </div>
                            )}

                            {medication.route && (
                                <div>
                                    <p className="text-sm text-gray-600">Route</p>
                                    <p className="text-md">{medication.route}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-md">{medication.is_active === "yes" ? "Yes" : "No"}</p>
                            </div>

                            {medication.notes && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="text-md">{medication.notes}</p>
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
