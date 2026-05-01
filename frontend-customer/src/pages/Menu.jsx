import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MealCard from "../components/MealCard";
import Cart from "../components/Cart";
import logo from "../assets/logo.svg";
import backk from "../assets/backk.svg";  
import LoadingScreen from "../components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flyingItems, setFlyingItems] = useState([]); // ✅ For animation
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
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const addToCart = (meal, event) => {
    // capture click coordinates for animation
    if (event) {
      const { clientX, clientY } = event;
      const id = Date.now();
      setFlyingItems((prev) => [...prev, { id, x: clientX, y: clientY }]);
      
      // remove from state after animation completes
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((i) => i.id !== id));
      }, 800);
    }

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

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-[#FBF9FA] min-h-screen">

      {/* FLYING ANIMATION OVERLAY */}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: item.x, y: item.y, scale: 1, opacity: 1 }}
            animate={{ 
              x: window.innerWidth - 60, // target cart icon roughly
              y: 40, 
              scale: 0.2, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "circIn" }}
            className="fixed top-0 left-0 w-8 h-8 bg-red-500 rounded-full z-9999 pointer-events-none shadow-lg flex items-center justify-center text-white font-bold"
          >
            +
          </motion.div>
        ))}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 md:px-10 bg-white shadow sticky top-0 z-50">
        <div>
          <img src={logo} alt="Uzzi Bitez Logo" className="size-16 md:size-22" />
        </div>

        <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Table</span>
            <span className="text-lg md:text-xl font-black text-gray-800 leading-none">{tableNumber || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => navigate("/my-orders")}
            className="text-xs md:text-sm font-medium text-gray-600 hover:text-red-500"
          >
            Orders
          </button>
          
          <button 
            onClick={handleLogout}
            className="text-xs md:text-sm font-medium text-red-500 border border-red-100 px-2 md:px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100"
          >
            Logout
          </button>

          <button onClick={() => setShowCart(true)} className="relative">
            <motion.span 
              animate={cartItems.length > 0 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-xl block"
            >
              🛒
            </motion.span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* WELCOME BANNER */}
      <div style={{ backgroundImage: `url(${backk})` }} 
            className="bg-cover relative bg-center h-36 md:h-48 flex items-center mx-4 my-4 px-6 md:px-10 rounded-lg shadow overflow-hidden"
        > 
        <div className="absolute inset-0 bg-black/80 h-full w-full pointer-events-none"></div>
        <div className="text-white text-left z-10">
          <h1 className="text-[20px] md:text-[24px] font-bold"> Good Food <br /> Good Mood </h1>
          <p className="text-[12px] md:text-[14px] text-[#aaacb1] mt-2">Fresh Ingredients, great taste <br />Delivered to your Table </p>
        </div>
      </div>


      {/* ✅ CATEGORY FILTER */}
      <div className="flex gap-3 overflow-x-auto p-4 md:px-10 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm whitespace-nowrap transition-colors
              ${
                activeCategory === cat
                  ? "bg-red-500 text-white shadow-md shadow-red-200"
                  : "bg-white text-gray-600 border border-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MEALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 md:px-10">
        {filteredMeals.map((meal) => (
          <MealCard key={meal._id} meal={meal} addToCart={(m, e) => addToCart(m, e)} />
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