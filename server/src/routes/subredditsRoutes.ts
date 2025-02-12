import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import {
  getPopularSubreddits,
  getPostsFromSubreddit,
  getSubredditInfo,
} from "@/controllers/subredditsController.js";

const router = express.Router();

router.get("/popular", verifyToken, getPopularSubreddits);
router.get("/:name/info", verifyToken, getSubredditInfo);
router.get("/:name/posts/popular", verifyToken, getPostsFromSubreddit);

export default router;
