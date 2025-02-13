import { IUserDocument } from "@/models/User.js";
import getPopularPostsService from "@/services/redditApi/getPopularPostsService.js";
import getPostCommentsService from "@/services/redditApi/getPostCommentsService.js";
import getPostsByKeywordService from "@/services/redditApi/getPostsByKeywordService.js";
import { IComment } from "@/types/Comment.js";
import { IPost } from "@/types/Post.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";

export const getPopularPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items: IPost[] = await getPopularPostsService(accessToken);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "No popular posts found.",
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getPostsByKeyword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { q } = req.query;

  if (!q || typeof q !== "string" || q.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Query parameter 'q' is missing or invalid.",
    });
  }

  const items: IPost[] = await getPostsByKeywordService(accessToken, q);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found for the search term: '${q}'`,
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getPostComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'id' is missing or invalid.",
    });
  }

  const items: IComment[] = await getPostCommentsService(accessToken, id);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: `No posts found with the provided ID '${id}' or the post has no comments.`,
    });
  }

  return res.status(200).json({ success: true, items });
});
