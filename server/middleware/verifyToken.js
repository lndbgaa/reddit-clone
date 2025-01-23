const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const getNewToken = require("../services/redditApi/getNewToken");

module.exports = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new AppError({
      statusCode: 401,
      statusText: "Unauthorized",
      context: "Token Validation",
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
      context: "Token Refresh",
      message: "Refresh token is missing or invalid.",
    });
  }

  const data = await getNewToken(refreshToken);

  if (!data || !data.accessToken) {
    throw new AppError({
      statusCode: 500,
      statusText: "Internal Server Error",
      context: "Token Refresh",
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
