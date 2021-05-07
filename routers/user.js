const express = require('express');
const router = express.Router();
const { getAllUsers, register, imageUpload, getUser, login, logout, forgotPassword, resetPassword, editDetails, getProfilePhoto, createBase64String } = require('../controllers/user');
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');
const { getAccessToRoute } = require('../middlewares/authorization/auth');


router.get("", getAllUsers);
router.post("/register", register);
router.post("/upload", getAccessToRoute, imageUpload);
router.get("/profile", getAccessToRoute, getUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.put("/edit", getAccessToRoute, editDetails);
router.get("/getProfilPhoto", getAccessToRoute, getProfilePhoto);
router.post("/createBase64String", createBase64String);

module.exports = router;