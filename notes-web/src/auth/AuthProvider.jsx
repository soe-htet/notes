import { createContext, useContext, useEffect, useState } from "react";
import { me, login as apiLogin, signup as apiSignup } from "../api/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setBooted(true);
        return;
      }
      try {
        const u = await me();
        setUser(u);
      } catch (err) {
        localStorage.removeItem("accessToken");
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  const login = async (payload) => {
    const { accessToken, user } = await apiLogin(payload);
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
  };

  const signup = async (payload) => {
    const { accessToken, user } = await apiSignup(payload);
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateUserContext = (u) => setUser(u);

  return (
    <AuthCtx.Provider
      value={{ user, login, signup, logout, booted, updateUserContext }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
