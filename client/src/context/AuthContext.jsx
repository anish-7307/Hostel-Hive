import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = sessionStorage.getItem("hostel_session");

    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch {
        sessionStorage.removeItem("hostel_session");
      }
    }

    setLoading(false);
  }, []);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}