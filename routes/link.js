const express = require("express");

const { runValidation } = require("../validators");
const { linkValidator } = require("../validators/link.validator");
const {
  authMiddleware,
  adminMiddleware,
  validateToken,
  authorizedUser,
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
  getAdminLinks,
  getTrending,
  getTrendingByCategory,
} = require("../controllers/link.controller");
const router = express.Router();

router.get("/getAll", getAllLinks);
router.get("/my/getAll", validateToken, authMiddleware, getUserLinks);
router.get(
  "/admin/getAll",
  validateToken,
  authMiddleware,
  adminMiddleware,
  getAdminLinks
);
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
router.get("/trending/getAll", getTrending);
router.get("/trending/get/:categorySlug", getTrendingByCategory);
router.put("/update-clicks/:linkId", updateLinkClicks);
router.put(
  "/my/update/:id",
  linkValidator,
  runValidation,
  validateToken,
  authMiddleware,
  authorizedUser,
  updateLink
);

router.put(
  "/admin/update/:id",
  linkValidator,
  runValidation,
  validateToken,
  authMiddleware,
  adminMiddleware,
  updateLink
);

router.delete(
  "/my/delete/:id",
  validateToken,
  authMiddleware,
  authorizedUser,
  deleteLink
);

router.delete(
  "/admin/delete/:id",
  validateToken,
  authMiddleware,
  adminMiddleware,
  deleteLink
);

module.exports = router;
