/* import { useState } from "react"; */
import Login from "./Login";
import SignUp from "./SignUp";
import '../styles/AuthContainer.css'



function AuthContainer() {
    /* const [activeTab, setActiveTab] = useState("login"); */

    return (
        <div className="auth-container">
            <SignUp />
            <Login />
        </div>
    );
}

export default AuthContainer;
