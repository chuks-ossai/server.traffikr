const { check } = require("express-validator");

exports.categoryValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("img").not().isEmpty().withMessage("Image is required"),
  check("description")
    .isLength({ min: 20 })
    .withMessage(
      "Too short. Description should not be less than 20 characters"
    ),
];
exports.categoryUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("description")
    .isLength({ min: 20 })
    .withMessage(
      "Too short. Description should not be less than 20 characters"
    ),
];
