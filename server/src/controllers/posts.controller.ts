import validatePost from "@/helpers/validatePost.helper.js";
import { IUserDocument } from "@/models/User.model.js";
import {
  deletePost,
  editPost,
  fetchCommentsForPost,
  fetchPopularPosts,
  fetchPostById,
  fetchPostsByKeyword,
  submitPost,
} from "@/services/reddit/posts.service.js";
import { Comment } from "@/types/Comment.type.js";
import { Post } from "@/types/Post.type.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { Request, Response } from "express";

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { subreddit, title, kind, text, url } = req.body;

  await validatePost(accessToken, { subreddit, title, kind, text, url });

  await submitPost(accessToken, { subreddit, title, kind, text, url });

  res.status(200).json({ success: true, message: "Post successfully created!" });
});

export const getPopularPosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items: Post[] = await fetchPopularPosts(accessToken);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "No popular posts found.",
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getPostsByKeyword = catchAsync(async (req: Request, res: Response) => {
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

  const items: Post[] = await fetchPostsByKeyword(accessToken, q);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found for the search term: '${q}'`,
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

  const items: Comment[] = await fetchCommentsForPost(accessToken, id);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found with the provided ID '${id}' or the post has no comments.`,
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getPostById = catchAsync(async (req: Request, res: Response) => {
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

  const data: Post | null = await fetchPostById(accessToken, id);

  if (!data) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found with the provided ID '${id}'.`,
    });
  }

  res.status(200).json({ success: "true", data });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
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

  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Request body parameter 'text' is missing or invalid. Must be a non-empty string.",
    });
  }

  await editPost(accessToken, id, text);

  res.status(200).json({ success: true, message: "Post successfully updated!" });
});

export const removePost = catchAsync(async (req: Request, res: Response) => {
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

  await deletePost(accessToken, id);

  res.status(200).json({ success: true, message: "Post successfully deleted!" });
});
