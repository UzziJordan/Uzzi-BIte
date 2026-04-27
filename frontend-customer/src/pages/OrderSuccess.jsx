import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const OrderSuccess = () => {
  const { id: orderId } = useParams();
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // ✅ FETCH CURRENT STATUS
    const fetchOrderStatus = async () => {
      try {
        console.log("🔍 Fetching initial status for:", orderId);

        const res = await axios.get(`${API}/api/orders/${orderId}`);

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
  }, [orderId]);

  return (
    <div className="bg-[#FBF9FA] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md">
        
        {/* HEADER */}
        <h2 className="text-xl font-bold text-center">
          Order #{orderId?.slice(-5).toUpperCase()}
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6">
          {status === "pending" && "Your order has been received. The kitchen will start soon."}
          {status === "preparing" && "Your meal is being prepared! 🍽️"}
          {status === "served" && "Your order is ready! A staff will bring it to you."}
        </p>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-400">Loading status...</p>
        ) : (
          <div className="space-y-6">
            {[
              { key: "pending", label: "Order Received" },
              { key: "preparing", label: "Preparing" },
              { key: "served", label: "Ready to Serve" },
            ].map((step, index, arr) => {
              const orderFlow = ["pending", "preparing", "served"];
              const currentIndex = orderFlow.indexOf(status);
              const stepIndex = orderFlow.indexOf(step.key);

              let state = "pending";
              
              if (stepIndex < currentIndex) state = "completed";
              else if (stepIndex === currentIndex) state = "completed";
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
                          ? "bg-green-500 text-white"
                          : state === "active"
                          ? step.key === "preparing"
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }
                    `}
                  >
                    {state === "completed" ? "✓" : "•"}
                  </div>

                  {/* TEXT */}
                  <div>
                    <p
                      className={`font-medium ${
                        state === "pending" ? "text-gray-400" : "text-black"
                      }`}
                    >
                      {step.label}
                    </p>

                    {state === "active" && (
                      <span className="text-red-500 text-sm">
                        In progress...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {status === "served" && (
          <p className="text-green-500 text-center mt-6 font-semibold">
            🎉 Your order has been served!
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;