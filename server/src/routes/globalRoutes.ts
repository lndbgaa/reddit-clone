import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import {
  getPopularPosts,
  getPopularSubreddits,
  getPostsByKeyword,
  getPostsFromSubreddit,
} from "@/controllers/globalController.js";

const router = express.Router();

router.get("/posts", verifyToken, getPostsByKeyword);
router.get("/posts/popular", verifyToken, getPopularPosts);
router.get("/subreddits/popular", verifyToken, getPopularSubreddits);
router.get("/subreddits/:name/posts/popular", verifyToken, getPostsFromSubreddit);

export default router;
