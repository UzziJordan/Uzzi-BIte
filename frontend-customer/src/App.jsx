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

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

// ✅ Session Manager to handle timeout
const SessionManager = () => {
  const { token, logout } = useAuth();
  const [lastActivity, setLastActivity] = React.useState(Date.now());

  React.useEffect(() => {
    if (!token) return;

    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("click", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("scroll", updateActivity);

    const interval = setInterval(async () => {
      const inactive = Date.now() - lastActivity;

      if (inactive > 300000) {
        try {
          const ids = JSON.parse(localStorage.getItem("placedOrderIds") || "[]");

          if (ids.length === 0) return;

          const res = await axios.get(`${API}/api/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const sessionOrders = res.data.filter((o) =>
            ids.includes(o._id)
          );

          const allServed = sessionOrders.every(
            (o) => o.status === "served"
          );

          if (allServed) {
            logout();
            localStorage.removeItem("placedOrderIds");
            window.location.href = "/";
          }
        } catch (err) {
          console.error(err);
        }
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [token, lastActivity, logout]);

  return null;
};

function App() {
  return (
    <AuthProvider>
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