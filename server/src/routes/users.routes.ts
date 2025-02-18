import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import { getMyInfo, getUserInfo } from "@/controllers/user.controller.js";

const router = express.Router();

router.use(verifyAuth, verifyToken);

router.get("/me", getMyInfo);
router.get("/:username/about", getUserInfo);

export default router;
