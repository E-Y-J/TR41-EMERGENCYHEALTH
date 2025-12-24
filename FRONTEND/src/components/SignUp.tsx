import "../styles/AuthContainer.css";
import { useAuth } from "../hook/useAuth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  active: boolean;
  switchTab: () => void;
  boxActive: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ active, switchTab, boxActive }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      first_name: form.fname,
      last_name: form.lname,
      email: form.email,
      password: form.password,
    };
    signup(payload);
    setForm({
      fname: "",
      lname: "",
      email: "",
      password: "",
    });
    navigate("/");
  };
  return (
    <div className="signup-box">
      <div className="signup-tab" style={{ zIndex: boxActive ? 4 : 2 }}>
        <button className="signup-btn" onClick={switchTab}>
          Sign Up
        </button>
      </div>
      <div className={`signup-body p-7 ${active ? "active" : ""}`}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fname"
            value={form.fname}
            onChange={handleChange}
            placeholder="First Name"
            className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
            required
          />
          <input
            type="text"
            name="lname"
            value={form.lname}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a Password"
            className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
            required
          />
          <button
            type="submit"
            className="text-gray-500 border border-white active:bg-white focus:outline-none p-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
