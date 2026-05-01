import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiCalendar } from "react-icons/fi";
import LoadingScreen from "../components/LoadingScreen";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Stats = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { token } = useAuth();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2024, 2025, 2026];

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/orders?includeCleared=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching stats data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, [token]);

  // Filter orders by selected month and year
  const monthlyOrders = orders.filter(order => {
    const date = new Date(order.createdAt);
    return date.getMonth() === parseInt(selectedMonth) && date.getFullYear() === parseInt(selectedYear);
  });

  const totalRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = monthlyOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate top meals
  const mealStats = {};
  monthlyOrders.forEach(order => {
    order.items.forEach(item => {
      const mealName = item.meal?.name || "Deleted Meal";
      if (!mealStats[mealName]) {
        mealStats[mealName] = { count: 0, revenue: 0 };
      }
      mealStats[mealName].count += item.quantity;
      mealStats[mealName].revenue += (item.meal?.price || 0) * item.quantity;
    });
  });

  const topMeals = Object.entries(mealStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">Business Stats</h1>
          <p className="text-gray-500 text-sm">Review your performance for {months[selectedMonth]} {selectedYear}</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white border border-[#E8ECEF] px-4 py-2 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-[#E8ECEF] px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8ECEF]">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 text-xl">
            <FiDollarSign />
          </div>
          <p className="text-[#6B7280] text-sm font-medium">Monthly Revenue</p>
          <h2 className="text-2xl font-bold mt-1">₦{totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8ECEF]">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">
            <FiShoppingCart />
          </div>
          <p className="text-[#6B7280] text-sm font-medium">Total Orders</p>
          <h2 className="text-2xl font-bold mt-1">{totalOrders}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8ECEF]">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">
            <FiTrendingUp />
          </div>
          <p className="text-[#6B7280] text-sm font-medium">Avg. Order Value</p>
          <h2 className="text-2xl font-bold mt-1">₦{Math.round(averageOrderValue).toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TOP MEALS TABLE */}
        <div className="bg-white rounded-2xl border border-[#E8ECEF] overflow-hidden">
          <div className="p-5 border-b border-[#E8ECEF]">
            <h2 className="font-bold text-gray-800">Top Selling Meals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Meal Name</th>
                  <th className="px-6 py-3 text-center">Qty Sold</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topMeals.length > 0 ? topMeals.map((meal, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-700">{meal.name}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{meal.count}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-500">₦{meal.revenue.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">No data available for this month</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY INSIGHTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8ECEF]">
          <h2 className="font-bold text-gray-800 mb-6">Summary Insights</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Most Busy Month</p>
                <p className="text-sm font-semibold text-gray-700">Currently viewing {months[selectedMonth]}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Order Density</p>
                <p className="text-sm font-semibold text-gray-700">
                  {totalOrders > 0 ? `Total items sold: ${monthlyOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0)}` : "No orders found"}
                </p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100 mt-4">
              <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                <span>💡</span> Admin Tip:
              </p>
              <p className="text-red-600 text-xs mt-1 leading-relaxed">
                Clearing orders on the main orders page won't affect these stats. Your historical revenue and order counts are safely preserved here for growth analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;