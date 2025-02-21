import { fetchNewToken } from "@/services/reddit/token.service.js";
import AppError from "@/utils/AppError.js";
import catchAsync from "@/utils/catchAsync.utils.js";
import { NextFunction, Request, Response } from "express";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    throw new AppError({
      statusCode: 401,
      statusText: "Unauthorized",
      message: "User must be logged in to access this resource.",
    });
  }

  const user = req.user;

  const now = Date.now();
  const expirationTime = user.access_token_expiration;

  if (expirationTime && expirationTime > now) {
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
      statusCode: 500,
      statusText: "Internal Server Error",
      message: "Failed to retrieve new tokens from Reddit API",
    });
  }

  user.access_token = data.accessToken;
  user.access_token_expiration = Date.now() + data.expiresIn * 1000; // milliseconds

  if (data.refreshToken) {
    user.refresh_token = data.refreshToken;
  }

  await user.save();

  return next();
});
