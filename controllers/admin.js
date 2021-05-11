const User = require("../models/User");
const Recipe = require("../models/Recipe");
const CustomError = require("../helpers/errors/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    user.blocked = !user.blocked;

    await user.save();

    return res
        .status(200)
        .json({
            success: true,
            message: "Block / Unblock successful"
        });
});

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    await user.remove();

    return res
        .status(200)
        .json({
            success: true,
            message: "User deleted"
        });
});



const allUsers = asyncErrorWrapper(async (req, res, next) => {

    const users = await User.find();

    return res
    .status(200)
    .json(users);
});


const editUser = asyncErrorWrapper(async (req, res, next) =>{
    const { id, editInformation, password } = req.body;

    const user = await User.findByIdAndUpdate(id, editInformation, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    user.password = password;
    user.save();

    return res.status(200).json({
        success: true,
        data: user
    });
});
const deleteRecipe = asyncErrorWrapper(async (req, res, next) =>{

    const {id} = req.body;

    console.log(id);

    const recipe = await Recipe.findById(id);

    await recipe.remove();

    return res
    .status(200)
    .json({
        success: true,
        message: "Recipe deleted"
    })
});
module.exports = {
    blockUser,
    deleteUser,
    deleteRecipe,
    allUsers,
    editUser
};