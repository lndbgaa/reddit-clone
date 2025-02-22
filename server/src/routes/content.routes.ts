// File for shared routes

import verifyToken from "@/middleware/verifyToken.middleware.js";
import express from "express";

import {
  removeContent,
  saveContent,
  unsaveContent,
  updateContent,
  voteOnContent,
} from "@/controllers/content.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/:type/:id/vote", voteOnContent); // route to vote on a post or comment

router.post("/:type/:id/save", saveContent); // route to save a post or comment

router.post("/:type/:id/unsave", unsaveContent); // route to unsave a post or comment

router.patch("/:type/:id", updateContent); // route to edit a post or comment

router.delete("/:type/:id", removeContent); // route to delete a post or comment

export default router;
