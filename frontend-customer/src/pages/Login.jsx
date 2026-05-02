import React, { useState, useEffect } from "react";
import axios from "axios";

import logo from "../assets/logo 2.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setToken, token } = useAuth();

  // 👉 Fetch tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const baseURL = API.replace(/\/$/, "");
        const res = await axios.get(`${baseURL}/api/users/tables`);
        // Sort tables by tableNumber
        const sortedTables = res.data.sort((a, b) => a.tableNumber - b.tableNumber);
        setTables(sortedTables);
      } catch (err) {
        console.error("Failed to fetch tables:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // 👉 Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      {/* CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md text-center">

        {/* LOGO */}
        <div>
          <img src={logo} alt="Uzzi Bitez Logo" className="size-20 sm:size-24 mx-auto" />
        </div>

        <h1 className="text-xl font-bold">Uzzi Bitez</h1>
        <p className="text-gray-500 text-sm mb-6">Restaurant</p>

        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p className="text-gray-500 mb-6">
          Select your table to start ordering
        </p>

        {/* TABLE GRID */}
        {loading ? (
          <div className="flex justify-center py-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gray-100 border-t-red-500 rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6 max-h-60 overflow-y-auto p-1">
            {tables.map((table) => (
              <button
                key={table._id}
                onClick={() => !table.isOccupied && setSelectedTable(table.tableNumber)}
                disabled={table.isOccupied}
                className={`py-3 rounded-lg border font-semibold transition-all
                  ${
                    table.isOccupied
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                      : selectedTable === table.tableNumber
                      ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-200 scale-105"
                      : "bg-white border-gray-300 hover:border-red-300 hover:bg-red-50"
                  }`}
              >
                {table.tableNumber}
                {table.isOccupied && <span className="block text-[8px] uppercase">Occupied</span>}
              </button>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={!selectedTable}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95
            ${
              selectedTable
                ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Start Ordering
        </button>

        {/* FOOTER */}
        <p className="text-sm text-gray-400 mt-6">
          Need help? Call staff
        </p>
      </div>
    </div>
  );
};

export default Login;