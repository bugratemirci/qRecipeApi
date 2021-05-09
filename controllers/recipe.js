const Recipe = require("../models/Recipe");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");
const path = require("path");
const fs = require("fs");
const copyFile = require("fs-copy-file");

const getAllRecipes = async (req, res, next) => {

    const recipes = await Recipe.find();
    res
        .status(200)
        .json(recipes);
};

const getRecipeByName = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;

    //const recipe = await Recipe.find({"slug": slug});
    const recipe = await Recipe.find().where({ "slug": RegExp(slug) });


    return res.status(200).json(recipe);
});

const getRecipeByIngredient = asyncErrorWrapper(async (req, res, next) => {
    const { ingredients } = req.body;
    
    const recipe = await Recipe.find({ ingredients: { $in: ingredients } });

    return res.status(200).json(recipe);
});

const enterARecipe = asyncErrorWrapper(async (req, res, next) => {

    const information = req.body;
    
    const recipe = await Recipe.create({
        "name": information.name,
        "description": information.description,
        "ingredients": information.ingredients,
        "user": information.id,
        "recipe_image": information.base64_image
    });

    res
        .status(200)
        .json({
            success: true,
            data: recipe
        });
});

const editRecipe = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const editInformation = req.body;

    const recipe = await Recipe.findByIdAndUpdate(id, editInformation, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: recipe
    });


});

const getRecipeWithId = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.body;

    const recipe = await Recipe.findById(id);

    res.status(200).json(recipe);

});

const createBase64String = asyncErrorWrapper(async (req, res, next) => {

    const { base64_image, id } = req.body;
    
    const recipe = await Recipe.findByIdAndUpdate(id, {
        recipe_image: base64_image
    },
        {
            new: true,
            runValidators: true
        });

    res.status(200).json({
        success: true,
    });
});

const getSingleRecipe = asyncErrorWrapper(async (req,res,next) =>{
    const {id} = req.params;

    const user = await Recipe.findById(id);
    
    return res.status(200).json(user);
});

const uploadRecipe = asyncErrorWrapper(async (req, res, next) => {

    const rootDirectory = path.dirname(require.main.filename);
    const { id, recipe_image, recipe_id } = req.body;


    paths = `${recipe_id}_recipe_photo.jpeg`;
    fs.mkdir(rootDirectory + "/public/uploads/recipe_images/" + recipe_id, (err) => {

    });
    fs.writeFile(rootDirectory + "/public/uploads/recipe_images/" + recipe_id + "/" + paths, recipe_image, "base64", (err) => {

    });
    copyFile(recipe_image, rootDirectory + "/public/uploads/recipe_images/" + recipe_id + "/" + paths, (err) => {
        if (err) {
            next(new CustomError(err));
        }
    });

    const recipe = await Recipe.findByIdAndUpdate(recipe_id, {
        "recipe_image": "/public/uploads/recipe_images/" + recipe_id + "/" + paths
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        message: "Image upload successful",
        data: recipe
    });
});

const getSingleRecipeById = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    
    return res.status(200).json({
        success: true,
        data: recipe
    });
});
const deleteRecipe = asyncErrorWrapper(async (req, res, next) => {

    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Recipe delete operation successful"
    });
});
const likeRecipe = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (recipe.likes.includes(req.user.id)) {
        return next(new CustomError("You already like this recipe", 400));
    }

    recipe.likes.push(req.user.id);
    await recipe.save();

    return res.status(200).json({
        success: true,
        data: recipe
    });
});

const undoLikeRecipe = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe.likes.includes(req.user.id)) {
        return next(new CustomError("You can't undo like operation for this recipe", 400));
    }

    const index = recipe.likes.indexOf(req.user.id);
    recipe.likes.splice(index, 1);
    await recipe.save();

    return res.status(200).json({
        success: true,
        data: recipe
    });
});
module.exports = {
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
    getSingleRecipeById
};