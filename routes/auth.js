const { registerController } = require('../controllers/auth.controller');

const express = require('express');
const router = express.Router();

router.get('/register', registerController)

module.exports = router;