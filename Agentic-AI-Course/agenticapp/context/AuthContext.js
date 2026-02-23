import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMe()
      .then((data) => {
        if (data && !data.detail) {
          setUser(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    await api.login(username, password);
    const me = await api.getMe();
    setUser(me);
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
