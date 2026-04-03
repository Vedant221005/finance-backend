"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const apiError_1 = require("../utils/apiError");
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new apiError_1.ApiError(401, "Unauthorized"));
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            next(new apiError_1.ApiError(403, "Forbidden: insufficient permissions"));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=rbac.middleware.js.map