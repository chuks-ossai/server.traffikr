const express = require("express");
const {
  registerController,
  activateAccountController,
  loginController,
} = require("../controllers/auth.controller");

const { registerValidator, loginValidator } = require("../validators/auth");
const { runValidation } = require("../validators");
const router = express.Router();

router.post("/register", registerValidator, runValidation, registerController);
router.post("/activate", activateAccountController);
router.post("/login", loginValidator, runValidation, loginController);

module.exports = router;
