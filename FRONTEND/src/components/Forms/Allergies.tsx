import { api } from "../../api/http";
import {
  allergySchema,
  type AllergyFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AllergiesProps {
  onCancel: () => void;
}

const Allergies = ({ onCancel }: AllergiesProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AllergyFormData>({
    resolver: zodResolver(allergySchema),
  });

  async function createAllergy(payload: AllergyFormData) {
    const res = await api.post("/patients/allergies", payload);
    return res.data;
  }

  //Post mutation to submit allergy data
  const {
    mutate: createMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createAllergy,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["allergies"] });
      reset();
      onCancel();
    },
  });

  const onSubmit = (data: AllergyFormData) => {
    createMutation(data);
  };

  return (
    <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-md shadow">
      <h3 className="text-center mb-6">Add Allergy Information</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 bg-gray-100 p-6 rounded"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Allergy Name</label>
            <input
              type="text"
              {...register("allergen")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.allergen && (
              <p className="text-red-500 mt-1">{errors.allergen.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Allergy Type</label>
            <input
              type="text"
              {...register("allergy_type")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.allergy_type && (
              <p className="text-red-500 mt-1">{errors.allergy_type.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Reaction</label>
            <input
              type="text"
              {...register("reaction")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            />
            {errors.reaction && (
              <p className="text-red-500 mt-1">{errors.reaction.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Severity</label>
            <select
              {...register("severity")}
              className="w-full border border-gray-200 focus:outline-none focus:border-gray-700 p-2 rounded bg-white text-black"
            >
              <option value="">Select Severity</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
            {errors.severity && (
              <p className="text-red-500 mt-1">{errors.severity.message}</p>
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
          <p className="text-[#4caf50] mt-2">Allergy added successfully!</p>
        )}
        {isError && (
          <p className="text-red-500 mt-2">
            {error.message || "failed to add allergy"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Allergies;
