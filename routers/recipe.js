const express = require('express');
const router = express.Router();
const { getAllRecipes, enterARecipe, editRecipe } = require('../controllers/recipe');

router.get("", getAllRecipes);
router.post("/enterARecipe", enterARecipe);
router.put("/edit/:id", editRecipe);
module.exports = router;