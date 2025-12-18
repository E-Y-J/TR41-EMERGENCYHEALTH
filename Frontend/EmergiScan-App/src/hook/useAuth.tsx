import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.ts";

export const useAuth = () => {
  const utils = useContext(AuthContext);
  if (!utils) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return utils; // { user, token, login, logout, signup }
};
