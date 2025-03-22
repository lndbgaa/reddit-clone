import { UserDocument } from "@/models/User.model.js";
import { fetchCommentById, submitComment } from "@/services/reddit/comments.service.js";
import { Comment } from "@/types/comment.d.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { Request, Response } from "express";

export const createComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const accessToken = user.decryptAccessToken();

  const { parent_type, parent_id, text } = req.body;

  const validParentTypes = ["post", "comment"];

  if (!validParentTypes.includes(parent_type.trim().toLowerCase())) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Invalid 'parent_type'. Must be either 'post' or 'comment'.",
    });
  }

  if (!parent_id || typeof parent_id !== "string" || parent_id.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'parent_id' is missing or invalid. Must be a non-empty string.",
    });
  }

  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'text' is missing or invalid. Must be a non-empty string.",
    });
  }

  const prefix = parent_type === "post" ? "t3_" : "t1_";
  const parent = `${prefix}${parent_id}`;

  await submitComment(accessToken, { parent, text });

  res.status(200).json({ success: true, message: "Comment successfully created!" });
});

export const getCommentById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const accessToken = user.decryptAccessToken();

  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request parameter 'id' is missing or invalid. Must be a non-empty string.",
    });
  }

  const data: Comment | null = await fetchCommentById(accessToken, id);

  if (!data) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No comment found with the provided ID '${id}'.`,
    });
  }

  res.status(200).json({ success: true, data });
});
