import { IUserDocument } from "@/models/User.model.js";
import { submitVote } from "@/services/reddit/vote.service.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { Request, Response } from "express";

export const voteOnContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { type } = req.params;

  const validTypes = ["posts", "comments"];

  if (!validTypes.includes(type)) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Invalid 'type' parameter. Must be 'posts' or 'comments'.",
    });
  }

  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'id' is missing or invalid.",
    });
  }

  const { voteDirection }: { voteDirection: "1" | "-1" | "0" } = req.body;

  const validDirections = ["1", "-1", "0"];

  if (!validDirections.includes(voteDirection)) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Invalid vote direction. Use 1 for upvote, -1 for downvote, or 0 to remove your vote.",
    });
  }

  await submitVote(accessToken, id, type, voteDirection);

  const messages = {
    "1": "Upvote successful",
    "-1": "Downvote successful",
    "0": "Vote successfully removed!",
  };

  res.status(200).json({ success: true, message: messages[voteDirection] });
});
