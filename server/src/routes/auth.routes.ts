import { Router } from "express";

const router = Router();

import {
  checkAuthStatus,
  handleLoginCallback,
  logoutUser,
  redirectToRedditLogin,
} from "@/controllers/auth.controller.js";

router.get("/", redirectToRedditLogin);
router.get("/callback", handleLoginCallback);
router.get("/logout", logoutUser);
router.get("/check", checkAuthStatus);

export default router;
