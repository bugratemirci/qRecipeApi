const User = require("../models/User");
const CustomError = require("../helpers/errors/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const getSingleUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id} = req.params;

    const user = await User.findById(id);
    
    return res.status(200).json(user);
});

module.exports = {
    getSingleUser
}