import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiGrid, FiCoffee, FiClipboard, FiBox, FiLogOut, FiSettings, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";


import logo from "../assets/Background.png";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FiGrid />, end: true },
  { name: "Analytics", path: "/dashboard/analytics", icon: <FiTrendingUp /> },
  { name: "Meals", path: "/dashboard/meals", icon: <FiCoffee /> },
  { name: "Orders", path: "/dashboard/orders", icon: <FiClipboard /> },
  { name: "Tables", path: "/dashboard/tables", icon: <FiBox /> },
  { name: "Settings", path: "/dashboard/settings", icon: <FiSettings /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout( );
    navigate("/");
  };

  return (
    <>
      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <nav className={`fixed inset-y-0 left-0 bg-[#222222] min-h-screen w-70 flex flex-col justify-between py-6 transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-6">
            <img className="size-14" src={logo} alt="logo" />
            <div>
              <h1 className="text-white font-bold">Uzzi Bitez</h1>
              <p className="text-[#9CA3AF] text-sm">Admin Portal</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-[#3A1F22] text-[#E63946]"
                      : "text-[#9CA3AF] hover:bg-[#2A2A2A]"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="px-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:bg-[#2A2A2A] rounded-xl w-full"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;