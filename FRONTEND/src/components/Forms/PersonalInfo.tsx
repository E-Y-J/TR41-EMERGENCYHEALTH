import { api } from "../../api/http";
import {
  personalSchema,
  type PersonalFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PersonalInfo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
  });

  const createPersonalInfo = async (payload: PersonalFormData) => {
    const res = await api.post("/patients/me", payload);
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
      navigate("/");
    },
  });

  const onSubmit = (data: PersonalFormData) => {
    createMutation(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 mt-10 rounded-lg shadow">
      <h2 className="text-center mb-6">Add Personal Information</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 solid-gray-300 p-6 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-2">First Name:</label>
            <input
              type="text"
              {...register("first_name")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.first_name && (
              <p className="text-red-500 mt-1">{errors.first_name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Middle Name:</label>
            <input
              type="text"
              {...register("middle_name")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.middle_name && (
              <p className="text-red-500 mt-1">{errors.middle_name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Last Name:</label>
            <input
              type="text"
              {...register("last_name")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.last_name && (
              <p className="text-red-500 mt-1">{errors.last_name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Address</label>
            <input
              type="text"
              {...register("address")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.address && (
              <p className="text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Phone Number:</label>
            <input
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              {...register("phone_number")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.phone_number && (
              <p className="text-red-500 mt-1">{errors.phone_number.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Date of Birth:</label>
            <input
              type="date"
              pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
              {...register("date_of_birth")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.date_of_birth && (
              <p className="text-red-500 mt-1">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Gender:</label>
            <select
              {...register("gender")}
              className="w-full border p-2 rounded bg-white text-black"
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
          <div className="mb-4">
            <label className="block mb-2">Blood type</label>
            <select
              {...register("blood_type")}
              className="w-full border p-2 rounded bg-white text-black"
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
          <div className="mb-4">
            <label className="block mb-2">Preferred Hospital</label>
            <input
              type="text"
              {...register("preferred_hospital")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.preferred_hospital && (
              <p className="text-red-500 mt-1">
                {errors.preferred_hospital.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Emergency Contact Name:</label>
            <input
              type="text"
              {...register("emergency_contact_name")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.emergency_contact_name && (
              <p className="text-red-500 mt-1">
                {errors.emergency_contact_name.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Emergency Contact Relationship:
            </label>
            <input
              type="text"
              {...register("emergency_contact_relationship")}
              className="w-full border p-2 rounded bg-white text-black"
            />
            {errors.emergency_contact_relationship && (
              <p className="text-red-500 mt-1">
                {errors.emergency_contact_relationship.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className=" w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add Personal Info"}
        </button>
        {isSuccess && (
          <p className="text-green-500 mt-2">
            personal info added successfully!
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
