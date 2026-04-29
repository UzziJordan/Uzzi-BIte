import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/OrderCard";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const { token } = useAuth();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = io(API);

    socket.on("newOrder", (newOrder) => {
      // Refresh to get populated data
      fetchOrders();
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        )
      );
    });

    socket.on("orderDeleted", (deletedId) => {
      setOrders((prev) => prev.filter((order) => order._id !== deletedId));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleAction = async (id, currentStatus) => {
    try {
      let newStatus = "pending";
      if (currentStatus === "pending") newStatus = "preparing";
      else if (currentStatus === "preparing") newStatus = "served";

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
        // Socket will handle the removal from state
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert("Failed to cancel order");
      }
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        {["all", "pending", "preparing", "served"].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f ? "bg-red-500 text-white" : "bg-white border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
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