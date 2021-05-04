const Ingredient = require("../models/Ingredients");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");

const getAllIngredients = async (req, res, next) => {
    const ingredients = await Ingredient.find();

    res.status(200).json(ingredients);
};

const addIngredients = asyncErrorWrapper(async (req, res, next) => {
    const { ingredients_name } = req.body;

    const ingredient = await Ingredient.create({
        ingredients_name
    });
    res.status(200).json({
        status: "success",
        ingredient: ingredient
    })
});


module.exports = {
    addIngredients,
    getAllIngredients
};