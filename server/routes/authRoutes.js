const express = require("express");
const router = express.Router();

const {
  redirectToRedditLogin,
  handleLoginCallback,
} = require("../controllers/authController");

router.get("/", redirectToRedditLogin);
router.get("/callback", handleLoginCallback);
//router.get("/logout");
//router.get("/check");

module.exports = router;
