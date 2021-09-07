const express = require("express");

const { runValidation } = require("../validators");
const {
  categoryValidator,
  categoryUpdateValidator,
} = require("../validators/category.validator");
const {
  authMiddleware,
  adminMiddleware,
  validateToken,
} = require("../controllers/auth.controller");
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const router = express.Router();

router.get("/getAll", getAllCategories);
router.get("/get/:slug", getCategoryBySlug);
router.post(
  "/create",
  categoryValidator,
  runValidation,
  validateToken,
  authMiddleware,
  adminMiddleware,
  createCategory
);
router.put(
  "/update/:slug",
  categoryUpdateValidator,
  runValidation,
  validateToken,
  authMiddleware,
  adminMiddleware,
  updateCategory
);
router.delete(
  "/delete/:slug",
  validateToken,
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;
