import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const JWT_key = "JWT_KEY";

interface AuthContextValue {
  token?: string | null;
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
  initialized: boolean;
}

const AuthContext = createContext<Partial<AuthContextValue>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      token,
      onLogin: async (email: string, password: string) => {
        try {
          const result = await axios.post(`${API_URL}/auth`, {
            email,
            password,
          });
          if (result.data.token) {
            console.log("We have token!"); // FIXME:
            setToken(result.data.token);
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${result.data.token}`;
            await SecureStore.setItemAsync(JWT_key, result.data.token);
          }
        } catch (error: any) {
          throw {
            error: true,
            message: error?.response?.data?.msg ?? "Something went wrong",
          };
        }
      },
      onLogout: async () => {
        setToken(null);
        await SecureStore.deleteItemAsync(JWT_key);
        axios.defaults.headers.common["Authorization"] = ``;
      },
      onRegister: async (email: string, password: string) => {
        try {
          const result = await axios.post(`${API_URL}/user`, {
            email,
            password,
          });
          if (result.data.token) setToken(result.data.token);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${result.data.token}`;
          await SecureStore.setItemAsync(JWT_key, result.data.token);
          return result;
        } catch (error: any) {
          throw {
            error: true,
            message: error?.response?.data?.msg ?? "Something went wrong",
          };
        }
      },
    }),
    [axios, API_URL, setToken, token]
  );

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync(JWT_key);
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${storedToken}`;
      }
      setInitialized(true);
    };
    loadToken();
  }, [SecureStore]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
