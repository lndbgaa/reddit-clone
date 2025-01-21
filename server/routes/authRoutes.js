const express = require("express");
const router = express.Router();

const {
  redirectToRedditLogin,
  handleLoginCallback,
  checkAuthStatus,
  logoutUser,
} = require("../controllers/authController");

router.get("/", redirectToRedditLogin);
router.get("/callback", handleLoginCallback);
router.get("/logout", logoutUser);
router.get("/check", checkAuthStatus);

module.exports = router;
