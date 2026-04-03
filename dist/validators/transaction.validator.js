"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactionsSchema = exports.transactionIdParamSchema = exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive(),
        type: zod_1.z.enum(["INCOME", "EXPENSE"]),
        category: zod_1.z.string().min(2),
        date: zod_1.z.string().datetime(),
        notes: zod_1.z.string().max(500).optional(),
    }),
});
exports.updateTransactionSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z
        .object({
        amount: zod_1.z.number().positive().optional(),
        type: zod_1.z.enum(["INCOME", "EXPENSE"]).optional(),
        category: zod_1.z.string().min(2).optional(),
        date: zod_1.z.string().datetime().optional(),
        notes: zod_1.z.string().max(500).optional(),
    })
        .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required for update",
    }),
});
exports.transactionIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
});
exports.listTransactionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
        type: zod_1.z.enum(["INCOME", "EXPENSE"]).optional(),
        category: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
        sortBy: zod_1.z.enum(["date", "amount", "category", "type", "createdAt"]).optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    }),
});
//# sourceMappingURL=transaction.validator.js.map