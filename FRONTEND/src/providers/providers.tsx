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

  const [qrURL, setQrURL] = useState<string | null>(() => {
    const qURL = localStorage.getItem("auth_qr");
    if (!qURL || qURL === "undefined" || qURL === "null") {
      return null;
    }
    return qURL;
  });

  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem("auth_user");
    if (!u || u === "undefined" || u === "null") {
      return null;
    }
    return JSON.parse(u);
  });

  const [isRevoked, setIsRevoked] = useState<boolean>(false);

  const login = (newToken: string, newUser: User, newQr: string, newIsRevoked: boolean) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    localStorage.setItem("auth_qr", newQr);
    setToken(newToken);
    setUser(newUser);
    setQrURL(newQr);
    setIsRevoked(newIsRevoked);
    navigate("/account");
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_qr");
    setToken(null);
    setUser(null);
    setQrURL(null);
    setIsRevoked(false);
    navigate("/");
  };

  const signup = async (formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    // call the API to create user
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
    login(loginData.token, loginData.User, loginData.qr_url, loginData.is_revoked);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, signup, qrURL, isRevoked, setIsRevoked }}
    >
      {children}
    </AuthContext.Provider>
  );
};
