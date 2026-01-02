import "../../styles/AuthContainer.css";
import { useAuth } from "../../hook/useAuth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ active, switchTab, boxActive, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // call the API to get the token and log the user after signup
      const loginRes = await fetch("http://127.0.0.1:5000/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      if (!loginRes.ok) {
        await loginRes.text();
        setError("Invalid email or password");
        return;
      }
      const loginData = await loginRes.json();
      console.log("login Data", loginData);
      // get the token, user and qrURL from the response
      login(loginData.token, loginData.User, loginData.qr);

      setForm({
        email: "",
        password: "",
      });
      onClose(); // Close the modal
      navigate("/");
    } catch (_err) {
      setError("Invalid email or password");
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
              {error}
            </div>
          )}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-gray-50 text-black border border-gray-200 focus:outline-none focus:border-gray-700 rounded p-2"
            required
          />
          <button
            type="submit"
            className="border border-gray-100 active:bg-gray-100 focus:outline-none p-2 rounded w-1/3 mx-auto"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
