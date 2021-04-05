const CustomError = require("../helpers/errors/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtClient } = require("../helpers/authorization/tokenHelpers");
const { validateUserInputs, comparePassword } = require("../helpers/authorization/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

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
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendJwtClient(user, res);
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        message: "Image upload successful",
        data: user
    });


});
const getUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
};

const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!validateUserInputs(email, password)) {
        return next(new CustomError("Please check your inputs", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your password", 400));
    }

    sendJwtClient(user, res);

});

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env;

    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message: "Logout successful"
    });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;
    const user = await User.findOne({ email: resetEmail });

    if (!user) {
        return next(new CustomError("There is no user with that email", 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();
    const resetPasswordUrl = `http://localhost:5000/api/users/resetPassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href = '${resetPasswordUrl}' target  = '_blank'>link</a> will expire in 1 hour</p>
    
    `;
    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset your password",
            html: emailTemplate
        });

        return res.status(200).json({
            success: true,
            message: "Token sent to your email"
        });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email could not be sent", 500));
    }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if (!resetPasswordToken) {
        return next(new CustomError("Please provide a valid token", 400));
    }
    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt : Date.now()}
    });

    if(!user) {
        return next(new CustomError("Invalid token or session expired", 404));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res
        .status(200)
        .json({
            success: true,
            message: "Reset password successful"
        });
});
module.exports = {
    getAllUsers,
    register,
    imageUpload,
    getUser,
    login,
    logout,
    forgotPassword,
    resetPassword
};