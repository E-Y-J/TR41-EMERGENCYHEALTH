import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormData } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignUpProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ active, switchTab, boxActive }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
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
      // Set server error for signup form
      setError("root.serverError", {
        type: "manual",
        message: error.message || "Signup failed. Please try again.",
      });
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
            {...register("firstName")}
            type="text"
            placeholder="First Name"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.firstName && (
            <p className="text-red-500">First name is required</p>
          )}
          <input
            {...register("lastName")} //the spread operator helps to register the methods and the properties of the useForm hook to the input field
            type="text"
            placeholder="Last Name"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.lastName && (
            <p className="text-red-500">Last name is required</p>
          )}
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
          <input
            {...register("password")}
            type="password"
            placeholder="Create a Password"
            className="border border-gray-100 focus:outline-none focus:border-gray-500 rounded p-2"
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}

          <button
            type="submit"
            className="border border-gray-100 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
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

export default SignUp;
