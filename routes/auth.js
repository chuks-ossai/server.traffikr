const express = require("express");
const {
  registerController,
  activateAccountController,
} = require("../controllers/auth.controller");

const { registerValidator } = require("../validators/auth");
const { runValidation } = require("../validators");
const router = express.Router();

router.post("/register", registerValidator, runValidation, registerController);
router.post("/activate-account", activateAccountController);

module.exports = router;
