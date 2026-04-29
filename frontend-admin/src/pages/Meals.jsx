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
          <div key={meal._id} className="bg-white p-4 rounded shadow">
            <img src={meal.image} className="h-24 w-full object-cover" />
            <p>{meal.name}</p>
            <p>{meal.category}</p>
            <p>₦{meal.price}</p>

            <div className="flex gap-2 mt-2">
              <FiEdit onClick={() => { setEditingMeal(meal); setShowForm(true); }} />
              <FiTrash2 onClick={() => handleDelete(meal._id)} />
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