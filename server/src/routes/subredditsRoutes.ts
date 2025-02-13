import verifyAuth from "@/middleware/verifyAuth.js";
import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import {
  getPopularSubreddits,
  getSubredditInfo,
  getSubredditPopularPosts,
} from "@/controllers/subredditsController.js";

const router = express.Router();

router.get("/popular", verifyAuth, verifyToken, getPopularSubreddits);
router.get("/:name/info", verifyAuth, verifyToken, getSubredditInfo);
router.get("/:name/posts/popular", verifyAuth, verifyToken, getSubredditPopularPosts);

export default router;
