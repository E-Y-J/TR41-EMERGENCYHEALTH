import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  user: string | null;
  login: (newToken: string, newUser: string) => void;
  logout: () => void;
  signup: (formData: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
