const Recipe = require("../models/Recipe");
const asyncErrorWrapper = require("express-async-handler");
const getAllRecipes = async (req, res, next) => {

    const recipes = await Recipe.find();
    res
        .status(200)
        .json({
            success: true,
            data: recipes
        });
};


const enterARecipe = asyncErrorWrapper(async (req, res, next) => {

    const { name, description, comments, ingredients } = req.body;

    const recipe = await Recipe.create({
        name,
        description,
        comments,
        ingredients
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
    
    const recipe = await Recipe.findByIdAndUpdate(id,editInformation, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: recipe
    });

    
})
module.exports = {
    getAllRecipes,
    enterARecipe,
    editRecipe
};