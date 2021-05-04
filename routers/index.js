const express = require("express");
const router = express.Router();
const users = require("./user");
const recipes = require("./recipe");
const userInfo = require("./userInfo");
const admin = require("./admin");
const ingredients = require("./ingredients");

router.use("/users", users);
router.use("/recipes", recipes);
router.use("/userInfo", userInfo);
router.use("/admin", admin);
router.use("/ingredients", ingredients);
module.exports = router;