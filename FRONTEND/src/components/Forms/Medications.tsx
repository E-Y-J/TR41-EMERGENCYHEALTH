import { api } from "../../api/http";
import {
  medicationSchema,
  type MedicationFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface MedicationsProps {
  onCancel: () => void;
  initialData?: MedicationFormData | null;
}

const Medications = ({ onCancel, initialData }: MedicationsProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData ?? {
      medication_name: '',
      medication_purpose: '',
      dosage: '',
      frequency: '',
      route: undefined,
      isActive: undefined,
      notes: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        medication_name: '',
        medication_purpose: '',
        dosage: '',
        frequency: '',
        route: undefined,
        isActive: undefined,
        notes: '',
      });
    }
  }, [initialData, reset]);

  async function createMedication(payload: MedicationFormData) {
    const res = await api.post("/medications/", payload);
    return res.data;
  }

  async function updateMedication(payload: MedicationFormData) {
    if (!payload.id) throw new Error("Medication ID is required for update");
    const res = await api.put(`/medications/${payload.id}`, payload);
    return res.data
  }

  /* const {
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
  }); */

  const createMutation = useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      reset();
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      reset();
      onCancel();
    },
  });

  /* const onSubmit = (data: MedicationFormData) => {
  createMutation(data);
}; */

  const onSubmit = (data: MedicationFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = isEditing ? updateMutation.isPending : createMutation.isPending;
  const isError = isEditing ? updateMutation.isError : createMutation.isError;
  const error = isEditing ? updateMutation.error : createMutation.error;
  const isSuccess = isEditing ? updateMutation.isSuccess : createMutation.isSuccess;

  return (
    <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-md shadow">
      <h3 className="text-center mb-6">
        {isEditing ? "Edit" : "Add"} Medication Information</h3>
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
            <label className="block mb-2">Frequency</label>
            <input
              type="text"
              {...register("frequency")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
              placeholder="e.g., twice per day, one puff every 8 hours"
            />
            {errors.frequency && (
              <p className="text-red-500 mt-1">{errors.frequency.message}</p>
            )}
            {/* <label className="block mb-2">Dosage</label>
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
              <option value="Rectal">Rectal</option>

            </select>
            {errors.route && (
              <p className="text-red-500 mt-1">{errors.route.message}</p>
            )} */}
          </div>
          <div>
            <label className="block mb-2">Is Active</label>
            <select
              {...register("isActive", {
                setValueAs: (value) =>
                  value === "yes" ? true : value === "no" ? false : undefined,
              })}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.isActive && (
              <p className="text-red-500 mt-1">{errors.isActive.message}</p>
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
              className="bg-gray-200 hover:bg-gray-300 border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#81c784] hover:bg-[#2e7d32] border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/5"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {isSuccess && (
          <p className="text-[#4caf50] mt-2">
            Medication {isEditing ? "updated" : "added"} successfully!</p>
        )}
        {isError && (
          <p className="text-red-500 mt-2">
            {error?.message || `Failed to ${isEditing ? "update" : "add"} medication`}
          </p>
        )}
      </form >
    </div >
  );
};

export default Medications;
