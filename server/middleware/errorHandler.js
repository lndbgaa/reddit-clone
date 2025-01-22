const chalk = require("chalk");
const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    console.error(chalk.red(`❌ AppError: ${err.toString()}`));
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (err.response) {
    const statusCode = err.response.status || 500;
    const statusText = err.response.statusText || "Unknown Error";
    const message = err.response?.data?.error?.message || "Reddit API Unknown error.";
    const details = err.response?.data
      ? JSON.stringify(err.response.data, null, 2)
      : null;

    console.error(
      chalk.red(
        `❌ Reddit API Error: (${statusCode}) ${statusText}\nMessage: ${message}\n${
          details ? `Details: ${details}\n` : ""
        }`
      )
    );

    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      details,
    });
  }

  if (err.request) {
    console.error(chalk.red("❌ Request Error (Network or Timeout):", err.request));
    return res.status(503).json({
      success: false,
      statusCode: 503,
      message: "Network error: Reddit API unavailable. Please try again later.",
    });
  }

  console.error(chalk.red("❌ Unexpected Error:", err));

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || "An unexpected error occurred.",
  });
};
