"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const prisma_1 = require("../../config/prisma");
const apiError_1 = require("../../utils/apiError");
const getOwnershipFilter = (userId, role) => {
    if (role === "ADMIN") {
        return {};
    }
    return { userId };
};
exports.transactionService = {
    async create(payload, user) {
        return prisma_1.prisma.transaction.create({
            data: {
                amount: payload.amount,
                type: payload.type,
                category: payload.category,
                date: new Date(payload.date),
                notes: payload.notes,
                userId: user.id,
            },
        });
    },
    async list(query, user) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            isDeleted: false,
            ...getOwnershipFilter(user.id, user.role),
            ...(query.type ? { type: query.type } : {}),
            ...(query.category ? { category: { contains: query.category } } : {}),
            ...(query.search
                ? {
                    OR: [
                        { category: { contains: query.search } },
                        { notes: { contains: query.search } },
                    ],
                }
                : {}),
            ...(query.startDate || query.endDate
                ? {
                    date: {
                        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
                        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
                    },
                }
                : {}),
        };
        const sortBy = query.sortBy ?? "date";
        const sortOrder = query.sortOrder ?? "desc";
        const [data, total] = await Promise.all([
            prisma_1.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma_1.prisma.transaction.count({ where }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async getById(id, user) {
        const transaction = await prisma_1.prisma.transaction.findUnique({ where: { id } });
        if (!transaction || transaction.isDeleted) {
            throw new apiError_1.ApiError(404, "Transaction not found");
        }
        if (user.role !== "ADMIN" && transaction.userId !== user.id) {
            throw new apiError_1.ApiError(403, "Forbidden: access denied");
        }
        return transaction;
    },
    async update(id, payload, user) {
        const existing = await prisma_1.prisma.transaction.findUnique({ where: { id } });
        if (!existing || existing.isDeleted) {
            throw new apiError_1.ApiError(404, "Transaction not found");
        }
        if (user.role !== "ADMIN" && existing.userId !== user.id) {
            throw new apiError_1.ApiError(403, "Forbidden: access denied");
        }
        return prisma_1.prisma.transaction.update({
            where: { id },
            data: {
                ...payload,
                ...(payload.date ? { date: new Date(payload.date) } : {}),
            },
        });
    },
    async softDelete(id, user) {
        const existing = await prisma_1.prisma.transaction.findUnique({ where: { id } });
        if (!existing || existing.isDeleted) {
            throw new apiError_1.ApiError(404, "Transaction not found");
        }
        if (user.role !== "ADMIN" && existing.userId !== user.id) {
            throw new apiError_1.ApiError(403, "Forbidden: access denied");
        }
        await prisma_1.prisma.transaction.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=transaction.service.js.map