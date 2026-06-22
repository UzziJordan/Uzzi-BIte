import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const ADMIN_TOKEN_KEY = "adminToken";

const getTokenPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = getTokenPayload(token);
  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now();
};

const getValidStoredToken = () => {
  const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!storedToken || isTokenExpired(storedToken)) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return null;
  }

  return storedToken;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getValidStoredToken);

  const login = (newToken) => {
    if (isTokenExpired(newToken)) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      setToken(null);
      return;
    }

    localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    window.location.href = "/";
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const payload = getTokenPayload(token);
    const timeUntilExpiry = Math.max(payload.exp * 1000 - Date.now(), 0);
    const logoutTimer = window.setTimeout(logout, timeUntilExpiry);

    return () => window.clearTimeout(logoutTimer);
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
