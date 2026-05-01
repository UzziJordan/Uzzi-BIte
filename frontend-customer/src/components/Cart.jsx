import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Cart = ({ cartItems, setCartItems, closeCart }) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const increase = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Service charge is calculated but not added to the total or displayed to the user
  const serviceCharge = Math.floor(subtotal * 0.05);
  const total = subtotal; // Service charge removed from total

  const placeOrder = async () => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      const formattedItems = cartItems.map((item) => ({
        meal: item._id,
        quantity: item.quantity,
      }));

      const res = await axios.post(
        `${API}/api/orders`,
        { items: formattedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = res.data._id;

      // ✅ Save to session
      const existing = JSON.parse(localStorage.getItem("placedOrderIds") || "[]");
      localStorage.setItem(
        "placedOrderIds",
        JSON.stringify([...existing, orderId])
      );

      setCartItems([]);
      closeCart();

      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to place order");
    }
  };

  return (
    <>
      {/* BLURRY BACKDROP OVERLAY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-55 transition-all"
      />

      {/* CART PANEL */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 w-80 md:w-96 h-full bg-white shadow-2xl z-[60] flex flex-col"
      >
        <div className="flex justify-between items-center p-6 border-b border-[#E8ECEF] ">
          <h2 className="font-bold text-xl">Your Cart ({cartItems.length})</h2>
          <button 
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-5xl mb-4">🛒</span>
              <p className="font-medium">Your cart is empty</p>
              <button 
                onClick={closeCart}
                className="mt-4 text-red-500 font-semibold"
              >
                Go browse some meals
              </button>
            </div>
          )}

          {cartItems.map((item) => (
            <div key={item._id} className="flex gap-4 items-center bg-gray-50 p-3 border border-[#E8ECEF] rounded-2xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover shadow-sm"
              />

              <div className="flex-1">
                <p className="font-bold text-gray-800">{item.name}</p>
                <p className="text-sm text-red-500 font-semibold">₦{item.price.toLocaleString()}</p>

                <div className="flex items-center gap-3 mt-2 bg-white w-fit px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                  <button 
                    onClick={() => decrease(item._id)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => increase(item._id)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="font-black text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50 border-[#E8ECEF] rounded-t-3xl">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-black text-xl pt-2 border-t border-[#E8ECEF] mt-2 text-gray-900">
              <span>Total</span>
              <span className="text-red-500">₦{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={cartItems.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
              ${cartItems.length > 0 
                ? "bg-red-500 text-white hover:bg-red-600 shadow-red-200" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Place Order 🚀
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Cart;