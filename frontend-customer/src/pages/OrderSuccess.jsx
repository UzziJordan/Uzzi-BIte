import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const OrderSuccess = () => {
  const { id: orderId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !token) {
      if (!token) console.warn("⚠️ No auth token available yet");
      setLoading(false);
      return;
    }

    // ✅ FETCH CURRENT STATUS
    const fetchOrderStatus = async () => {
      try {
        console.log("🔍 Fetching initial status for:", orderId);

        const res = await axios.get(`${API}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Initial status:", res.data.status);
        setStatus(res.data.status);
      } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    // ✅ SOCKET CONNECTION
    const socket = io(API);

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    // ✅ REAL-TIME UPDATE
    const handleOrderUpdate = (updatedOrder) => {
      console.log("📦 Incoming update:", updatedOrder);

      if (updatedOrder._id === orderId) {
        console.log("✨ Updating status:", updatedOrder.status);
        setStatus(updatedOrder.status);
      }
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
      socket.disconnect();
    };
  }, [orderId, token]);

  return (
    <div className="bg-[#FBF9FA] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md">
        
        {/* HEADER */}
        <h2 className="text-xl font-bold text-center">
          Order #{orderId?.slice(-5).toUpperCase()}
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6 text-sm">
          {status === "pending" && "Waiting for staff to acknowledge your order..."}
          {status === "accepted" && "Your order has been received! Staff will start soon."}
          {status === "preparing" && "Your meal is being prepared! 🍽️"}
          {status === "ready" && "Your order is ready to be served! 🎊"}
          {status === "served" && "Your order has been served. Enjoy! 😋"}
        </p>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-400">Loading status...</p>
        ) : (
          <div className="space-y-6">
            {[
              { key: "accepted", label: "Order Received" },
              { key: "preparing", label: "Preparing" },
              { key: "ready", label: "Ready to Serve" },
            ].map((step, index, arr) => {
              const orderFlow = ["pending", "accepted", "preparing", "ready", "served"];
              const currentIndex = orderFlow.indexOf(status);
              const stepIndex = orderFlow.indexOf(step.key);

              let state = "pending";
              
              if (stepIndex <= currentIndex) state = "completed";
              else if (stepIndex === currentIndex + 1) state = "active";

              return (
                <div key={step.key} className="flex items-center gap-4 relative">

                  {/* LINE */}
                  {index !== arr.length - 1 && (
                    <div className="absolute left-5 top-10 h-10 w-0.5 bg-gray-200" />
                  )}

                  {/* ICON */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all
                      ${
                        state === "completed"
                          ? "bg-green-500 text-white shadow-md shadow-green-100"
                          : state === "active"
                          ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-100"
                          : "bg-gray-200 text-gray-400"
                      }
                    `}
                  >
                    {state === "completed" ? "✓" : (index + 1)}
                  </div>

                  {/* TEXT */}
                  <div>
                    <p
                      className={`font-bold text-sm ${
                        state === "pending" ? "text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {step.label}
                    </p>

                    {state === "active" && (
                      <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                        In progress
                      </span>
                    )}
                    {state === "completed" && (
                      <span className="text-green-500 text-[10px] font-bold uppercase tracking-wider">
                        Done
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {status === "served" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
             <p className="text-green-600 font-bold text-sm">
              🎉 Your order has been served!
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold shadow-md shadow-red-100 hover:bg-red-600 transition-colors"
          >
            Place More Order 🚀
          </button>
          
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            My Orders 📋
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
