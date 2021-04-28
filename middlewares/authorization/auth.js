const CustomError = require("../../helpers/errors/CustomError");
const jwt = require("jsonwebtoken");
const { isTokenInclueded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers");
const User = require("../../models/User");
const Recipe = require("../../models/Recipe");

const asyncErrorWrapper = require("express-async-handler");

const getAccessToRoute = (req, res, next) => {

    const { JWT_SECRET_KEY } = process.env;
    if (!isTokenInclueded(req)) {

        return next(new CustomError("You are not authorized to access this route", 401));
    }

    const access_token = getAccessTokenFromHeader(req);

    jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {

            return next(new CustomError("You are not authorized to access this route", 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        
        next();
    });
}
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (user.role !== "admin") {
        return next(new CustomError("Only admins can access this route", 403));
    }

    next();
});

const getRecipeOwnerAccess = asyncErrorWrapper(async (req, res, next) => {

    const userId = req.user.id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);

    if (recipe.user != userId) {
        return next(new CustomError("Only owner can handle this operation", 403));
    }
    next();
});

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getRecipeOwnerAccess
};