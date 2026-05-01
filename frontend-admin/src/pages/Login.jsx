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
    <div className="flex h-screen">
      <div
        className="h-screen w-[33vw] bg-cover flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <img src={logo} className="w-20" />
        <h1 className="text-white text-3xl font-bold">Uzzi Bites</h1>
        <p className="text-gray-300">Admin Portal</p>
      </div>

      <div className="flex items-center justify-center flex-1">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-[300px]">
          <h1 className="text-2xl font-bold">Welcome Back</h1>

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <button className="bg-red-500 text-white py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;