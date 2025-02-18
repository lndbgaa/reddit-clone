import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  createPost,
  getCommentsForPost,
  getPopularPosts,
  searchPosts,
} from "@/controllers/posts.controller.js";

const router = express.Router();

router.use(verifyAuth, verifyToken);

router.post("/", createPost);
router.get("/search", searchPosts);
router.get("/popular", getPopularPosts);
router.get("/:id/comments", getCommentsForPost);

export default router;
