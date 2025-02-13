import verifyAuth from "@/middleware/verifyAuth.js";
import verifyToken from "@/middleware/verifyToken.js";
import express from "express";

import { voteOnContent } from "@/controllers/voteController.js";

const router = express.Router();

router.post("/:type/:id/vote", verifyAuth, verifyToken, voteOnContent); // type = "posts" or "comments"

export default router;
