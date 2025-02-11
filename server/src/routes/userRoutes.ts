import express from "express";
const router = express.Router();

import { getUserInfo } from "@/controllers/userController.js";

router.get("/me", getUserInfo);

export default router;
