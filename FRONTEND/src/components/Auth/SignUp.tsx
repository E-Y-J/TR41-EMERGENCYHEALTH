import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormData } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Mailcheck from "mailcheck";
import { useState } from "react";

interface SignUpProps {
    active: boolean;
    switchTab: () => void;
    boxActive: boolean;
    onClose: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ active, switchTab, boxActive, onClose }) => {
    const { signup } = useAuth();
    const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        watch,
        setValue,
        reset,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
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
            onClose();
        } catch (error: unknown) {
            setError("root.serverError", {
                type: "manual",
                message: error instanceof Error ? error.message : "Signup failed. Please try again.",
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
                    {...register("email", {
                    onBlur: () => runMailcheck(emailValue),
                    onChange: () => {
                        if (emailSuggestion) setEmailSuggestion(null);
                    },
                    })}
                    placeholder="Email"
                    className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

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
                        className="border border-gray-200 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
