/*CRUD meals
GET /meals
POST /meals
PUT /meals/:id
DELETE /meals/:id


EXAMPLE with controllers and middleware:*/

const express = require("express");
const router = express.Router();

// import middleware
const { verifyToken, isAdmin } = require("../middleware/auth");

// import controller
const {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal
} = require("../controllers/meal.controller");

// routes
router.get("/", getMeals);
router.post("/", verifyToken, isAdmin, createMeal);
router.put("/:id", verifyToken, isAdmin, updateMeal);
router.delete("/:id", verifyToken, isAdmin, deleteMeal);

module.exports = router;
