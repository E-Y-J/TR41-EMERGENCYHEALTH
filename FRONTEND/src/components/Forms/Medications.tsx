import { api } from "../../api/http";
import {
  medicationSchema,
  type MedicationFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Medications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
  });

  const createMedication = async (payload: MedicationFormData) => {
    const res = await api.post("/patients/medication", payload);
    return res.data;
  };

  const {
    mutate: createMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication"] });
      reset();
      navigate("/");
    },
  });

  const onSubmit = (data: MedicationFormData) => {
    createMutation(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 mt-10 rounded-lg shadow">
      <h2 className="text-center mb-6">Add medication Information</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 solid-gray-300 p-6 rounded-lg"
      >
        <div className="mb-4">
          <label className="block mb-2">medication Name:</label>
          <input
            type="text"
            {...register("medication_name")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.medication_name && (
            <p className="text-red-500 mt-1">
              {errors.medication_name.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Medication Purpose</label>
          <input
            type="text"
            {...register("medication_purpose")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.medication_purpose && (
            <p className="text-red-500 mt-1">
              {errors.medication_purpose.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Dosage</label>
          <input
            type="number"
            min={0}
            {...register("dosage")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.dosage && (
            <p className="text-red-500 mt-1">{errors.dosage.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Frequency</label>
          <input
            type="number"
            min={0}
            {...register("frequency")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.frequency && (
            <p className="text-red-500 mt-1">{errors.frequency.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Route</label>
          <select
            {...register("route")}
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="">Select Route</option>
            <option value="Oral">Oral</option>
            <option value="Injection">Injection</option>
            <option value="Topical">Topical</option>
            <option value="Inhalation">Inhalation</option>
          </select>
          {errors.route && (
            <p className="text-red-500 mt-1">{errors.route.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Is Active</label>
          <select
            {...register("isActive")}
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="">Select Option</option>
            <option value="yes">Yes</option>
            <option value="no">Injection</option>
          </select>
          {errors.route && (
            <p className="text-red-500 mt-1">{errors.route.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full border p-2 rounded bg-white text-black"
          ></textarea>
          {errors.notes && (
            <p className="text-red-500 mt-1">{errors.notes.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className=" w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add Medication"}
        </button>
        {isSuccess && (
          <p className="text-green-500 mt-2">Medication added successfully!</p>
        )}
        {isError && (
          <p className="text-red-500 mt-2">
            {error.message || "failed to add medication"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Medications;
