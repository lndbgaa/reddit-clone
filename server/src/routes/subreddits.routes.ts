import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  getPopularSubreddits,
  getSubredditDetails,
  getSubredditPopularPosts,
} from "@/controllers/subreddits.controller.js";

const router = express.Router();

router.get("/popular", verifyAuth, verifyToken, getPopularSubreddits);
router.get("/:name/details", verifyAuth, verifyToken, getSubredditDetails);
router.get("/:name/posts/popular", verifyAuth, verifyToken, getSubredditPopularPosts);

export default router;
