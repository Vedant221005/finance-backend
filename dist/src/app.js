"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_1 = require("./modules/auth");
const users_1 = require("./modules/users");
const transactions_1 = require("./modules/transactions");
const dashboard_1 = require("./modules/dashboard");
const health_route_1 = require("./modules/health/health.route");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((0, morgan_1.default)("dev"));
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many auth requests. Please try again later.",
    },
});
exports.app.use("/api/auth", authRateLimiter, auth_1.authRouter);
exports.app.use("/api/users", users_1.userRouter);
exports.app.use("/api/transactions", transactions_1.transactionRouter);
exports.app.use("/api/dashboard", dashboard_1.dashboardRouter);
exports.app.use("/api", health_route_1.healthRouter);
exports.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
exports.app.use(error_middleware_1.notFoundMiddleware);
exports.app.use(error_middleware_1.errorMiddleware);
//# sourceMappingURL=app.js.map