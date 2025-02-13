import verifyAuth from "@/middleware/verifyAuth.js";
import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import {
  getPopularPosts,
  getPostComments,
  getPostsByKeyword,
  voteOnPost,
} from "@/controllers/postsController.js";

const router = express.Router();

router.get("/popular", verifyAuth, verifyToken, getPopularPosts);
router.get("/search", verifyAuth, verifyToken, getPostsByKeyword);
router.post("/:postId/vote", verifyAuth, verifyToken, voteOnPost);
router.get("/:postId/comments", verifyAuth, verifyToken, getPostComments);
//router.post("/:postId/comments/:commentId/vote", verifyAuth, verifyToken, voteOnComment);

export default router;
