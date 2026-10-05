import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("supportdesk_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("supportdesk_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const loggedUser = response.user || response;
    setUser(loggedUser);
    localStorage.setItem("supportdesk_user", JSON.stringify(loggedUser));
    if (response.token)
      localStorage.setItem("supportdesk_token", response.token);
    return loggedUser;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("supportdesk_user");
    localStorage.removeItem("supportdesk_token");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("supportdesk_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
