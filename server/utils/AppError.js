module.exports = class extends Error {
  constructor({
    message = "Internal Server Error",
    statusCode = 500,
    statusText = "Unknown Error",
    details = null,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toString() {
    const stackLines = this.stack.split("\n");
    const formattedStack = stackLines.slice(1).join("\n");
    return `(${this.statusCode}) ${this.statusText}\nMessage: ${this.message}\n${
      this.details ? `Details: ${this.details}\n` : ""
    }${formattedStack}`;
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      statusText: this.statusText,
      message: this.message,
      details: this.details,
    };
  }
};
