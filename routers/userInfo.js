const express = require('express');
const router = express.Router();
const {getSingleUser} = require('../controllers/userInfo');
const {checkUserExist} = require('../middlewares/database/databaseErrorHelpers');

router.get("/:id",checkUserExist, getSingleUser);

module.exports = router;