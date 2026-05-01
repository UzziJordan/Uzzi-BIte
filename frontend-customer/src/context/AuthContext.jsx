import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(localStorage.getItem('token') || null);
    const [tableNumber, setTableNumberState] = useState(localStorage.getItem('tableNumber') || null);

    const setToken = (newToken, number = null) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
            if (number) {
                localStorage.setItem('tableNumber', number);
                setTableNumberState(number);
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tableNumber');
            setTableNumberState(null);
        }
        setTokenState(newToken);
    };

    const logout = async () => {
        try {
            await axios.post(`${API}/api/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Logout failed on server", err);
        }
        setToken(null);
        localStorage.removeItem("placedOrderIds");
    };

    return (
        <AuthContext.Provider value={{ tableNumber, token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
