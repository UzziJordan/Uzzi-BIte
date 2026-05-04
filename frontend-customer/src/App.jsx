import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Onboarding from "./pages/Onboarding";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashBoardLayout from "./pages/DashBoardLayout";
import axios from "axios";
import { Toaster } from "react-hot-toast";

import { io } from "socket.io-client";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

// ✅ Session Manager to handle timeout and admin resets
const SessionManager = () => {
  const { token, logout, userId } = useAuth();
  const [lastActivity, setLastActivity] = React.useState(Date.now());

  React.useEffect(() => {
    if (!token) return;

    // 1. Listen for Admin Reset via Sockets
    const socket = io(API);
    
    socket.on("tableReset", async (resetId) => {
      if (resetId === userId) {
        console.log("⚠️ Table session ended by admin");
        await logout();
        window.location.href = "/login";
      }
    });

    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("click", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("scroll", updateActivity);

    // 2. Inactivity Check (Simplified)
    const interval = setInterval(async () => {
      const inactive = Date.now() - lastActivity;
      // 10 minutes of inactivity (increased from 5)
      if (inactive > 600000) {
        await logout();
        localStorage.removeItem("placedOrderIds");
        window.location.href = "/";
      }
    }, 60000); // Check every minute instead of every 10s

    return () => {
      socket.disconnect();
      clearInterval(interval);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [token, lastActivity, logout, userId]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px'
          }
        }}
      />
      <SessionManager />

      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/order-success/:id" 
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-orders" 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashBoardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Menu />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;