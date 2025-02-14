import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import { getMyInfo, getUserInfo } from "@/controllers/user.controller.js";

const router = express.Router();

router.get("/me", verifyAuth, verifyToken, getMyInfo);
router.get("/:username/about", verifyAuth, verifyToken, getUserInfo);

export default router;
