const express = require('express');
const router = express.Router();
const {getAllUsers, register, imageUpload} = require('../controllers/user');
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');

router.get("/users",getAllUsers);
router.post("/users/register", register);
router.post("/users/upload", profileImageUpload.single("profile_image"), imageUpload);

module.exports = router;