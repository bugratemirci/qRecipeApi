const express = require('express');
const router = express.Router();
const {getAllUsers, register} = require('../controllers/user');

router.get("/users",getAllUsers);
router.post("/users/register", register);


module.exports = router;