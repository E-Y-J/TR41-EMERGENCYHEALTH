import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type FieldValues } from "react-hook-form";

interface SignUpProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ active, switchTab, boxActive }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      setErrorMessage("");
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      };
      await signup(payload);
      reset();
      navigate("/");
    } catch (error: any) {
      setErrorMessage(error.message || "Signup failed. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
    }
  };

  return (
    <div className={`signup-box${boxActive ? " active" : ""}`}>
      <div className="signup-tab" style={{ zIndex: boxActive ? 4 : 1 }}>
        <button className="signup-btn" onClick={switchTab}>
          Sign Up
        </button>
      </div>
      <div className={`signup-body p-7 ${active ? "active" : ""}`}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("firstName", { required: true })}
            type="text"
            placeholder="First Name"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.firstName && (
            <p className="text-red-500">First name is required</p>
          )}
          <input
            {...register("lastName", { required: true })} //the spread operator helps to register the methods and the properties of the useForm hook to the input field
            type="text"
            placeholder="Last Name"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.lastName && (
            <p className="text-red-500">Last name is required</p>
          )}
          <input
            {...register("email", {
              required: "Email is required",
              pattern: /^\S+@\S+$/i,
            })}
            type="email"
            placeholder="Email"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Z]).*$/,
                message: "Password must contain at least one uppercase letter",
              },
            })}
            type="password"
            placeholder="Create a Password"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}

          <button type="submit">
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
