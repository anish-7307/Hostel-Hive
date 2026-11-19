import { useState } from "react";
import { AuthContext } from "./authStore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedSession = sessionStorage.getItem("hostel_session");

    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch {
        sessionStorage.removeItem("hostel_session");
      }
    }

    return null;
  });
  const [loading] = useState(false);

  const login = async (userData) => {
    setUser(userData);

    sessionStorage.setItem(
      "hostel_session",
      JSON.stringify(userData)
    );
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("hostel_session");
  };

  const updateUser = (updates) => {
    setUser((currentUser) => {
      const nextUser = { ...currentUser, ...updates };
      sessionStorage.setItem("hostel_session", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
