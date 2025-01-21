module.exports = class extends Error {
  constructor(message = "Internal Server Error", statusCode, details) {
    super(message);
    this.statusCode = statusCode || 500;
    this.details = details || null;
    //this.isOperational = true;
    //Error.captureStackTrace(this, this.constructor);
  }
  toString() {
    return `(${this.statusCode}) ${this.message}${
      this.details ? `: ${this.details}` : ""
    }`;
  }
};
