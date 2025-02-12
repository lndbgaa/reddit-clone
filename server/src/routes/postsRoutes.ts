import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import { getPopularPosts, getPostComments, getPostsByKeyword } from "@/controllers/postsController.js";

const router = express.Router();

router.get("/popular", verifyToken, getPopularPosts);
router.get("/search", verifyToken, getPostsByKeyword);
router.get("/:id/comments", verifyToken, getPostComments);

export default router;
