import config from "@/config/app.config.js";
import AppError from "@/utils/AppError.js";
import logError from "@/utils/logError.utils.js";
import { AxiosError } from "axios";

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    const { statusCode, statusText, message, details, stack } = err;

    logError({ type: "AppError", statusCode, statusText, message, details, stack });

    res.status(statusCode).json({
      success: false,
      statusCode,
      statusText,
      message,
      details: config.env === "development" ? details : {},
    });
  } else if (err instanceof AxiosError) {
    if (err.response) {
      const statusCode = err.response.status;
      const statusText = err.response.statusText;
      const message = err.response.data.error.message || "An error occurred with the external service.";
      const stack = err.stack ?? null;

      const details = {
        url: err.config?.url ?? "Unknown",
        method: err.config?.method ? err.config?.method.toUpperCase() : "Unknown",
      };

      logError({ type: "External Service Response Error", statusCode, statusText, message, details, stack });

      res.status(statusCode).json({
        success: false,
        statusCode,
        statusText,
        message,
        details: config.env === "development" ? details : {},
      });
    } else if (err.request) {
      const statusCode = 503;
      const statusText = "Network Error or Timeout";
      const message = "The request could not be completed. Please try again later.";
      const stack = err.stack ?? null;

      const details = {
        url: err.config?.url ?? "Unknown",
        method: err.config?.method?.toUpperCase() ?? "Unknown",
        errorType: err.code === "ECONNABORTED" ? "Timeout" : "Network Error",
      };

      logError({ type: "External Service Request Error", statusCode, statusText, message, details, stack });

      res.status(503).json({
        success: false,
        statusCode,
        statusText,
        message,
        details: config.env === "development" ? details : {},
      });
    }
  } else {
    const statusCode = 500;
    const statusText = "Internal Server Error";
    const message = err.message || "An unexpected error occurred.";
    const stack = err.stack || null;

    logError({ type: "Unexpected Error", statusCode, statusText, message, stack });

    res.status(statusCode).json({
      success: false,
      statusCode,
      statusText,
      message,
    });
  }
};

export default errorHandler;
