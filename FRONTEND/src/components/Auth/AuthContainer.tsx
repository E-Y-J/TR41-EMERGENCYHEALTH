import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import '../../styles/AuthContainer.css';

interface AuthContainerProps {
    onClose: () => void;
}

function AuthContainer({ onClose }: AuthContainerProps) {
    const [activeTab, setActiveTab] = useState("login");


    return (
        <div className="auth-container">
            <Login
                active={activeTab === "login"}
                switchTab={() => setActiveTab("login")}
                boxActive={activeTab === "login"}
                onClose={onClose}
            />
            <SignUp
                active={activeTab === "signup"}
                switchTab={() => setActiveTab("signup")}
                boxActive={activeTab === "signup"}
                onClose={onClose}
            />
        </div>
    );
}

export default AuthContainer;