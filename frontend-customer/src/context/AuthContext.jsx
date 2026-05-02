import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(localStorage.getItem('token') || null);
    const [tableNumber, setTableNumberState] = useState(localStorage.getItem('tableNumber') || null);

    const userId = React.useMemo(() => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).id;
        } catch (e) {
            console.error("Token decoding failed", e);
            return null;
        }
    }, [token]);

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
            if (token) {
                await axios.post(`${API}/api/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error("Logout failed on server", err);
        }
        setToken(null);
        localStorage.removeItem("placedOrderIds");
    };

    return (
        <AuthContext.Provider value={{ tableNumber, token, userId, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
