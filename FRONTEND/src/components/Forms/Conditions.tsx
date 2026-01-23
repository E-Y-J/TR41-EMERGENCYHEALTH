import {
  type ConditionFormData,
  conditionSchema,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ConditionsProps {
  onCancel: () => void;
  initialData?: ConditionFormData | null;
}

const Conditions = ({ onCancel, initialData }: ConditionsProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConditionFormData>({
    resolver: zodResolver(conditionSchema),
    defaultValues: initialData || {
      condition_name: '',
      is_chronic: undefined,
      notes: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        condition_name: '',
        is_chronic: undefined,
        notes: '',
      });
    }
  }, [initialData, reset]);

  async function createCondition(payload: ConditionFormData) {
    const res = await api.post("/conditions/", payload);
    return res.data;
  }

  async function updateCondition(payload: ConditionFormData) {
    if (!payload.id) throw new Error("Condition ID is required for update");
    const res = await api.put(`/conditions/${payload.id}`, payload);
    return res.data;
  }

  const createMutation = useMutation({
    mutationFn: createCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conditions"] });
      reset();
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conditions"] });
      reset();
      onCancel();
    }
  });

  const onSubmit = (data: ConditionFormData) => {
    if (isEditing) {
      updateMutation.mutate({ ...data, id: initialData?.id });
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
        {isEditing ? "Edit" : "Add"} Condition Information</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 bg-gray-100 p-6 rounded"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Condition Name</label>
            <input
              type="text"
              {...register("condition_name")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.condition_name && (
              <p className="text-red-500 mt-1">{errors.condition_name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Is Chronic</label>
            <select
              {...register("is_chronic")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.is_chronic && (
              <p className="text-red-500 mt-1">{errors.is_chronic.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
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
            Condition {isEditing ? "updated" : "added"} successfully!</p>
        )}
        {isError && (
          <p className="text-red-500 mt-2">
            {error?.message || `Failed to ${isEditing ? "update" : "add"} condition`}
          </p>
        )}
      </form>
    </div>
  );
};

export default Conditions;
