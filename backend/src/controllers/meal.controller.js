/* Handles meals (menu)
What it contains:
Create meal
Get all meals
Update meal
Delete meal
*/

const mongoose = require("mongoose");
const Meal = require("../models/Meal");

// GET ALL MEALS
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
}
};

// CREATE MEAL
exports.createMeal = async (req, res) => {
  try {
    const { name, price, category, image, available } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const meal = await Meal.create({
      name,
      price,
      category,
      image,
      available,
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MEAL
exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params; 

    const meal = await Meal.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });  
  }
};

// DELETE MEAL
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params; 

    const meal = await Meal.findByIdAndDelete(id);

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ message: "Meal deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });  
  }
};