import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  createPost,
  getCommentsForPost,
  getPopularPosts,
  getPostById,
  getPostsByKeyword,
  removePost,
} from "@/controllers/posts.controller.js";

const router = express.Router();

router.use(verifyAuth, verifyToken);

router.post("/", createPost);
router.get("/popular", getPopularPosts);
router.get("/search", getPostsByKeyword);
router.get("/:id/comments", getCommentsForPost);
router.get("/:id", getPostById);
router.patch("/:id"); // editPost
router.delete("/:id", removePost);

export default router;
