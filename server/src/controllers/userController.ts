import { IUserDocument } from "@/models/User.js";
import getMyInfoService from "@/services/redditApi/getMyInfoService";
import getUserInfoService from "@/services/redditApi/getUserInfoService";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const getMyInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const data = await getMyInfoService(accessToken);

  if (!data || !data.username) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "Unable to retrieve current Reddit user information.",
    });
  }

  res.status(200).json({ success: true, data });
});

export const getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument;
  const accessToken = user.decryptAccessToken();

  const { username } = req.params;

  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'username' is missing or invalid.",
    });
  }

  const data = await getUserInfoService(accessToken, username);

  if (!data || !data.username) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "Unable to retrieve Reddit user information.",
      details: {
        username,
        reason: "The account may not exist or access is restricted.",
      },
    });
  }

  return res.status(200).json({ success: true, data });
});
