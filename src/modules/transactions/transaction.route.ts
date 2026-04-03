import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/rbac.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createTransactionSchema,
  listTransactionsSchema,
  transactionIdParamSchema,
  updateTransactionSchema,
} from "../../validators/transaction.validator";
import { transactionController } from "./transaction.controller";

export const transactionRouter = Router();

transactionRouter.use(authenticate, authorize("ANALYST", "ADMIN"));

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: List transactions with filters
 */
transactionRouter.get("/", validate(listTransactionsSchema), asyncHandler(transactionController.list));
transactionRouter.post("/", validate(createTransactionSchema), asyncHandler(transactionController.create));
transactionRouter.get("/:id", validate(transactionIdParamSchema), asyncHandler(transactionController.getById));
transactionRouter.patch("/:id", validate(updateTransactionSchema), asyncHandler(transactionController.update));
transactionRouter.delete("/:id", validate(transactionIdParamSchema), asyncHandler(transactionController.remove));
