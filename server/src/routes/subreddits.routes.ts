import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  getPopularSubreddits,
  getSubredditDetails,
  getSubredditPopularPosts,
} from "@/controllers/subreddits.controller.js";

const router = express.Router();

router.use(verifyAuth, verifyToken);

router.get("/popular", getPopularSubreddits);
router.get("/:name/details", getSubredditDetails);
router.get("/:name/posts/popular", getSubredditPopularPosts);

export default router;
