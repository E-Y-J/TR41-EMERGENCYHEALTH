import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import '../styles/AuthContainer.css';

function AuthContainer() {
    const [activeTab, setActiveTab] = useState("login");

    
    return (
        <div className="auth-container">
            <Login
                active={activeTab === "login"}
                switchTab={() => setActiveTab("login")}
                boxActive={activeTab === "login"} 
            />
            <SignUp
                active={activeTab === "signup"}
                switchTab={() => setActiveTab("signup")}
                boxActive={activeTab === "signup"} 
            />
        </div>
    );
}

export default AuthContainer;
