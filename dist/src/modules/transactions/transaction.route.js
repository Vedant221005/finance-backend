"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const transaction_validator_1 = require("../../validators/transaction.validator");
const transaction_controller_1 = require("./transaction.controller");
exports.transactionRouter = (0, express_1.Router)();
exports.transactionRouter.use(auth_middleware_1.authenticate, (0, rbac_middleware_1.authorize)("ANALYST", "ADMIN"));
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: List transactions with filters
 */
exports.transactionRouter.get("/", (0, validate_middleware_1.validate)(transaction_validator_1.listTransactionsSchema), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.list));
exports.transactionRouter.post("/", (0, validate_middleware_1.validate)(transaction_validator_1.createTransactionSchema), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.create));
exports.transactionRouter.get("/:id", (0, validate_middleware_1.validate)(transaction_validator_1.transactionIdParamSchema), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.getById));
exports.transactionRouter.patch("/:id", (0, validate_middleware_1.validate)(transaction_validator_1.updateTransactionSchema), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.update));
exports.transactionRouter.delete("/:id", (0, validate_middleware_1.validate)(transaction_validator_1.transactionIdParamSchema), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.remove));
//# sourceMappingURL=transaction.route.js.map