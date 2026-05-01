import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiCopy, FiTrash2, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [newTableNumber, setNewTableNumber] = useState("");
  const { token } = useAuth();

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [token]);

  const handleAddTable = async () => {
    if (!newTableNumber) return;
    try {
      await axios.post(`${API}/api/users`, 
        { tableNumber: Number(newTableNumber) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTableNumber("");
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding table");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this table account?")) {
      try {
        await axios.delete(`${API}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTables();
      } catch (err) {
        console.error("Error deleting table:", err);
      }
    }
  };

  const handleReset = async (id) => {
    if (window.confirm("End this table session?")) {
      try {
        await axios.patch(`${API}/api/users/${id}/reset`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTables();
      } catch (err) {
        console.error("Error resetting table:", err);
        alert(err.response?.data?.message || "Error resetting table");
      }
    }
  };

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num.toString());
    alert(`Table ${num} number copied!`);
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-semibold">Tables</h1>

        <div className="flex gap-2">
          <input 
            type="number"
            placeholder="Table Number"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-32"
          />
          <button 
            onClick={handleAddTable}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-[14px]"
          >
            <FiPlus /> Add Table
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 px-6 py-4 text-[#9CA3AF] text-[13px] border-b font-medium uppercase tracking-wider">
              <p>Table No.</p>
              <p>Role</p>
              <p>Status</p>
              <p className="text-right">Actions</p>
            </div>

            <div className="divide-y">
              {tables.map((table) => (
                <div key={table._id} className="grid grid-cols-4 items-center px-6 py-4 text-[14px]">
                  <p className="font-semibold text-gray-800">Table {table.tableNumber}</p>
                  <p className="text-gray-500 capitalize">{table.role}</p>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                      table.isOccupied ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {table.isOccupied ? "Occupied" : "Available"}
                    </span>
                  </p>
                  <div className="flex justify-end gap-4 text-[#9CA3AF]">
                    {table.isOccupied && (
                      <FiLogOut 
                        onClick={() => handleReset(table._id)} 
                        className="cursor-pointer hover:text-orange-500" 
                        title="End Session"
                      />
                    )}
                    <FiCopy onClick={() => handleCopy(table.tableNumber)} className="cursor-pointer hover:text-blue-500" title="Copy Table Number" />
                    <FiTrash2 onClick={() => handleDelete(table._id)} className="cursor-pointer hover:text-red-500" title="Delete Table" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tables;