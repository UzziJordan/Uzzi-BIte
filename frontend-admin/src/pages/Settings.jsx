import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Settings = () => {
  const { token, logout } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState({ username: "", profilePicture: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // New Admin state
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({ 
          username: res.data.username,
          profilePicture: res.data.profilePicture || ""
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        username: profile.username,
        profilePicture: profile.profilePicture 
      };
      if (password) data.password = password;

      await axios.put(`${API}/api/users/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to delete your admin account? This action is permanent and you will be logged out immediately.")) {
      try {
        await axios.delete(`${API}/api/users/profile/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Account deleted successfully.");
        logout();
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting account");
      }
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/api/users`,
        { ...newAdmin, role: "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminMessage("New admin created successfully!");
      setNewAdmin({ username: "", password: "" });
    } catch (err) {
      setAdminMessage(err.response?.data?.message || "Error creating admin");
    }
  };

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-[#222222]">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* EDIT PROFILE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8ECEF]">
          <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full border rounded-xl px-4 py-2"
                placeholder="Username"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Profile Picture URL</p>
              <input
                type="text"
                value={profile.profilePicture}
                onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                className="w-full border rounded-xl px-4 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">New Password (leave blank to keep current)</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-2"
                placeholder="New Password"
              />
            </div>
            {message && <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
            <button className="bg-[#E63946] text-white py-3 rounded-xl font-bold mt-2">
              Update Profile
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-red-50">
            <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">Deleting your account will remove all your access to the admin panel.</p>
            <button 
              onClick={handleDeleteAccount}
              className="w-full border border-red-600 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors"
            >
              Delete My Account
            </button>
          </div>
        </div>

        {/* CREATE NEW ADMIN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8ECEF]">
          <h2 className="text-lg font-bold mb-4">Create New Admin</h2>
          <form onSubmit={handleCreateAdmin} className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">New Admin Username</p>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className="w-full border rounded-xl px-4 py-2"
                placeholder="Username"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">New Admin Password</p>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full border rounded-xl px-4 py-2"
                placeholder="Password"
              />
            </div>
            {adminMessage && <p className={`text-sm ${adminMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>{adminMessage}</p>}
            <button className="bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">
              Create Admin
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;