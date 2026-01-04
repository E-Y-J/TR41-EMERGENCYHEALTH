import {
  type ConditionFormData,
  conditionSchema,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ConditionsProps {
  onCancel: () => void;
}

const Conditions = ({ onCancel }: ConditionsProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConditionFormData>({
    resolver: zodResolver(conditionSchema),
  });

  const createCondition = async (payload: ConditionFormData) => {
    const res = await api.post("/patients/conditions", payload);
    return res.data;
  };

  const {
    mutate: createMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["condition"] });
      reset();
      onCancel();
    },
  });

  const onSubmit = (data: ConditionFormData) => {
    createMutation(data);
  };

  return (
    <div className="mx-auto p-6 bg-gray-50  border border-gray-200 rounded-md shadow">
      <h3 className="text-center mb-6">Add Condition Information</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 bg-gray-100 p-6 rounded"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Condition Name:</label>
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
            <label className="block mb-2">Is Chronic:</label>
            <select
              {...register("isChronic")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.isChronic && (
              <p className="text-red-500 mt-1">{errors.isChronic.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Notes:</label>
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
          <p className="text-[#4caf50] mt-2">Condition added successfully!</p>
        )}
        {isError && (
          <p className="text-red-500 mt-2">
            {error.message || "failed to add condition"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Conditions;
