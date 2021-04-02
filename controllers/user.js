const CustomError = require("../helpers/errors/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtClient }= require("../helpers/authorization/tokenHelpers");

const getAllUsers = async (req, res, next) => {
    const users = await User.find();
    res
        .status(200)
        .json({
            success: true,
            data: users
        });
};
const register = asyncErrorWrapper(async (req, res, next) => {
    // Post data
    const {name, email, password, role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendJwtClient(user, res);
});

const imageUpload = asyncErrorWrapper (async (req, res, next) => {


    res.status(200).json({
        success: true,
        message: "Image upload successful"
    });


});

module.exports = {
    getAllUsers,
    register,
    imageUpload
};