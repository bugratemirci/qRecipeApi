const express = require('express');
const router = express.Router();
const {getAllRecipes, enterARecipe} = require('../controllers/recipe');

router.get("",getAllRecipes);
router.post("/enterARecipe", enterARecipe);

module.exports = router;