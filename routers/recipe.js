const express = require('express');
const router = express.Router();
const {getAllRecipes, enterARecipe} = require('../controllers/recipe');

router.get("/recipes",getAllRecipes);
router.post("/recipes/enterARecipe", enterARecipe);

module.exports = router;