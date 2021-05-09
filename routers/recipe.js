const express = require('express');
const router = express.Router();
const { 
    getAllRecipes, 
    enterARecipe, 
    editRecipe, 
    uploadRecipe, 
    getSingleRecipe, 
    deleteRecipe, 
    likeRecipe, 
    undoLikeRecipe, 
    getRecipeByName, 
    getRecipeByIngredient, 
    getRecipeWithId, 
    createBase64String,
    getSingleRecipeById } = require('../controllers/recipe');
const { getAccessToRoute, getRecipeOwnerAccess } = require('../middlewares/authorization/auth');
const recipeImageUpload = require('../middlewares/libraries/recipeImageUpload');
const { checkRecipeExist } = require('../middlewares/database/databaseErrorHelpers');
const comment = require('./comment');

router.get("", getAllRecipes);
router.post("/enterARecipe", getAccessToRoute, enterARecipe);
router.put("/edit/:id", [getAccessToRoute, checkRecipeExist, getRecipeOwnerAccess], editRecipe);
router.post("/uploadImage", getAccessToRoute, uploadRecipe);
router.get("/getRecipe/:id", checkRecipeExist, getSingleRecipe)
router.delete("/delete/:id", [getAccessToRoute, checkRecipeExist, getRecipeOwnerAccess], deleteRecipe);
router.get("/like/:id", [getAccessToRoute, checkRecipeExist], likeRecipe);
router.get("/undoLike/:id", [getAccessToRoute, checkRecipeExist], undoLikeRecipe);
router.get("/getRecipeByName/:slug", getRecipeByName)
router.post("/getRecipeByIngredient", getRecipeByIngredient);
router.use("/comments/:id", checkRecipeExist, comment);
router.post("/getRecipeWithId", getRecipeWithId);
router.post("/createBase64String", createBase64String);
router.get("/:id", getSingleRecipeById);
module.exports = router;