import React, { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../components/MealCard";
import Cart from "../components/Cart";

const API = import.meta.env.VITE_API_URL;

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`${API}/api/meals`);
        setMeals(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMeals();
  }, []);

  const addToCart = (meal) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === meal._id);

      if (existing) {
        return prev.map((item) =>
          item._id === meal._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...meal, quantity: 1 }];
    });
  };

  return (
    <div className="bg-[#FBF9FA] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="font-bold text-lg">Uzzi Bitez</h1>

        <button onClick={() => setShowCart(true)}>
          🛒 ({cartItems.length})
        </button>
      </div>

      {/* MEALS */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} addToCart={addToCart} />
        ))}
      </div>

      {/* CART */}
      {showCart && (
        <Cart
          cartItems={cartItems}
          setCartItems={setCartItems}
          closeCart={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default Menu;