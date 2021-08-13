const { registerController } = require('../controllers/auth.controller');

const express = require('express');
const { registerValidator } = require('../validators/auth');
const { runValidation } = require('../validators');
const router = express.Router();

router.post('/register', registerValidator, runValidation, registerController)

module.exports = router;