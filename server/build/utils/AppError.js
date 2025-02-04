class AppError extends Error {
    statusCode;
    statusText;
    context;
    details;
    constructor({ statusCode = 500, statusText = "Unknown Error", context = "Unknown", message = "Internal Server Error", details = {}, }) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.context = context;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map