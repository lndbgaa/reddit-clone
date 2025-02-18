import verifyAuth from "@/middleware/verifyAuth.middleware.js";
import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import { voteOnContent } from "@/controllers/vote.controller.js";

const router = express.Router();

router.use(verifyAuth, verifyToken);

router.post("/:type/:id/vote", voteOnContent); // type = "posts" or "comments"

export default router;
