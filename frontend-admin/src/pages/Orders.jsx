//See live orders 🔥

import React from 'react'
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:5000");

const Orders = () => {
  const [ orders, setOrders ] = useState([]);

  useEffect(() => {
    socket.on("newOrder", (order) => {
      console.log("🔥 New Order:", order);

      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  return (
    <div>
      <h2>Live Orders</h2>

      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₦{order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;

