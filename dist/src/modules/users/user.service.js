"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = require("../../config/prisma");
const apiError_1 = require("../../utils/apiError");
const sanitizeUser = {
    id: true,
    email: true,
    name: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};
exports.userService = {
    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: sanitizeUser,
            }),
            prisma_1.prisma.user.count(),
        ]);
        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async getUserById(id) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id }, select: sanitizeUser });
        if (!user) {
            throw new apiError_1.ApiError(404, "User not found");
        }
        return user;
    },
    async updateRole(id, role) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new apiError_1.ApiError(404, "User not found");
        }
        return prisma_1.prisma.user.update({
            where: { id },
            data: { role },
            select: sanitizeUser,
        });
    },
    async updateActiveStatus(id, isActive) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new apiError_1.ApiError(404, "User not found");
        }
        return prisma_1.prisma.user.update({
            where: { id },
            data: { isActive },
            select: sanitizeUser,
        });
    },
    async deleteUser(id) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new apiError_1.ApiError(404, "User not found");
        }
        await prisma_1.prisma.user.delete({ where: { id } });
    },
};
//# sourceMappingURL=user.service.js.map