import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const OrderSuccess = () => {
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { token } = useAuth();
  
  // Try to get orderId from state
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!orderId || !token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching initial status for order:", orderId);
        // Ensure no double slashes
        const baseUrl = API.endsWith("/") ? API.slice(0, -1) : API;
        const res = await axios.get(`${baseUrl}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Initial status fetched:", res.data.status);
        setStatus(res.data.status);
      } catch (err) {
        console.error("❌ Error fetching order status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    if (!orderId) return;

    // Remove /api if present in VITE_API_URL for socket connection if needed
    // Usually VITE_API_URL is the base server URL
    const socketBaseURL = API.endsWith("/api") ? API.slice(0, -4) : API;
    const socket = io(socketBaseURL);

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    const handleOrderUpdate = (updatedOrder) => {
      console.log("📦 Incoming update:", updatedOrder);

      if (updatedOrder._id === orderId) {
        console.log("✨ Updating status to:", updatedOrder.status);
        setStatus(updatedOrder.status);
      }
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
      socket.disconnect();
    };
  }, [orderId, token]);

  if (!orderId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No Order Found</h2>
        <p>Please place an order first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Order Status</h2>
      {loading ? (
        <p>Loading status...</p>
      ) : (
        <div style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          color: status === "served" ? "green" : "orange",
          textTransform: "capitalize",
          margin: "20px 0"
        }}>
          {status}
        </div>
      )}
      <p style={{ color: "#666" }}>Order ID: {orderId}</p>
      <small>The page will update automatically when your meal is ready!</small>
    </div>
  );
};

export default OrderSuccess;