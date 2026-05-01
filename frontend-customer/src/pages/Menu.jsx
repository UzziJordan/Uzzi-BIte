import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MealCard from "../components/MealCard";
import Cart from "../components/Cart";

const API = import.meta.env.VITE_API_URL;

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const { logout, tableNumber } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const baseURL = API.replace(/\/$/, ""); // ✅ remove double slash
        const res = await axios.get(`${baseURL}/api/meals`);

        setMeals(res.data);

        // ✅ generate categories
        const uniqueCategories = [
          "All",
          ...new Set(res.data.map((meal) => meal.category)),
        ];
        setCategories(uniqueCategories);

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

  // ✅ filter meals
  const filteredMeals = meals.filter((meal) => {
    const matchesCategory = activeCategory === "All" || meal.category === activeCategory;
    const isAvailable = meal.available !== false; // handle legacy data where available might be undefined
    return matchesCategory && isAvailable;
  });

  return (
    <div className="bg-[#FBF9FA] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-white shadow sticky top-0 z-50">
        <h1 className="font-bold text-lg text-red-500">Uzzi Bitez</h1>

        <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Table</span>
            <span className="text-xl font-black text-gray-800 leading-none">{tableNumber || "N/A"}</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/my-orders")}
            className="text-sm font-medium text-gray-600 hover:text-red-500"
          >
            My Orders
          </button>
          
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 border border-red-100 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100"
          >
            Logout
          </button>

          <button onClick={() => setShowCart(true)} className="relative">
            <span className="text-xl">🛒</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ✅ CATEGORY FILTER */}
      <div className="flex gap-3 overflow-x-auto p-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
              ${
                activeCategory === cat
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MEALS */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredMeals.map((meal) => (
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