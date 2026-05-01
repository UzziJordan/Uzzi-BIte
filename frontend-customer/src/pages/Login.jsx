import React, { useState, useEffect } from "react";
import axios from "axios";

import logo from "../assets/logo 2.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();
  const { setToken, token } = useAuth();

  // 👉 Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  // 👉 You can adjust number of tables here
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleLogin = async () => {
    if (!selectedTable) return;

    try {
      const baseURL = API.replace(/\/$/, "");

      const res = await axios.post(`${baseURL}/api/auth/table-login`, {
        tableNumber: selectedTable,
      });

      setToken(res.data.token, selectedTable);

      // ✅ Clear previous session orders
      localStorage.removeItem("placedOrderIds");

      // go to menu
      navigate("/dashboard");

    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 403) {
        alert("Table is currently occupied. Please choose another or call staff.");
      } else {
        alert("Table not found or server error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">

        {/* LOGO */}
        <div>
          <img src={logo} alt="Uzzi Bitez Logo" className="size-24 mx-auto" />
        </div>

        <h1 className="text-xl font-bold">Uzzi Bitez</h1>
        <p className="text-gray-500 text-sm mb-6">Restaurant</p>

        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p className="text-gray-500 mb-6">
          Select your table to start ordering
        </p>

        {/* TABLE GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {tables.map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`py-3 rounded-lg border border-gray-300 font-semibold
                ${
                  selectedTable === table
                    ? "bg-red-500 text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
            >
              {table}
            </button>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={!selectedTable}
          className={`w-full py-3 rounded-xl font-semibold transition
            ${
              selectedTable
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Start Ordering
        </button>

        {/* FOOTER */}
        <p className="text-sm text-gray-400 mt-4">
          Need help? Call staff
        </p>
      </div>
    </div>
  );
};

export default Login;