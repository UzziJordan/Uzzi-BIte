import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [mealsCount, setMealsCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, mealsRes, profileRes] = await Promise.all([
          axios.get(`${API}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/meals`),
          axios.get(`${API}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setOrders(ordersRes.data);
        setMealsCount(mealsRes.data.length);
        setAdminProfile(profileRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Calculations
  const today = new Date().toLocaleDateString();
  const ordersToday = orders.filter(o => new Date(o.createdAt).toLocaleDateString() === today);
  const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalPrice, 0);
  const activeTables = new Set(orders.filter(o => o.status !== "served").map(o => o.table?.tableNumber)).size;

  const recentOrders = orders.slice(0, 5);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 bg-white min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center">
            <h1 className="text-[24px] font-bold text-[#222222]">Dashboard</h1>
            <div className="flex items-center gap-3">
                <p className="text-[#222222] font-medium text-[14px]">Hello, {adminProfile?.username || "Admin"}</p>
                <img 
                  src={adminProfile?.profilePicture || "https://i.pravatar.cc/40"} 
                  alt="avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                />
            </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 border border-[#E8ECEF]">
                <p className="text-[#6B7280] font-medium text-[14px]">Orders Today</p>
                <h2 className="text-[24px] text-[#22222] font-bold mt-2">{ordersToday.length}</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8ECEF]">
                <p className="text-[#6B7280] text-[14px]">Revenue Today</p>
                <h2 className="text-[24px] text-[#22222] font-bold mt-2">₦{revenueToday.toLocaleString()}</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E8ECEF]">
                <p className="text-[#6B7280] text-[14px]">Active Tables</p>
                <h2 className="text-[24px] font-bold mt-2">{activeTables}</h2>
            </div>
    
            <div className="bg-white rounded-2xl p-6 border border-[#E8ECEF]">
                <p className="text-[#6B7280] text-[14px]">Total Meals</p>
                <h2 className="text-[24px] font-bold mt-2">{mealsCount}</h2>
            </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl border border-[#E8ECEF] mt-8">
            <div className="flex justify-between items-center p-5 border-b">
                <h2 className="font-semibold text-[16px]">Recent Orders</h2>
            </div>

            <div className="grid grid-cols-5 px-5 py-3 text-[#9CA3AF] text-[13px] border-b">
                <p>Order ID</p>
                <p>Table</p>
                <p>Status</p>
                <p>Total</p>
                <p>Time</p>
            </div>

            <div className="divide-y text-[14px]">
                {recentOrders.map(order => (
                    <div key={order._id} className="grid grid-cols-5 px-5 py-4 items-center">
                        <p>#{order._id.slice(-6).toUpperCase()}</p>
                        <p>Table {order.table?.tableNumber || "N/A"}</p>
                        <span className={`px-3 py-1 rounded-full text-xs w-fit ${
                            order.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                            order.status === "preparing" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                        }`}>
                            {order.status}
                        </span>
                        <p>₦{order.totalPrice}</p>
                        <p>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;