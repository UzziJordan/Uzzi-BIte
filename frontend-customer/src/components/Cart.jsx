import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

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

  const serviceCharge = Math.floor(subtotal * 0.05);
  const total = subtotal + serviceCharge;

  const placeOrder = async () => {
    try {
      const baseURL = API.replace(/\/$/, ""); // ✅ fix double slash

      const formattedItems = cartItems.map((item) => ({
        meal: item._id,
        quantity: item.quantity,
      }));

      const res = await axios.post(
        `${baseURL}/api/orders`,
        { items: formattedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = res.data._id;

      setCartItems([]);
      closeCart(); // ✅ close cart after order
      navigate(`/order-success/${orderId}`);

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login required to place order");
    }
  };

  return (
    <div className="fixed right-0 top-0 w-87.5 h-full bg-white shadow-lg z-50 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold">Your Cart ({cartItems.length})</h2>
        <button onClick={closeCart}>✕</button>
      </div>

      {/* ITEMS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartItems.length === 0 && (
          <div className="text-center mt-20 text-gray-400">
            <p>Your cart is empty 🛒</p>
          </div>
        )}

        {cartItems.map((item) => (
          <div key={item._id} className="flex gap-3 items-center">
            <img
              src={item.image || "https://placehold.co/60"} // ✅ fixed broken image
              alt={item.name}
              className="w-14 h-14 rounded object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">₦{item.price}</p>

              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => decrease(item._id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increase(item._id)}>+</button>
              </div>
            </div>

            <p>₦{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₦{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Service (5%)</span>
          <span>₦{serviceCharge}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mb-3">
          <span>Total</span>
          <span>₦{total}</span>
        </div>

        <button
          onClick={placeOrder}
          className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
        >
          Place Order 🚀
        </button>
      </div>
    </div>
  );
};

export default Cart;