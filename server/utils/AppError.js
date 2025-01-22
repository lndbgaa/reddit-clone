const config = require("../config/environment");

module.exports = class extends Error {
  constructor({
    message = "Internal Server Error",
    statusCode = 500,
    statusText = "Unknown Error",
    context = "Unknown",
    details = {},
  }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.context = context;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      statusText: this.statusText,
      message: this.message,
      details: config.env === "development" ? this.details : {},
    };
  }
};
