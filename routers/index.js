const express = require("express");
const router = express.Router();
const users = require("./user");
const recipes = require("./recipe");
const userInfo = require("./userInfo");

router.use("/users", users);
router.use("/recipes", recipes);
router.use("/userInfo", userInfo);
module.exports = router;