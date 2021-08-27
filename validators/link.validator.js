const { check } = require("express-validator");

exports.linkValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("url").not().isEmpty().withMessage("URL link is required"),
  check("categories")
    .not()
    .isEmpty()
    .withMessage("At least one category must be selected"),
];

// exports.categoryUpdateValidator = [
//   check("name").not().isEmpty().withMessage("Name is required"),
//   check("description")
//     .isLength({ min: 20 })
//     .withMessage(
//       "Too short. Description should not be less than 20 characters"
//     ),
// ];
