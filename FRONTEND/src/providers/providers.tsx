import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => {
    const t = localStorage.getItem("auth_token");
    if (!t || t === "undefined" || t === "null") {
      return null;
    }
    return t;
  });
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem("auth_user");
    if (!u || u === "undefined" || u === "null") {
      return null;
    }
    return JSON.parse(u);
  });

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    navigate("/auth");
  };

  const signup = async (formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    // call the API to create user (map first_name -> fname, last_name -> lname)
    const resUser = await fetch("http://127.0.0.1:5000/patients/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      }),
    });
    if (!resUser.ok) {
      const err = await resUser.text();
      throw new Error(err || "Signup failed");
    }
    const UserData = await resUser.json();
    console.log("user Data", UserData);

    // call the login function and pass the token and user after signup
    const loginRes = await fetch("http://127.0.0.1:5000/patients/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    if (!loginRes.ok) {
      const err = await loginRes.text();
      throw new Error(err || "Login after signup failed");
    }

    const loginData = await loginRes.json();
    console.log("login Data", loginData);
    const userToken = loginData.token;
    login(userToken, loginData.User);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
