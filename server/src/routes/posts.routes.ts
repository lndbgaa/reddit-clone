import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  createPost,
  getCommentsForPost,
  getPopularPosts,
  getPostById,
  getPostsByKeyword,
} from "@/controllers/posts.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createPost);
router.get("/popular", getPopularPosts);
router.get("/search", getPostsByKeyword);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentsForPost); // !!!

export default router;
