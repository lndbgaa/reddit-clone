import { IUserDocument } from "@/models/User.js";
import getPopularPostsService from "@/services/redditApi/getPopularPostsService.js";
import getPopularSubredditsService from "@/services/redditApi/getPopularSubredditsService.js";
import getPostsByKeywordService from "@/services/redditApi/getPostsByKeywordService.js";
import getPostsFromSubredditService from "@/services/redditApi/getPostsFromSubredditService.js";
import { IPost } from "@/types/post.js";
import { ISubreddit } from "@/types/subreddit.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";

export const getPopularSubreddits = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items: ISubreddit[] = await getPopularSubredditsService(accessToken);

  return res.status(200).json({ success: true, items });
});

export const getPopularPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items: IPost[] = await getPopularPostsService(accessToken);

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
      context: "Post search",
      message: "Query parameter 'q' is missing or invalid.",
    });
  }

  const items: IPost[] = await getPostsByKeywordService(accessToken, q as string);

  return res.status(200).json({ success: true, items });
});

export const getPostsFromSubreddit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { name } = req.params;

  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      context: "Post search",
      message: "Parameter 'name' is missing or invalid.",
    });
  }

  const items: IPost[] = await getPostsFromSubredditService(accessToken, name);

  return res.status(200).json({ success: true, items });
});
