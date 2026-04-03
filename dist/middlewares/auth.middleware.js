"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
const authenticate = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next(new apiError_1.ApiError(401, "Missing or invalid authorization header"));
        return;
    }
    try {
        const token = authHeader.split(" ")[1];
        const payload = (0, jwt_1.verifyJwtToken)(token);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user || !user.isActive) {
            throw new apiError_1.ApiError(401, "User is inactive or does not exist");
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof apiError_1.ApiError) {
            next(error);
            return;
        }
        next(new apiError_1.ApiError(401, "Invalid or expired token"));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map