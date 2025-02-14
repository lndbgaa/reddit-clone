import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import { voteOnContent } from "@/controllers/vote.controller.js";

const router = express.Router();

router.post("/:type/:id/vote", verifyAuth, verifyToken, voteOnContent); // type = "posts" or "comments"

export default router;
