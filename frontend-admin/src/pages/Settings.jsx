import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Settings = () => {
  const { token, logout } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState({ username: "", profilePicture: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await axios.post(`${API}/api/users/upload-avatar`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      setProfile({ ...profile, profilePicture: res.data.url });
      setMessage("Profile picture uploaded! Don't forget to click Update Profile.");
    } catch (err) {
      setMessage("Error uploading image");
    } finally {
      setUploading(false);
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

          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              {profile.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100" 
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-300" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-white text-xs font-bold">Change Photo</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            {uploading && <p className="text-xs text-blue-500 mt-2">Uploading...</p>}
          </div>

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
              <p className="text-sm text-gray-500 mb-1">New Password (leave blank to keep current)</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-2"
                placeholder="New Password"
              />
            </div>
            {message && <p className={`text-sm ${message.includes("success") || message.includes("uploaded") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
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