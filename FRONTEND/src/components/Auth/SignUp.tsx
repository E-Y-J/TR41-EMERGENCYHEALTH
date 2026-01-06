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
    onClose: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ active, switchTab, boxActive, onClose }) => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
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
            onClose(); // Close the modal
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
        <div className={`signup-box${boxActive ? ' active' : ''}`}>
            <div className="signup-tab" style={{ zIndex: boxActive ? 4 : 1 }}>
                <button className="signup-btn" onClick={switchTab}>
                    Sign Up
                </button>
            </div>
            <div className={`signup-body p-7 ${active ? "active" : ""}`}>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="First Name"
                        className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
                    />
                    {errors.firstName && (
                        <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                    )}
                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
                    />
                    {errors.lastName && (
                        <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                    )}
                    <input
                        type="email"
                        {...register("email")}
                        placeholder="Email"
                        className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Create a Password"
                        className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                    {errors.root?.serverError && (
                        <span className="text-red-500 text-sm">{errors.root.serverError.message}</span>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1 mx-auto cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
