const { check } = require("express-validator");

exports.registerValidator = [
  check("fullName").not().isEmpty().withMessage("Full Name is required"),
  check("emailAddress").isEmail().withMessage("Email entered is not valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  check("termsAgreed")
    .exists({ checkFalsy: true })
    .withMessage("You need to agree to terms to continue"),
];

exports.loginValidator = [
  check("emailAddress").isEmail().withMessage("Email entered is not valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
];

exports.forgotPasswordValidator = [
  check("emailAddress").isEmail().withMessage("Email entered is not valid"),
];

exports.resetPasswordValidator = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  check("resetPasswordLink")
    .not()
    .isEmpty()
    .withMessage("The link you are using may not be correct"),
];

exports.registerValidator = [
  check("fullName").not().isEmpty().withMessage("Full Name is required"),
];
