import { api } from "../../api/http";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import type { AllergyFormData } from "../../schemas/healthSchema";

interface AllergiesDisplayProps {
    onAdd: () => void;
    onEdit: (allergy: AllergyFormData) => void;
}

const AllergiesDisplay = ({ onAdd, onEdit }: AllergiesDisplayProps) => {
    const queryClient = useQueryClient();
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const fetchAllergies = async (): Promise<AllergyFormData[]> => {
        const res = await api.get("/allergies/");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["allergies"],
        queryFn: fetchAllergies,
    });

    async function deleteAllergy(id: number) {
        const res = await api.delete(`/allergies/${id}`);
        return res.data;
    }

    const deleteMutation = useMutation({
        mutationFn: deleteAllergy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allergies"] });
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
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    };

    if (isError) {
        return (
            <div className="text-red-500 p-4">
                Error: {error instanceof Error ? error.message : "Failed to load allergies"}
            </div>
        );
    };

    if (!data || data.length === 0) {
        return (
            <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-6">Allergies</h3>
                <div className="border border-gray-300 bg-gray-100 p-4 rounded">
                    <button
                        onClick={onAdd}
                        className="border bg-gray-50 border-gray-300 active:bg-gray-50 hover:bg-gray-300 focus:outline-none p-2 rounded w-1/3 mx-auto block text-sm"
                    >
                        Add Allergy
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Allergies</h3>
                <button
                    onClick={onAdd}
                    className="border bg-[#81c784] hover:bg-[#2e7d32] border-gray-300 active:bg-gray-100 focus:outline-none p-2 rounded px-4"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((allergy, index) => (
                    <div key={index} className="border border-gray-300 bg-gray-100 p-6 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold wrap-anywhere">{allergy.allergen}</h4>

                            <div className="flex gap-2">
                                {confirmDelete === allergy.id ? null : (
                                    <button
                                        className="border bg-gray-50 border-gray-300 active:bg-gray-50 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-sm"
                                        onClick={() => onEdit(allergy)}
                                    >
                                        Edit
                                    </button>
                                )}

                                {confirmDelete === allergy.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            className='border bg-gray-50 border-gray-300 active:bg-gray-100 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-sm text-red-600'
                                            onClick={() => allergy.id && handleConfirmDelete(allergy.id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="border bg-gray-50 border-gray-300 active:bg-gray-100 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-sm"
                                            onClick={handleCancelDelete}
                                            disabled={deleteMutation.isPending}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="border bg-gray-50 border-gray-300 active:bg-gray-50 hover:bg-gray-300 focus:outline-none p-1 px-3 rounded text-sm text-red-800"
                                        onClick={() => allergy.id && handleDelete(allergy.id)}
                                    >
                                        <img src="/trashcan.png" alt="Delete" className="w-4.5 h-4.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {allergy.allergy_type && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Type</p>
                                    <p className="text-lg wrap-break-word mb-1">{allergy.allergy_type}</p>
                                </div>
                            )}

                            {allergy.reaction && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Reaction</p>
                                    <p className="text-lg wrap-break-word mb-1">{allergy.reaction}</p>
                                </div>
                            )}

                            {allergy.severity && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Severity</p>
                                    <p className="text-lg wrap-break-word mb-1">{allergy.severity}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default AllergiesDisplay;
