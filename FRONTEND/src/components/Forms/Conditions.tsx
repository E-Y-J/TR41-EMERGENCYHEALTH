import React from "react";
import {
  type ConditionFormData,
  conditionSchema,
} from "../../schemas/healthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Conditions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      navigate("/");
    },
  });

  const onSubmit = (data: ConditionFormData) => {
    createMutation(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 mt-10 rounded-lg shadow">
      <h2 className="text-center mb-6">Add Condition Information</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 solid-gray-300 p-6 rounded-lg"
      >
        <div className="mb-4">
          <label className="block mb-2">Condition Name:</label>
          <input
            type="text"
            {...register("condition_name")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.condition_name && (
            <p className="text-red-500 mt-1">{errors.condition_name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Is Chronic:</label>
          <select
            {...register("isChronic")}
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.isChronic && (
            <p className="text-red-500 mt-1">{errors.isChronic.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Notes:</label>
          <textarea
            {...register("notes")}
            className="w-full border p-2 rounded bg-white text-black"
          />
          {errors.notes && (
            <p className="text-red-500 mt-1">{errors.notes.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className=" w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add Condition"}
        </button>
        {isSuccess && (
          <p className="text-green-500 mt-2">Condition added successfully!</p>
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
