import { IUserDocument } from "@models/User.js";
import getPopularSubredditsService from "@services/redditApi/getPopularSubredditsService.js";
import catchAsync from "@utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";

export const getPopularSubreddits = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const items = await getPopularSubredditsService(accessToken);

  if (!items || items.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No popular subreddits found.",
      items: [],
    });
  }

  return res.status(200).json({ success: true, items });
});
