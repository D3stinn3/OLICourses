import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then((data) => {
        if (data && !data.detail) {
          setUser(data);
        } else {
          api.logout();
        }
      })
      .catch(() => {
        api.logout();
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    await api.login(username, password);
    const me = await api.getMe();
    if (me && !me.detail) {
      setUser(me);
    } else {
      throw new Error("Failed to load user profile");
    }
  }

  function logout() {
    api.logout();
    setUser(null);
  }

  async function register(username, email, password) {
    await api.register(username, email, password);
    await login(username, password);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
