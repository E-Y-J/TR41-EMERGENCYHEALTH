import { api } from "../../api/http";
import {
  personalSchema,
  type PersonalFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hook/useAuth";
import { useEffect } from "react";

interface PersonalInfoProps {
  onCancel: () => void;
}

const PersonalInfo = ({ onCancel }: PersonalInfoProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchPersonalInfo = async (): Promise<PersonalFormData> => {
    const res = await api.get("/patients/me");
    return res.data;
  };

  const { data: existingData } = useQuery({
    queryKey: ["me"],
    queryFn: fetchPersonalInfo,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  useEffect(() => {
    if (existingData) {
      reset(existingData);
    }
  }, [existingData, reset]);

  const createPersonalInfo = async (payload: PersonalFormData) => {
    if (!user?.id) {
      throw new Error("User not logged in");
    }
    const res = await api.put(`/patients/${user.id}`, payload);
    return res.data;
  };

  const {
    mutate: createMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createPersonalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      reset();
      onCancel();
    },
  });

  const onSubmit = (data: PersonalFormData) => {
    createMutation(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-md shadow">
      <h3 className="text-center mb-6">Add Personal Information</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 bg-gray-100 p-6 rounded"
      >

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              {...register("first_name")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.first_name && (
              <p className="text-red-500 mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Middle Name</label>
            <input
              type="text"
              {...register("middle_name")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.middle_name && (
              <p className="text-red-500 mt-1">{errors.middle_name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              {...register("last_name")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.last_name && (
              <p className="text-red-500 mt-1">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              {...register("address")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.address && (
              <p className="text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              {...register("phone")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.phone && (
              <p className="text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
              {...register("date_of_birth")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.date_of_birth && (
              <p className="text-red-500 mt-1">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Gender</label>
            <select
              {...register("gender")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 mt-1">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Blood type</label>
            <select
              {...register("blood_type")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.blood_type && (
              <p className="text-red-500 mt-1">{errors.blood_type.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Preferred Hospital</label>
            <input
              type="text"
              {...register("preferred_hospital")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.preferred_hospital && (
              <p className="text-red-500 mt-1">
                {errors.preferred_hospital.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Emergency Contact Name</label>
            <input
              type="text"
              {...register("emergency_contact_name")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.emergency_contact_name && (
              <p className="text-red-500 mt-1">
                {errors.emergency_contact_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">
              Emergency Contact Relationship
            </label>
            <input
              type="text"
              {...register("emergency_contact_relationship")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.emergency_contact_relationship && (
              <p className="text-red-500 mt-1">
                {errors.emergency_contact_relationship.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              {...register("emergency_contact_phone")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.emergency_contact_phone && (
              <p className="text-red-500 mt-1">
                {errors.emergency_contact_phone.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#81c784] hover:bg-[#2e7d32] border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {isSuccess && (
          <p className="text-[#4caf50] mt-2">
            Personal Info added successfully!
          </p>
        )}
        {isError && (
          <p className="text-red-500 mt-2">
            {error.message || "failed to add personal info"}
          </p>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo;
