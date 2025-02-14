import { fetchNewToken } from "@/services/reddit/token.service.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { NextFunction, Request, Response } from "express";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    throw new AppError({
      statusCode: 401,
      statusText: "Unauthorized",
      message: "No user is authenticated, unable to verify token",
    });
  }

  const now = Date.now();
  const expirationTime = user.access_token_expiration;

  if (expirationTime && expirationTime > now) {
    console.log("✅ User access token still valid!");
    return next();
  }

  const refreshToken = user.decryptRefreshToken();

  if (!refreshToken) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Refresh token is missing or invalid.",
    });
  }

  const data = await fetchNewToken(refreshToken);

  if (!data) {
    throw new AppError({
      message: "Failed to retrieve new tokens from Reddit API",
    });
  }

  user.access_token = data.accessToken;
  user.access_token_expiration = Date.now() + data.expiresIn * 1000; // milliseconds

  if (data.refreshToken) {
    user.refresh_token = data.refreshToken;
  }

  console.log("✅ User access token refreshed successfully!");

  await user.save();
  return next();
});
