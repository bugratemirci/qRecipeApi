const express = require('express');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const router = express.Router();
const { blockUser, deleteUser, deleteRecipe } = require('../controllers/admin');
const { checkUserExist, checkRecipeExist } = require('../middlewares/database/databaseErrorHelpers');


router.use([getAccessToRoute, getAdminAccess]);

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin page"
    })
});

router.get("/block/:id", checkUserExist, blockUser);
router.delete("/user/:id", checkUserExist, deleteUser);
router.delete("/recipe/:id",checkRecipeExist, deleteRecipe);

module.exports = router;