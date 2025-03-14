import { IUserDocument } from "@/models/User.model.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { Request, Response } from "express";

import {
  deleteContent,
  editContent,
  submitSave,
  submitUnsave,
  submitVote,
} from "@/services/reddit/content.service.js";

function validateTypeAndId(req: Request) {
  const { id, type } = req.params;

  const validTypes = ["posts", "comments"];

  if (!validTypes.includes(type)) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Invalid 'type' parameter. Must be either 'posts' or 'comments'.",
    });
  }

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'id' is missing or invalid.",
    });
  }

  const prefix = type === "posts" ? "t3_" : "t1_";
  const finalId = `${prefix}${id}`;

  return { id: finalId, type };
}

export const voteOnContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id, type } = validateTypeAndId(req);

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
    "1": `${type === "posts" ? "Post" : "Comment"} upvoted successfully`,
    "-1": `${type === "posts" ? "Post" : "Comment"} downvoted successfully`,
    "0": `Vote removed from ${type === "posts" ? "Post" : "Comment"} successfully!`,
  };

  res.status(200).json({ success: true, message: messages[voteDirection] });
});

export const saveContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id, type } = validateTypeAndId(req);

  await submitSave(accessToken, id);

  res
    .status(200)
    .json({ success: true, message: `${type === "posts" ? "Post" : "Comment"} successfully saved!` });
});

export const unsaveContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id, type } = validateTypeAndId(req);

  await submitUnsave(accessToken, id);

  res
    .status(200)
    .json({ success: true, message: `${type === "posts" ? "Post" : "Comment"} successfully unsaved!` });
});

export const removeContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id, type } = validateTypeAndId(req);

  await deleteContent(accessToken, id);

  res
    .status(200)
    .json({ success: true, message: `${type === "posts" ? "Post" : "Comment"} successfully deleted!` });
});

export const updateContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id, type } = validateTypeAndId(req);

  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'text' is missing or invalid. Must be a non-empty string.",
    });
  }

  await editContent(accessToken, id, text);

  res
    .status(200)
    .json({ success: true, message: `${type === "posts" ? "Post" : "Comment"} successfully updated!` });
});
