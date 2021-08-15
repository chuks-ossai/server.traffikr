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
