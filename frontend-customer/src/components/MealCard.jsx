import React from "react";

const MealCard = ({ meal, addToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src={meal.image}
        alt={meal.name}
        className="w-full h-32 object-cover"
      />

      <div className="p-3">
        <h3 className="font-semibold">{meal.name}</h3>
        <p className="text-gray-500 text-sm">₦{meal.price}</p>

        <button
          onClick={() => addToCart(meal)}
          className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
        >
          Add +
        </button>
      </div>
    </div>
  );
};

export default MealCard;