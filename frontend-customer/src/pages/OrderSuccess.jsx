//Confirmation screen

import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const OrderSuccess = () => {
  const [status, setStatus] = useState("pending");

  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {

    const socket = io(API);

    socket.on("orderUpdated", (order) => {
      if (order._id === orderId) {
        console.log("📦 Order Updated:", order);
        setStatus(order.status);
      }
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, [orderId]);

  return (
    <div>
      <h2>Order Status</h2>
      <p>{status}</p>
    </div>
  );
};

export default OrderSuccess;