import { api } from "../../api/http";
import { useQuery } from "@tanstack/react-query";
import type { PersonalFormData } from "../../schemas/healthSchema";

interface PersonalInfoDisplayProps {
    onEdit: () => void;
}

const PersonalInfoDisplay = ({ onEdit }: PersonalInfoDisplayProps) => {

    const fetchPersonalInfo = async (): Promise<PersonalFormData> => {
        const res = await api.get("/patients/me");
        return res.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["me"],
        queryFn: fetchPersonalInfo,
    });

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="text-red-500 p-4">
                Error: {error instanceof Error ? error.message : "Failed to load personal information"}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
                <button
                    onClick={onEdit}
                    className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto block"
                >
                    Add Personal Info
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="max-[500px]:!text-[1.35rem] font-semibold">Personal Information</h3>
                <button
                    onClick={onEdit}
                    className="bg-[#81c784] hover:bg-[#2e7d32] border border-gray-300 active:bg-gray-100 focus:outline-none p-1 rounded px-2 text-xs min-[500px]:text-sm"
                >
                    Edit
                </button>
            </div>

            <div className="border border-gray-300 bg-gray-100 p-6 rounded">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">First Name</p>
                        <p className="text-base min-[500px]:text-lg font-medium wrap-break-word">{data.first_name}</p>
                    </div>

                    {data.middle_name && (
                        <div>
                            <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Middle Name</p>
                            <p className="text-base min-[500px]:text-lg wrap-break-word">{data.middle_name}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Last Name</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.last_name}</p>
                    </div>

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Address</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.address}</p>
                    </div>

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Phone Number</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.phone}</p>
                    </div>

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Date of Birth</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.date_of_birth}</p>
                    </div>

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Gender</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.gender}</p>
                    </div>

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Blood Type</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.blood_type}</p>
                    </div>

                    {data.preferred_hospital && (
                        <div>
                            <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Preferred Hospital</p>
                            <p className="text-base min-[500px]:text-lg wrap-break-word">{data.preferred_hospital}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Emergency Contact Name</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.emergency_contact_name}</p>
                    </div>

                    <div>
                        <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Emergency Contact Relationship</p>
                        <p className="text-base min-[500px]:text-lg wrap-break-word">{data.emergency_contact_relationship}</p>
                    </div>
                    {data.emergency_contact_phone && (
                        <div>
                            <p className="text-xs min-[500px]:text-sm text-gray-500 mb-1">Emergency Contact Phone</p>
                            <p className="text-base min-[500px]:text-lg">{data.emergency_contact_phone}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoDisplay;
