const CustomError = require("../helpers/errors/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtClient } = require("../helpers/authorization/tokenHelpers");
const { validateUserInputs, comparePassword } = require("../helpers/authorization/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");
const copyFile = require("fs-copy-file");
const path = require("path");
const fs = require("fs");

const getAllUsers = async (req, res, next) => {
    const users = await User.find();
    res
        .status(200)
        .json(users);
};
const register = asyncErrorWrapper(async (req, res, next) => {
    // Post data
    const { name, email, password, role, notification_token, phone, about } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role,
        notification_token,
        phone,
        about
    });

    sendJwtClient(user, res);
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    const rootDirectory = path.dirname(require.main.filename);
    const { id, profile_image } = req.body;
    console.log(profile_image);
    paths = `${id}_profile_photo.jpeg`;
    fs.writeFile(rootDirectory + "/public/uploads/profile_images/" + paths, profile_image, "base64", (err) => {

    });

    copyFile(img, rootDirectory + "/public/uploads/profile_images/" + paths, (err) => {
        if (err) {
            next(new CustomError(err));
        }
    });


    const user = await User.findByIdAndUpdate(id, {
        "profile_image": "/uploads/profile_images/" + paths
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
        id: req.user.id,
        name: req.user.name
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
    console.log(user.name + " tarafından giriş yapıldı");
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
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
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

const editDetails = asyncErrorWrapper(async (req, res, next) => {

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
const getProfilePhoto = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.body;
    const user = await User.findById(id)

    res.status(200).json(user.profile_image);

});
module.exports = {
    getAllUsers,
    register,
    imageUpload,
    getUser,
    login,
    logout,
    forgotPassword,
    resetPassword,
    editDetails,
    getProfilePhoto
};