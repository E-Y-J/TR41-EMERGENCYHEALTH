import { api } from "../../api/http";
import { useQuery } from "@tanstack/react-query";
import type { AllergyFormData } from "../../schemas/healthSchema";

interface AllergiesDisplayProps {
    onAdd: () => void;
    onEdit: (allergy: AllergyFormData) => void;
}

const AllergiesDisplay = ({ onAdd, onEdit }: AllergiesDisplayProps) => {

    const fetchAllergies = async (): Promise<AllergyFormData[]> => {
        const res = await api.get("/patients/allergies");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["allergies"],
        queryFn: fetchAllergies,
    });

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="text-red-500 p-4">
                Error: {error instanceof Error ? error.message : "Failed to load allergies"}
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
                    Add Allergy
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Allergies</h3>
                <button
                    onClick={onAdd}
                    className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded px-4"
                >
                    Add New
                </button>
            </div>

            <div className="space-y-4">
                {data.map((allergy, index) => (
                    <div key={index} className="border border-gray-200 bg-gray-100 p-4 rounded">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold">{allergy.allergen}</h4>
                            <button
                                onClick={() => onEdit(allergy)}
                                className="border border-gray-200 active:bg-gray-100 focus:outline-none p-1 px-3 rounded text-sm"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {allergy.allergy_type && (
                                <div>
                                    <p className="text-sm text-gray-600">Type</p>
                                    <p className="font-medium">{allergy.allergy_type}</p>
                                </div>
                            )}

                            {allergy.reaction && (
                                <div>
                                    <p className="text-sm text-gray-600">Reaction</p>
                                    <p className="font-medium">{allergy.reaction}</p>
                                </div>
                            )}

                            {allergy.severity && (
                                <div>
                                    <p className="text-sm text-gray-600">Severity</p>
                                    <p className="font-medium">{allergy.severity}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllergiesDisplay;
