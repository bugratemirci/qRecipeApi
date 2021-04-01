const express = require("express");
const router = express.Router();
const users = require("./user");
const recipes = require("./recipe");

router.use("/", users);
router.use("/", recipes);
module.exports = router;