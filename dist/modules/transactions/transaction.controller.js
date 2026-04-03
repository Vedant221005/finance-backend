"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const apiError_1 = require("../../utils/apiError");
const transaction_service_1 = require("./transaction.service");
const getAuthUser = (req) => {
    if (!req.user) {
        throw new apiError_1.ApiError(401, "Unauthorized");
    }
    return req.user;
};
exports.transactionController = {
    async create(req, res) {
        const result = await transaction_service_1.transactionService.create(req.body, getAuthUser(req));
        res.status(201).json({ success: true, message: "Transaction created", data: result });
    },
    async list(req, res) {
        const result = await transaction_service_1.transactionService.list({
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            type: req.query.type,
            category: req.query.category,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        }, getAuthUser(req));
        res.status(200).json({ success: true, message: "Transactions fetched", ...result });
    },
    async getById(req, res) {
        const id = String(req.params.id);
        const result = await transaction_service_1.transactionService.getById(id, getAuthUser(req));
        res.status(200).json({ success: true, message: "Transaction fetched", data: result });
    },
    async update(req, res) {
        const id = String(req.params.id);
        const result = await transaction_service_1.transactionService.update(id, req.body, getAuthUser(req));
        res.status(200).json({ success: true, message: "Transaction updated", data: result });
    },
    async remove(req, res) {
        const id = String(req.params.id);
        await transaction_service_1.transactionService.softDelete(id, getAuthUser(req));
        res.status(200).json({ success: true, message: "Transaction deleted" });
    },
};
//# sourceMappingURL=transaction.controller.js.map