"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = require("../../config/prisma");
const apiError_1 = require("../../utils/apiError");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const sanitizeUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
exports.authService = {
    async register(payload) {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
        if (existing) {
            throw new apiError_1.ApiError(409, "Email is already registered");
        }
        const hashedPassword = await (0, password_1.hashPassword)(payload.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
            },
        });
        const token = (0, jwt_1.signJwtToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: sanitizeUser(user),
            token,
            expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
        };
    },
    async login(payload) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
        if (!user) {
            throw new apiError_1.ApiError(401, "Invalid email or password");
        }
        if (!user.isActive) {
            throw new apiError_1.ApiError(403, "User account is deactivated");
        }
        const passwordMatched = await (0, password_1.comparePassword)(payload.password, user.password);
        if (!passwordMatched) {
            throw new apiError_1.ApiError(401, "Invalid email or password");
        }
        const token = (0, jwt_1.signJwtToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: sanitizeUser(user),
            token,
            expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
        };
    },
};
//# sourceMappingURL=auth.service.js.map