import { api } from "../../api/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ConditionFormData } from "../../schemas/healthSchema";

interface ConditionsDisplayProps {
    onAdd: () => void;
    onEdit: (condition: ConditionFormData) => void;
}

const ConditionsDisplay = ({ onAdd, onEdit }: ConditionsDisplayProps) => {
    const queryClient = useQueryClient();
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const fetchConditions = async (): Promise<ConditionFormData[]> => {
        const res = await api.get("/conditions/");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["conditions"],
        queryFn: fetchConditions,
    });

    async function deleteCondition(id: number) {
        const res = await api.delete(`/conditions/${id}`);
        return res.data;
    }

    const deleteMutation = useMutation({
        mutationFn: deleteCondition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conditions"] });
            setConfirmDelete(null);
        }
    });

    const handleDelete = (condition: ConditionFormData) => {
        if (!condition.id) return;

        if (confirmDelete === condition.id) {
            deleteMutation.mutate(condition.id);
        } else {
            setConfirmDelete(condition.id);
            setTimeout(() => setConfirmDelete(null), 3000);
        }
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="text-red-500 p-4">
                Error: {error instanceof Error ? error.message : "Failed to load conditions"}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-6">Medical Conditions</h3>
                <div className="border border-gray-300 bg-gray-100 p-4 rounded">
                    <button
                        onClick={onAdd}
                        className="border bg-gray-50 border-gray-300 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto block text-sm"
                    >
                        Add Condition
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Medical Conditions</h3>
                <button
                    onClick={onAdd}
                    className="border bg-gray-100 border-gray-300 active:bg-gray-100 focus:outline-none p-2 rounded px-4"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((condition, index) => (
                    <div key={index} className="border border-gray-300 bg-gray-100 p-6 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold wrap-anywhere">{condition.condition_name}</h4>

                            <div className="flex gap-2">
                                <button
                                    className="border bg-gray-50 border-gray-300 active:bg-gray-100 focus:outline-none p-1 px-3 rounded text-sm"
                                    onClick={() => onEdit({
                                        ...condition,
                                        is_chronic: condition.is_chronic === "yes" ? "yes" : "no"
                                    })}
                                >
                                    Edit
                                </button>

                                <button
                                    className={`border bg-gray-50 border-gray-300 active:bg-gray-100 focus:outline-none p-1 px-3 rounded text-sm ${confirmDelete === condition.id
                                        ? 'text-red-600'
                                        : 'text-[#81c784]'
                                        }`}
                                    onClick={() => handleDelete(condition)}
                                    disabled={deleteMutation.isPending}
                                >
                                    {confirmDelete === condition.id
                                        ? "Are you sure?"
                                        : "X"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Chronic</p>
                                <p className="text-lg wrap-break-word mb-1">{condition.is_chronic === "yes" ? "Yes" : "No"}</p>
                            </div>

                            {condition.notes && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                                    <p className="text-lg wrap-break-word mb-1">{condition.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConditionsDisplay;
