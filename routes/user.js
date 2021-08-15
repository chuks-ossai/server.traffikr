const express = require("express");
const {
  validateToken,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth.controller");
const { profileController } = require("../controllers/user.controller");

const router = express.Router();

router.get("/user/profile", validateToken, authMiddleware, profileController);
router.get("/admin/profile", validateToken, adminMiddleware, profileController);

module.exports = router;
