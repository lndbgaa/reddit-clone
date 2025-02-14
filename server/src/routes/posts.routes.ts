import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import { getPopularPosts, getPostComments, getPostsByKeyword } from "@/controllers/posts.controller.js";

const router = express.Router();

router.get("/popular", verifyAuth, verifyToken, getPopularPosts);
router.get("/search", verifyAuth, verifyToken, getPostsByKeyword);
router.get("/:id/comments", verifyAuth, verifyToken, getPostComments);

export default router;
