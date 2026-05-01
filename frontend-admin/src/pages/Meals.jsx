import React, { useEffect, useState } from "react";
import axios from "axios";
import MealForm from "../components/MealForm";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const { token } = useAuth();

  // FETCH
  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${API}/api/meals`);
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // SAVE
  const handleSave = async (data) => {
    try {
      if (editingMeal) {
        await axios.put(`${API}/api/meals/${editingMeal._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/api/meals`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchMeals();
      setShowForm(false);
      setEditingMeal(null);
    } catch (err) {
      console.error("Error saving meal:", err);
      alert("Error saving meal");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Delete this meal?")) {
      try {
        await axios.delete(`${API}/api/meals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMeals();
      } catch (err) {
        console.error("Error deleting meal:", err);
        alert("Error deleting meal");
      }
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setShowForm(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        <FiPlus /> Add Meal
      </button>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {meals.map((meal) => (
          <div key={meal._id} className={`bg-white p-4 rounded-xl shadow-sm border transition-all ${!meal.available ? "opacity-60 bg-gray-50 grayscale-[0.5]" : "hover:border-red-100"}`}>
            <div className="relative">
              <img src={meal.image} className="h-32 w-full object-cover rounded-lg mb-3" />
              {!meal.available && (
                <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                  Out of Stock
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-800 line-clamp-1">{meal.name}</h3>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">
                {meal.category}
              </span>
            </div>
            
            <p className="font-bold text-red-500 mb-3">₦{meal.price.toLocaleString()}</p>

            <div className="flex justify-between items-center pt-3 border-t">
               <span className={`text-[11px] font-bold uppercase tracking-tight ${meal.available ? "text-green-500" : "text-gray-400"}`}>
                  {meal.available ? "● Available" : "○ Hidden"}
               </span>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingMeal(meal); setShowForm(true); }}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FiEdit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(meal._id)}
                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <MealForm
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          initialData={editingMeal}
        />
      )}
    </div>
  );
};

export default Meals;