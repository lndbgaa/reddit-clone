import verifyAuth from "@/middleware/verifyAuth.js";
import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import { getMyInfo, getUserInfo } from "@/controllers/userController.js";

const router = express.Router();

router.get("/me", verifyAuth, verifyToken, getMyInfo);
router.get("/:username/about", verifyAuth, verifyToken, getUserInfo);

export default router;
