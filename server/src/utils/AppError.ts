class AppError extends Error {
  statusCode: number;
  statusText: string;
  details: Record<string, unknown>;

  constructor({
    statusCode = 500,
    statusText = "Internal Server Error",
    message = "Unknown Error",
    details = {},
  }) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
