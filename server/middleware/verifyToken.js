const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const getNewToken = require("../services/redditApi/getNewToken");

module.exports = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new AppError({
      statusCode: 401,
      statusText: "Unauthorized",
      message: "No user is authenticated",
    });
  }

  const now = Date.now();
  const expirationTime = user.accessTokenExpiration;

  if (expirationTime && expirationTime > now) {
    console.log("✅ User access token still valid!");
    return next();
  }

  const data = await getNewToken(user.refreshToken);

  user.accessToken = data.accessToken;
  user.accessTokenExpiration = Date.now() + data.expiresIn * 1000; // milliseconds
  user.refreshToken = data.refreshToken;

  console.log("✅ User access token refreshed successfully!");

  await user.save();
  next();
});
