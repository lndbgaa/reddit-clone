const config = require("../config/environment");
const AppError = require("../utils/AppError");
const logError = require("../utils/logError");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    logError({
      type: "AppError",
      statusCode: err.statusCode,
      statusText: err.statusText,
      context: err.context,
      message: err.message,
      details: err.details,
      stack: err.stack || null,
    });

    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err.response) {
    const statusCode = err.response?.status || 500;
    const statusText = err.response?.statusText || "Unknown Error";
    const context = err.context || "Unknown";
    const message =
      err.response?.data?.error?.message ||
      (statusText !== "Unknown Error"
        ? "No detailed message provided by the API."
        : "Reddit API Unknown error (No additional details provided).");
    const stack = err.stack || null;

    logError({ type: "Reddit API Error", statusCode, statusText, context, message, stack });

    return res.status(statusCode).json({
      success: false,
      statusCode,
      statusText,
      message,
    });
  }

  if (err.request) {
    const statusCode = 503;
    const statusText = "Network Error or Timeout";
    const message = "API unavailable. Please try again later.";
    const details = {
      url: err.config?.url || "Unknown URL",
      method: err.config?.method || "Unknown Method",
      errorType: err.code === "ECONNABORTED" ? "Timeout" : "Network Error",
    };

    logError({ type: "Request Error", statusCode, statusText, message, details });

    return res.status(503).json({
      success: false,
      statusCode,
      statusText,
      message,
      details: config.env === "development" ? details : undefined,
    });
  }

  const statusCode = 500;
  const statusText = err.statusText || "Internal Server Error";
  const message = err.message || "An unexpected error occurred.";
  const stack = err.stack || null;

  logError({ type: "Unexpected Error", statusCode, statusText, message, stack });

  return res.status(statusCode).json({
    success: false,
    statusCode,
    statusText,
    message,
  });
};
