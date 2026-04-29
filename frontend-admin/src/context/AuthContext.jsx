import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);