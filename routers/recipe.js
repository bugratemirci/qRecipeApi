const express = require('express');
const router = express.Router();
const { getAllRecipes, enterARecipe, editRecipe, uploadRecipe, getSingleRecipe, deleteRecipe, likeRecipe, undoLikeRecipe, getRecipeByName } = require('../controllers/recipe');
const { getAccessToRoute, getRecipeOwnerAccess } = require('../middlewares/authorization/auth');
const recipeImageUpload = require('../middlewares/libraries/recipeImageUpload');
const { checkRecipeExist } = require('../middlewares/database/databaseErrorHelpers');
const comment = require('./comment');

router.get("", getAllRecipes);
router.post("/enterARecipe", getAccessToRoute, enterARecipe);
router.put("/edit/:id", [getAccessToRoute, checkRecipeExist, getRecipeOwnerAccess], editRecipe);
router.post("/uploadImage/:id", [getAccessToRoute, recipeImageUpload.single("recipe_image")], uploadRecipe);
router.get("/getRecipe/:id", checkRecipeExist, getSingleRecipe)
router.delete("/delete/:id", [getAccessToRoute, checkRecipeExist, getRecipeOwnerAccess], deleteRecipe);
router.get("/like/:id", [getAccessToRoute, checkRecipeExist], likeRecipe);
router.get("/undoLike/:id", [getAccessToRoute, checkRecipeExist], undoLikeRecipe);
router.get("/getRecipeByName/:slug", getRecipeByName)

router.use("/comments/:id", checkRecipeExist, comment);

module.exports = router;