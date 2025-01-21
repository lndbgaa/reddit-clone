const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    console.error(`❌ AppError: ${err.toString()}`);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || null,
    });
  }

  if (err.response) {
    console.error("❌ Reddit API Response Error:", err.response);

    const statusCode = err.response.status;
    const errorMessage =
      err.response?.data?.error?.message || "Reddit API error";

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }

  if (err.request) {
    console.error("❌ Request Error (Network or Timeout):", err.request);

    return res.status(503).json({
      success: false,
      message: "Network error: Reddit API unavailable. Please try again later.",
    });
  }

  console.error("❌ Unexpected Error:", err);

  return res.status(500).json({
    success: false,
    message: err.message || "An unexpected error occurred.",
  });
};
