const express = require("express");
const {
  validateToken,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth.controller");
const {
  profileController,
  updateProfileController,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", validateToken, authMiddleware, profileController);
router.get("/admin/profile", validateToken, adminMiddleware, profileController);
router.put(
  "/my/profile",
  validateToken,
  authMiddleware,
  updateProfileController
);

module.exports = router;
