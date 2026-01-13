import { api } from "../../api/http";
import { useQuery } from "@tanstack/react-query";
import type { ConditionFormData } from "../../schemas/healthSchema";

interface ConditionsDisplayProps {
    onAdd: () => void;
    onEdit: (condition: ConditionFormData) => void;
}

const ConditionsDisplay = ({ onAdd, onEdit }: ConditionsDisplayProps) => {
    const fetchConditions = async (): Promise<ConditionFormData[]> => {
        const res = await api.get("/patients/conditions");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["condition"],
        queryFn: fetchConditions,
    });

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
            <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
                <button
                    onClick={onAdd}
                    className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto block"
                >
                    Add Condition
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Medical Conditions</h3>
                <button
                    onClick={onAdd}
                    className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded px-4"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((condition, index) => (
                    <div key={index} className="border border-gray-200 bg-gray-100 p-4 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-lg">{condition.condition_name}</h4>
                            <button
                                onClick={() => onEdit(condition)}
                                className="border border-gray-200 active:bg-gray-100 focus:outline-none px-3 py-1 rounded text-sm"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm text-gray-600">Chronic</p>
                                <p className="font-medium">{condition.isChronic ? "Yes" : "No"}</p>
                            </div>

                            {condition.notes && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="font-medium">{condition.notes}</p>
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
