import { api } from "../../api/http";
import {
  allergySchema,
  type AllergyFormData,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Allergies = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      navigate("/");
    },
  });

  const onSubmit = (data: AllergyFormData) => {
    createMutation(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 mt-10 rounded-lg shadow">
      <h2 className="text-center mb-6">Add Allergy Information</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 solid-gray-300 p-6 rounded-lg"
      >
        <div className="mb-4">
          <label className="block mb-2">Allergy Name:</label>
          <input
            type="text"
            {...register("allergen")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.allergen && (
            <p className="text-red-500 mt-1">{errors.allergen.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Allergy Type:</label>
          <input
            type="text"
            {...register("allergy_type")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.allergy_type && (
            <p className="text-red-500 mt-1">{errors.allergy_type.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Reaction:</label>
          <input
            type="text"
            {...register("reaction")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.reaction && (
            <p className="text-red-500 mt-1">{errors.reaction.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Severity:</label>
          <select
            {...register("severity")}
            className="w-full border p-2 rounded bg-white text-black"
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
        <button
          type="submit"
          disabled={isPending}
          className=" w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add Allergy"}
        </button>
        {isSuccess && (
          <p className="text-green-500 mt-2">Allergy added successfully!</p>
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
