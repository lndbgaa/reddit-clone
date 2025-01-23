const config = require("../config/config");
const AppError = require("../utils/AppError");
const logError = require("../utils/logError");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    const { statusCode, statusText, context, message, details, stack } = err;

    logError({ type: "AppError", statusCode, statusText, context, message, details, stack });

    return res.status(statusCode).json({
      success: false,
      statusCode,
      statusText,
      context,
      message,
      details: config.env === "development" ? details : {},
    });
  }

  if (err.response) {
    const statusCode = err.response && err.response.status ? err.response.status : 500;
    const statusText = err.response && err.response.statusText ? err.response.statusText : "Unknown Error";
    const context = err.context || "Unknown";
    const message =
      err.response?.data?.error?.message ||
      (statusText !== "Unknown Error"
        ? "No detailed message provided by the external service."
        : "The external service returned an unknown error.");
    const details = {
      url: err.config?.url || "Unknown",
      method: err.config?.method.toUpperCase() || "Unknown",
      params: err.config?.params || "No params",
      timestamp: new Date().toISOString(),
    };
    const stack = err.stack || undefined;

    logError({ type: "Response Error", statusCode, statusText, context, message, details, stack });

    return res.status(statusCode).json({
      success: false,
      statusCode,
      statusText,
      context,
      message,
      details: config.env === "development" ? details : {},
    });
  }

  if (err.request) {
    const statusCode = 503;
    const statusText = "Network Error or Timeout";
    const context = err.context || "Unknown";
    const message = "The request could not be completed. Please try again later.";
    const details = {
      url: err.config?.url || "Unknown",
      method: err.config?.method.toUpperCase() || "Unknown",
      errorType: err.code === "ECONNABORTED" ? "Timeout" : "Network Error",
    };
    const stack = err.stack || null;

    logError({ type: "Request Error", statusCode, statusText, context, message, details, stack });

    return res.status(503).json({
      success: false,
      statusCode,
      statusText,
      context,
      message,
      details: config.env === "development" ? details : {},
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
