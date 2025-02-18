import { IUserDocument } from "@/models/User.model.js";
import {
  fetchCommentsForPost,
  fetchPopularPosts,
  fetchPostsByKeyword,
  submitPost,
} from "@/services/reddit/posts.service.js";
import { IComment } from "@/types/Comment.type.js";
import { IPost } from "@/types/Post.type.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { isValidUrl } from "@/utils/validators.utils.js";
import { Request, Response } from "express";

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { subreddit, title, kind, text, url } = req.body;

  if (!subreddit || typeof subreddit !== "string" || subreddit.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'subreddit' is missing or invalid. Must be a non-empty string.",
    });
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'title' is missing or invalid. Must be a non-empty string.",
    });
  }

  const validKind = ["self", "link"];

  if (!validKind.includes(kind)) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'kind' is missing or invalid. Must be either 'self' or 'link'.",
    });
  }

  if (kind === "self" && (!text || text.trim() === "")) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'text' is required for self posts. Must be a non-empty string.",
    });
  }

  if (kind === "link" && (!url || !isValidUrl(url) || url.trim() === "")) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'url' is required for link posts. Must be a valid URL.",
    });
  }

  await submitPost(accessToken, { subreddit, title, kind, text, url });

  res.status(200).json({ success: true, message: "Post successfully created!" });
});

export const searchPosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { q } = req.query;

  if (!q || typeof q !== "string" || q.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request query parameter 'q' is missing or invalid. Must be a non-empty string.",
    });
  }

  const items: IPost[] = await fetchPostsByKeyword(accessToken, q);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found for the search term: '${q}'`,
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getPopularPosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items: IPost[] = await fetchPopularPosts(accessToken);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "No popular posts found.",
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getCommentsForPost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request parameter 'id' is missing or invalid. Must be a non-empty string.",
    });
  }

  const items: IComment[] = await fetchCommentsForPost(accessToken, id);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found with the provided ID '${id}' or the post has no comments.`,
    });
  }

  return res.status(200).json({ success: true, items });
});
