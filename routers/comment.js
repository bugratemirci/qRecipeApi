const express = require("express");
const router = express.Router({ mergeParams: true });
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const { addNewCommentsToRecipe } = require("../controllers/comments");

router.post("/", getAccessToRoute, addNewCommentsToRecipe);

module.exports = router;