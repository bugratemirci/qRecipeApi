const User = require("../../models/User");
const CustomError = require("../../helpers/errors/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Recipe = require("../../models/Recipe");

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return next(new CustomError("User not found", 400));
    }

    next();
});

const checkRecipeExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
        return next(new CustomError("Recipe not found", 400));
    }

    next();

});
module.exports = {
    checkUserExist,
    checkRecipeExist
};