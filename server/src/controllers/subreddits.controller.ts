import { IUserDocument } from "@/models/User.model.js";
import { Post } from "@/types/Post.type.js";
import { Subreddit } from "@/types/Subreddit.type.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { Request, Response } from "express";

import {
  fetchPopularSubreddits,
  fetchSubredditDetails,
  fetchSubredditPopularPosts,
} from "@/services/reddit/subreddits.service.js";

export const getSubredditDetails = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { name } = req.params;

  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'name' is missing or invalid.",
    });
  }

  const data: Subreddit | null = await fetchSubredditDetails(accessToken, name);

  if (!data) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "The subreddit does not exist or is empty.",
      details: {
        subreddit: `r/${name}`,
      },
    });
  }

  return res.status(200).json({ success: true, data });
});

export const getPopularSubreddits = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items: Subreddit[] = await fetchPopularSubreddits(accessToken);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "No popular subreddits found.",
    });
  }

  return res.status(200).json({ success: true, items });
});

export const getSubredditPopularPosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { name } = req.params;

  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'name' is missing or invalid.",
    });
  }

  const items: Post[] = await fetchSubredditPopularPosts(accessToken, name);

  if (!items || items.length === 0) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "The subreddit does not exist or is empty.",
      details: {
        subreddit: `r/${name}`,
      },
    });
  }

  return res.status(200).json({ success: true, items });
});
