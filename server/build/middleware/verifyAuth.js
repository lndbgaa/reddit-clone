import AppError from "../utils/AppError.js";
export default (req, res, next) => {
    if (!req.isAuthenticated()) {
        throw new AppError({
            statusCode: 401,
            statusText: "Unauthorized",
            context: "Resource access attempt",
            message: "User must be logged in to access this resource.",
            details: {
                url: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
        });
    }
    next();
};
//# sourceMappingURL=verifyAuth.js.map