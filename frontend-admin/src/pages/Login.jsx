import React, { useState, useEffect } from "react";
import axios from "axios";
import image from "../assets/loggin.jpg";
import logo from "../assets/Background.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Login = () => {
  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const baseURL = API.replace(/\/$/, ""); // ✅ remove double slash
      const res = await axios.post(`${baseURL}/api/auth/login`, form);

      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="h-[30vh] md:h-screen w-full md:w-[33vw] bg-cover flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/40 md:hidden"></div>
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} className="w-16 md:w-20" />
          <h1 className="text-white text-2xl md:text-3xl font-bold">Uzzi Bites</h1>
          <p className="text-gray-200 text-sm md:text-base">Admin Portal</p>
        </div>
      </div>

      <div className="flex items-center justify-center flex-1 p-6">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-2">Please enter your details to sign in</p>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 uppercase ml-1">Username</p>
            <input
              name="username"
              placeholder="admin_username"
              onChange={handleChange}
              className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 uppercase ml-1">Password</p>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button className="bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all mt-2 active:scale-95">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;