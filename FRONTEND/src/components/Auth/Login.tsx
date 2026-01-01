import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";

interface LoginProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
}

const Login: React.FC<LoginProps> = ({ active, switchTab, boxActive }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      // call the API to get the token and log the user after signup
      const loginRes = await fetch("http://127.0.0.1:5000/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      if (!loginRes.ok) {
        const err = await loginRes.text();
        throw new Error(err || "Login failed");
      }
      const loginData = await loginRes.json();
      console.log("login Data", loginData);
      // get the token, user and qrURL from the response
      login(loginData.token, loginData.User, loginData.qr);
      reset();
      navigate("/");
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
    }
  };

  return (
    <div className={`login-box${boxActive ? " active" : ""}`}>
      <div className="login-tab" style={{ zIndex: boxActive ? 4 : 1 }}>
        <button className="login-btn" onClick={switchTab}>
          Login
        </button>
      </div>
      <div className={`login-body p-7 ${active ? "active" : ""}`}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Enter email"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
            required
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
          <input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            placeholder="Password"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
            required
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
          <button
            type="submit"
            className="border border-gray-100 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
