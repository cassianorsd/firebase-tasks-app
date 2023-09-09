import { User, UserCredential } from "firebase/auth";
import { createContext } from "react";

export interface AuthContextType {
  user: User | null | undefined;
  signIn: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  isAuthenticating: boolean;
}

export const AuthContext = createContext({} as AuthContextType);