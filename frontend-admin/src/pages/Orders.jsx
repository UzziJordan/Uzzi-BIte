import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/OrderCard";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import LoadingScreen from "../components/LoadingScreen";

import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");
const notificationSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🔔 Request Browser Notification Permission
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    fetchOrders();

    const socket = io(API);

    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      
      // 🔔 Sound Alert
      notificationSound.play().catch(e => console.log("Audio play blocked by browser"));
      
      // 🍞 Toast Alert
      toast.success(`New Order from Table ${newOrder.table?.tableNumber || "N/A"}!`, {
        duration: 5000,
        icon: '🔔',
      });

      // 🖥️ Browser Push Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Order Received! 🚀", {
          body: `Table ${newOrder.table?.tableNumber} has placed a new order.`,
          icon: "/vite.svg" 
        });
      }
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        )
      );
      toast.success(`Order #${updatedOrder._id.slice(-4)} updated to ${updatedOrder.status}`);
    });

    socket.on("orderDeleted", (deletedId) => {
      setOrders((prev) => prev.filter((order) => order._id !== deletedId));
      toast.error("Order cancelled/deleted");
    });

    socket.on("servedOrdersCleared", () => {
      setOrders((prev) => prev.filter((order) => order.status !== "served"));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleAction = async (id, currentStatus) => {
    try {
      const transitions = {
        "pending": "accepted",
        "accepted": "preparing",
        "preparing": "ready",
        "ready": "served"
      };

      const newStatus = transitions[currentStatus];
      if (!newStatus) return;

      await axios.put(
        `${API}/api/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.delete(`${API}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert("Failed to cancel order");
      }
    }
  };

  const handleClearServed = async () => {
    const servedOrders = orders.filter(o => o.status === "served");
    if (servedOrders.length === 0) {
      alert("No served orders to clear");
      return;
    }

    if (window.confirm(`Are you sure you want to clear all ${servedOrders.length} served orders? This cannot be undone.`)) {
      try {
        await axios.delete(`${API}/api/orders/clear-served`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error clearing served orders:", err);
        alert("Failed to clear served orders");
      }
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2 md:gap-4">
          {["all", "pending", "accepted", "preparing", "ready", "served"].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm capitalize font-bold transition-colors ${
                filter === f ? "bg-red-500 text-white shadow-md shadow-red-200" : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={handleClearServed}
          className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <span>🧹</span> Clear All Served
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {filtered.map((order) => (
          <OrderCard
            key={order._id}
            order={{
              ...order,
              id: order._id,
              table: order.table?.tableNumber || "N/A",
              total: order.totalPrice,
              items: order.items.map(i => ({
                name: i.meal?.name || "Deleted Meal",
                qty: i.quantity,
                price: i.meal?.price || 0
              }))
            }}
            onAction={() => handleAction(order._id, order.status)}
            onCancel={() => handleCancel(order._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Orders;
