import { UserDocument } from "@/models/User.model.js";
import { User } from "@/types/user.d.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { Request, Response } from "express";

import { fetchMyInfo, fetchUserInfo } from "@/services/reddit/users.service.js";

export const getMyInfo = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const accessToken = user.decryptAccessToken();

  const data: User | null = await fetchMyInfo(accessToken);

  if (!data) {
    throw new AppError({
      statusCode: 404,
      statusText: "Not Found",
      message: "Unable to retrieve current Reddit user information.",
    });
  }

  res.status(200).json({ success: true, data });
});

export const getUserInfo = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const accessToken = user.decryptAccessToken();

  const { username } = req.params;

  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Parameter 'username' is missing or invalid.",
    });
  }

  const data: User | null = await fetchUserInfo(accessToken, username);

  if (!data?.username) {
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
