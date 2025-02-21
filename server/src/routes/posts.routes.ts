import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  createPost,
  getCommentsForPost,
  getPopularPosts,
  getPostById,
  getPostsByKeyword,
  removePost,
  updatePost,
} from "@/controllers/posts.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createPost);
router.get("/popular", getPopularPosts);
router.get("/search", getPostsByKeyword);
router.get("/:id/comments", getCommentsForPost); // !!!
router.get("/:id", getPostById);
router.patch("/:id", updatePost);
router.delete("/:id", removePost);

export default router;
