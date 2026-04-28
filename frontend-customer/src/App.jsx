import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Onboarding from './pages/Onboarding';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashBoardLayout from './pages/DashBoardLayout';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

// ✅ Session Manager to handle timeout
const SessionManager = () => {
  const { token, logout } = useAuth();
  const [lastActivity, setLastActivity] = React.useState(Date.now());

  React.useEffect(() => {
    if (!token) return;

    const handleActivity = () => setLastActivity(Date.now());
    
    // Listen for any interaction
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    const checkInterval = setInterval(async () => {
      const inactiveTime = Date.now() - lastActivity;
      
      // 5 minutes = 300,000 ms
      if (inactiveTime > 300000) {
        try {
          // Check if all orders in this session are served
          const sessionOrderIds = JSON.parse(localStorage.getItem("placedOrderIds") || "[]");
          
          if (sessionOrderIds.length > 0) {
            const res = await axios.get(`${API}/api/orders/my-orders`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const sessionOrders = res.data.filter(order => sessionOrderIds.includes(order._id));
            const allServed = sessionOrders.every(order => order.status === "served");

            if (allServed) {
              console.log("⏱️ Session timed out. All orders served and 5 min inactivity.");
              logout();
              window.location.href = "/";
            }
          } else {
            // No orders placed yet, but inactive for 5 min - just stay or log out?
            // User said "after all order... is served", so we only timeout if orders were placed and served.
          }
        } catch (err) {
          console.error("Session check failed", err);
        }
      }
    }, 30000); // check every 30 seconds

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(checkInterval);
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
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route index element={<Menu />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
