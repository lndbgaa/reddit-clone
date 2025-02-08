import getNewToken from "@services/redditApi/getNewToken.js";
import AppError from "@utils/AppError.js";
import catchAsync from "@utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    throw new AppError({
      statusCode: 401,
      statusText: "Unauthorized",
      context: "Token validation",
      message: "No user is authenticated, unable to verify token",
    });
  }

  const now = Date.now();
  const expirationTime = user.accessTokenExpiration;

  if (expirationTime && expirationTime > now) {
    console.log("✅ User access token still valid!");
    return next();
  }

  const refreshToken = user.decryptRefreshToken();

  if (!refreshToken) {
    throw new AppError({
      statusCode: 400,
      statusText: "Bad Request",
      context: "Token refresh",
      message: "Refresh token is missing or invalid.",
    });
  }

  const data = await getNewToken(refreshToken);

  if (!data || !data.accessToken) {
    throw new AppError({
      context: "Token refresh",
      message: "Failed to retrieve new tokens from Reddit API",
    });
  }

  user.accessToken = data.accessToken;
  user.accessTokenExpiration = Date.now() + data.expiresIn * 1000; // milliseconds

  if (data.refreshToken) {
    user.refreshToken = data.refreshToken;
  }

  console.log("✅ User access token refreshed successfully!");

  await user.save();
  next();
});
