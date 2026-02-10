import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";
import Mailcheck from "mailcheck";
import { loginSchema, type LoginFormData } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useState } from "react";

interface LoginProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ active, switchTab, boxActive, onClose }) => {
  const { login } = useAuth();
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    setValue,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Watch the email field for changes to trigger Mailcheck
  const emailValue = watch("email");

  // Function to run Mailcheck on the email input
  const runMailcheck = (email: string) => {
    const clean = (email || "").trim().toLowerCase();
    if (!clean) return setEmailSuggestion(null);

    Mailcheck.run({
    email: clean,
    suggested: (s: { full: string }) => {
    setEmailSuggestion(s.full);
  },
    empty: () => setEmailSuggestion(null),
  });
  };

  // Function to apply the email suggestion when the user clicks on it
  const applySuggestion = () => {
    if (!emailSuggestion) return;
    setValue("email", emailSuggestion, { shouldValidate: true, shouldDirty: true });
    setEmailSuggestion(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const loginRes = await fetch("http://127.0.0.1:5000/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      if (!loginRes.ok) {
        const err = await loginRes.json();
        throw new Error(err.Message || err.message || "Email or password is incorrect");
      }
      const loginData = await loginRes.json();
      console.log("login Data", loginData);
      login(loginData.token, loginData.User, loginData.qr_url);
      reset();
      onClose();
    } catch (error: unknown) {
      setError("root.serverError", {
        type: "manual",
        message: error instanceof Error ? error.message : "Login failed. Please try again.",
      });
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
            {...register("email")}
            type="email"
            {...register("email", {
              onBlur: () => runMailcheck(emailValue),
              onChange: () => {
                if (emailSuggestion) setEmailSuggestion(null);
              },
            })}
            placeholder="Enter email"
            className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
          {emailSuggestion && emailSuggestion !== (emailValue || "").trim().toLowerCase() && (
            <div className="text-yellow-700 text-sm">
            Did you mean{" "}
            <button type="button" onClick={applySuggestion} className="underline font-medium">
            {emailSuggestion}
            </button>
              ?
            </div>
          )}
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
          <button
            type="submit"
            className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {errors.root?.serverError && (
            <p className="text-red-500 text-center">
              {errors.root.serverError.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
