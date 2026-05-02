import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${API}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Filter by current session IDs
        const sessionOrderIds = JSON.parse(localStorage.getItem("placedOrderIds") || "[]");
        const sessionOrders = res.data.filter(order => sessionOrderIds.includes(order._id));
        
        setOrders(sessionOrders);
      } catch (err) {
        console.error("❌ Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [token]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending": return { label: "Pending", color: "text-orange-500 bg-orange-50" };
      case "accepted": return { label: "Order Received", color: "text-purple-500 bg-purple-50" };
      case "preparing": return { label: "Preparing", color: "text-blue-500 bg-blue-50" };
      case "ready": return { label: "Ready to Served", color: "text-orange-500 bg-orange-50" };
      case "served": return { label: "Served", color: "text-green-500 bg-green-50" };
      default: return { label: status, color: "text-gray-500 bg-gray-50" };
    }
  };

  return (
    <div className="bg-[#FBF9FA] min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-red-500 font-medium text-sm"
          >
            + Place More
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-gray-100 border-t-red-500 rounded-full mb-4"
            />
            <p className="text-gray-400 text-xs font-medium animate-pulse">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-bold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Hungry? Start adding items to your cart!</p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold w-full"
            >
              View Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusDisplay(order.status);
              return (
                <div 
                  key={order._id}
                  onClick={() => navigate(`/order-success/${order._id}`)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-red-200 transition-all active:scale-95"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Order ID</p>
                      <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                <div className="border-t border-dashed border-gray-100 pt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                  </div>
                  <div className="font-bold text-red-500">
                    ₦{order.totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FLOATING ACTION BUTTON */}
        <div className="fixed bottom-6 left-0 right-0 px-4 max-w-md mx-auto">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <span>🚀</span> Place More Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default MyOrders;