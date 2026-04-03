import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(2),
    date: z.string().datetime(),
    notes: z.string().max(500).optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      amount: z.number().positive().optional(),
      type: z.enum(["INCOME", "EXPENSE"]).optional(),
      category: z.string().min(2).optional(),
      date: z.string().datetime().optional(),
      notes: z.string().max(500).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required for update",
    }),
});

export const transactionIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const listTransactionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["date", "amount", "category", "type", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
