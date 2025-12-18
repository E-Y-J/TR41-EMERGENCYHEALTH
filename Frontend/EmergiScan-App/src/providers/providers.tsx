import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const t = localStorage.getItem("auth_token");
    if (!t || t === "undefined" || t === "null") {
      return null;
    }
    return t;
  });
  const [user, setUser] = useState<string | null>(() => {
    const u = localStorage.getItem("auth_user");
    if (!u || u === "undefined" || u === "null") {
      return null;
    }
    return JSON.parse(u);
  });

  const login = (newToken: string, newUser: string) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  const signup = async (formData: { email: string; password: string }) => {
    // call the API to create user
    const resUser = await fetch("http://127.0.0.1:5000/pationts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!resUser.ok) {
      const err = await resUser.text();
      throw new Error(err || "Signup failed");
    }
    const UserData = await resUser.json();
    console.log("user Data", UserData);

    // call the API to get the token and login the user after signup
    const loginRes = await fetch("http://127.0.0.1:5000/login", {
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
    const userToken = loginData.auth_token || null;
    login(userToken, JSON.stringify(UserData));
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
