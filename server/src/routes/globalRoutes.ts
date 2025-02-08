import { getPopularSubreddits } from "@controllers/globalController.js";
import verifyToken from "@middleware/verifyToken.js";
import express from "express";

const router = express.Router();

router.get("/subreddits/popular", verifyToken, getPopularSubreddits);

export default router;
