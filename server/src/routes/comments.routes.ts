import { createComment, getCommentById } from "@/controllers/comments.controller.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

const router = express.Router();

router.use(verifyToken);

router.post("/", createComment);
router.get("/:id", getCommentById);

export default router;
