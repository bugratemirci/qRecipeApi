const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");

const addNewCommentsToRecipe = asyncErrorWrapper (async (req, res, next) => {

    
});

module.exports = {
    addNewCommentsToRecipe
}