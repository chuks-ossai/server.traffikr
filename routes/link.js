const express = require("express");

const { runValidation } = require("../validators");
const { linkValidator } = require("../validators/link.validator");
const {
  authMiddleware,
  adminMiddleware,
  validateToken,
} = require("../controllers/auth.controller");
const {
  getAllLinks,
  getLinkBySlug,
  getLinksByCategory,
  createLink,
  updateLink,
  deleteLink,
  updateLinkClicks,
  getUserLinks,
} = require("../controllers/link.controller");
const router = express.Router();

router.get("/getAll", getAllLinks);
router.get("/userlinks", validateToken, authMiddleware, getUserLinks);
router.post(
  "/create",
  linkValidator,
  runValidation,
  validateToken,
  authMiddleware,
  createLink
);
router.get("/get/:slug", getLinkBySlug);
router.get("/get/:categoryId", getLinksByCategory);
router.put("/update-clicks/:linkId", updateLinkClicks);
router.put(
  "/update/:id",
  linkValidator,
  runValidation,
  validateToken,
  authMiddleware,
  updateLink
);

router.post(
  "/delete/:id",
  validateToken,
  authMiddleware,
  adminMiddleware,
  deleteLink
);

module.exports = router;
