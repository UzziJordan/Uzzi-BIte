import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(localStorage.getItem('token') || null);

    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
        setTokenState(newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("placedOrderIds");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
