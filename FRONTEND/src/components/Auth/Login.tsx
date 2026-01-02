import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";

interface LoginProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ active, switchTab, boxActive, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
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
        const err = await loginRes.json();
        throw new Error(err.Message || err.message || "Login failed");
      }
      const loginData = await loginRes.json();
      console.log("login Data", loginData);
      // get the token, user and qrURL from the response
      login(loginData.token, loginData.User, loginData.qr);
      reset();
      onClose();
      navigate("/");
    } catch (error: any) {
      setError("root.serverError", {
        type: "manual",
        message: error.message || "Login failed. Please try again.",
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
            placeholder="Enter email"
            className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
            required
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
            required
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
          <button
            type="submit"
            className="border border-gray-100 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto"
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
