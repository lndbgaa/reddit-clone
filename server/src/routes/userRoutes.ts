import express from "express";
const router = express.Router();

import { getMyInfo, getUserInfo } from "@/controllers/userController.js";
import verifyAuth from "@/middleware/verifyAuth.js";

router.get("/me", verifyAuth, getMyInfo);
router.get("/:username/about", getUserInfo);

export default router;
