import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import {
  getPopularPosts,
  getPopularSubreddits,
  getPostsByKeyword,
  getPostsFromSubreddit,
  getSubredditInfo,
} from "@/controllers/globalController.js";

const router = express.Router();

router.get("/posts/popular", verifyToken, getPopularPosts);
router.get("/posts/search", verifyToken, getPostsByKeyword);
router.get("/subreddits/popular", verifyToken, getPopularSubreddits);
router.get("/subreddits/:name/info", verifyToken, getSubredditInfo);
router.get("/subreddits/:name/posts/popular", verifyToken, getPostsFromSubreddit);

export default router;
