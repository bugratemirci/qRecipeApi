const express = require('express');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const router = express.Router();
const { addIngredients, getAllIngredients } = require('../controllers/ingredients');

router.get("", getAllIngredients);

router.post("/addIngredients", addIngredients);

module.exports = router;