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

    const handleDelete = (id: number) => {
        setConfirmDelete(id);
        setTimeout(() => setConfirmDelete(null), 5000);
    };

    const handleConfirmDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(null);
    }

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
                <h3 className="max-[500px]:!text-[1.35rem] font-semibold mb-6">Medications</h3>
                <button
                    onClick={onAdd}
                    className="border bg-[#81c784] hover:bg-[#2e7d32] border-gray-300 active:bg-gray-100 focus:outline-none p-1 rounded px-2"
                >
                    Add Medication
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="max-[500px]:!text-[1.35rem] font-semibold">Medications</h3>
                <button
                    onClick={onAdd}
                    className="border bg-[#81c784] hover:bg-[#2e7d32] border-gray-300 active:bg-gray-100 focus:outline-none p-1 rounded px-2 text-xs min-[500px]:text-sm"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((medication, index) => (
                    <div key={index} className="border border-gray-300 bg-gray-100 p-6 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="max-[500px]:!text-[1.15rem] font-semibold wrap-anywhere">{medication.medication_name}</h4>

                            <div className="flex ms-3 gap-2">
                                {confirmDelete === medication.id ? null : (
                                    <button
                                        className="border bg-gray-50 border-gray-300 hover:bg-gray-300 active:bg-gray-100 focus:outline-none px-3 py-1 rounded text-xs min-[500px]:text-sm"
                                        onClick={() => onEdit({
                                            ...medication,
                                            is_active: medication.is_active === "yes" ? "yes" : "no"
                                        })}
                                    >
                                        Edit
                                    </button>
                                )}

                                {confirmDelete === medication.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            className='border bg-gray-50 border-gray-300 active:bg-gray-100 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-xs min-[500px]:text-sm text-red-600'
                                            onClick={() => medication.id && handleConfirmDelete(medication.id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="border bg-gray-50 border-gray-300 active:bg-gray-100 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-xs min-[500px]:text-sm"
                                            onClick={handleCancelDelete}
                                            disabled={deleteMutation.isPending}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="border bg-gray-50 border-gray-300 active:bg-gray-50 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-sm text-red-800 shrink-0"
                                        onClick={() => medication.id && handleDelete(medication.id)}
                                    >
                                        <img src="/trashcan.png" alt="Delete" className="w-4.5 h-4.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {medication.medication_purpose && (
                                <div>
                                    <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Purpose</p>
                                    <p className="text-base min-[500px]:text-lg wrap-break-word mb-1">{medication.medication_purpose}</p>
                                </div>
                            )}

                            {medication.dosage && (
                                <div>
                                    <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Dosage</p>
                                    <p className="text-base min-[500px]:text-lg wrap-break-word mb-1">{medication.dosage}</p>
                                </div>
                            )}

                            {medication.frequency && (
                                <div>
                                    <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Frequency</p>
                                    <p className="text-base min-[500px]:text-lg wrap-break-word mb-1">{medication.frequency}</p>
                                </div>
                            )}

                            {medication.route && (
                                <div>
                                    <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Route</p>
                                    <p className="text-base min-[500px]:text-lg wrap-break-word mb-1">{medication.route}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Active</p>
                                <p className="text-base min-[500px]:text-lg wrap-break-word mb-1">{medication.is_active === "yes" ? "Yes" : "No"}</p>
                            </div>

                            {medication.notes && (
                                <div className="md:col-span-2">
                                    <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Notes</p>
                                    <p className="text-base min-[500px]:text-lg wrap-break-word mb-1">{medication.notes}</p>
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
