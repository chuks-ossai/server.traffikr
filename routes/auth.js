const express = require("express");
const {
  registerController,
  activateAccountController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");
const router = express.Router();

router.post("/register", registerValidator, runValidation, registerController);
router.post("/activate", activateAccountController);
router.post("/login", loginValidator, runValidation, loginController);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPasswordController
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPasswordController
);

module.exports = router;

// arn:aws:iam::761200046700:user/traffikr
