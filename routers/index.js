const express = require("express");
const router = express.Router();
const users = require("./user");
const recipes = require("./recipe");
const userInfo = require("./userInfo");
const admin = require("./admin");

router.use("/users", users);
router.use("/recipes", recipes);
router.use("/userInfo", userInfo);
router.use("/admin", admin);
module.exports = router;