import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  getPopularSubreddits,
  getSubredditDetails,
  getSubredditPopularPosts,
} from "@/controllers/subreddits.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/popular", getPopularSubreddits);
router.get("/:name", getSubredditDetails);
router.get("/:name/posts/popular", getSubredditPopularPosts);

export default router;
