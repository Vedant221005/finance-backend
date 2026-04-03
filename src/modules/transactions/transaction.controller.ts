import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { transactionService } from "./transaction.service";

const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  return req.user;
};

export const transactionController = {
  async create(req: Request, res: Response): Promise<void> {
    const result = await transactionService.create(req.body, getAuthUser(req));
    res.status(201).json({ success: true, message: "Transaction created", data: result });
  },

  async list(req: Request, res: Response): Promise<void> {
    const result = await transactionService.list(
      {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        type: req.query.type as "INCOME" | "EXPENSE" | undefined,
        category: req.query.category as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as "date" | "amount" | "category" | "type" | "createdAt" | undefined,
        sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      },
      getAuthUser(req),
    );

    res.status(200).json({ success: true, message: "Transactions fetched", ...result });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const result = await transactionService.getById(id, getAuthUser(req));
    res.status(200).json({ success: true, message: "Transaction fetched", data: result });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const result = await transactionService.update(id, req.body, getAuthUser(req));
    res.status(200).json({ success: true, message: "Transaction updated", data: result });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await transactionService.softDelete(id, getAuthUser(req));
    res.status(200).json({ success: true, message: "Transaction deleted" });
  },
};
