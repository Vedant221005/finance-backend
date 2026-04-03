"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.notFoundMiddleware = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const apiError_1 = require("../utils/apiError");
const notFoundMiddleware = (req, _res, next) => {
    next(new apiError_1.ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
exports.notFoundMiddleware = notFoundMiddleware;
const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof apiError_1.ApiError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            details: error.details ?? null,
        });
        return;
    }
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            details: error.flatten(),
        });
        return;
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({
            success: false,
            message: "Database request failed",
            details: { code: error.code, meta: error.meta },
        });
        return;
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ success: false, message });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map