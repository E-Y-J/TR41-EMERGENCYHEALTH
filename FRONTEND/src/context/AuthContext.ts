import { createContext } from "react";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (newToken: string, newUser: User) => void;
  logout: () => void;
  signup: (formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
