const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new AppError({
      statusCode: 401,
      statusText: "Unauthorized",
      message: "User must be logged in to access this resource.",
      details: {
        url: req.originalUrl,
        method: req.method,
      },
    });
  }

  next();
};
