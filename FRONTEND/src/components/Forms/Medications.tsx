import { api } from "../../api/http";
import {
  medicationSchema,
  type MedicationFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface MedicationsProps {
  onCancel: () => void;
}

const Medications = ({ onCancel }: MedicationsProps) => {
  const queryClient = useQueryClient();

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
      onCancel();
    },
  });

  const onSubmit = (data: MedicationFormData) => {
    createMutation(data);
  };

  return (
    <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-md shadow">
      <h3 className="text-center mb-6">Add Medication Information</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 bg-gray-100 p-6 rounded"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Medication Name</label>
            <input
              type="text"
              {...register("medication_name")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.medication_name && (
              <p className="text-red-500 mt-1">
                {errors.medication_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2">Medication Purpose</label>
            <input
              type="text"
              {...register("medication_purpose")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.medication_purpose && (
              <p className="text-red-500 mt-1">
                {errors.medication_purpose.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2">Dosage</label>
            <input
              type="number"
              min={0}
              {...register("dosage")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.dosage && (
              <p className="text-red-500 mt-1">{errors.dosage.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Frequency</label>
            <input
              type="number"
              min={0}
              {...register("frequency")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.frequency && (
              <p className="text-red-500 mt-1">{errors.frequency.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Route</label>
            <select
              {...register("route")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
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
          <div>
            <label className="block mb-2">Is Active</label>
            <select
              {...register("isActive")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Option</option>
              <option value="yes">Yes</option>
              <option value="no">Injection</option>
            </select>
            {errors.route && (
              <p className="text-red-500 mt-1">{errors.route.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            ></textarea>
            {errors.notes && (
              <p className="text-red-500 mt-1">{errors.notes.message}</p>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#81c784] border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {isSuccess && (
          <p className="text-[#4caf50] mt-2">Medication added successfully!</p>
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
