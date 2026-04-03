import { Prisma, Role, TransactionType } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";

type TransactionQuery = {
  page?: number;
  limit?: number;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: "date" | "amount" | "category" | "type" | "createdAt";
  sortOrder?: "asc" | "desc";
};

const getOwnershipFilter = (userId: string, role: Role): Prisma.TransactionWhereInput => {
  if (role === "ADMIN") {
    return {};
  }

  return { userId };
};

export const transactionService = {
  async create(
    payload: { amount: number; type: TransactionType; category: string; date: string; notes?: string },
    user: { id: string },
  ) {
    return prisma.transaction.create({
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

  async list(query: TransactionQuery, user: { id: string; role: Role }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
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
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.transaction.count({ where }),
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

  async getById(id: string, user: { id: string; role: Role }) {
    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction || transaction.isDeleted) {
      throw new ApiError(404, "Transaction not found");
    }

    if (user.role !== "ADMIN" && transaction.userId !== user.id) {
      throw new ApiError(403, "Forbidden: access denied");
    }

    return transaction;
  },

  async update(
    id: string,
    payload: {
      amount?: number;
      type?: TransactionType;
      category?: string;
      date?: string;
      notes?: string;
    },
    user: { id: string; role: Role },
  ) {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.isDeleted) {
      throw new ApiError(404, "Transaction not found");
    }

    if (user.role !== "ADMIN" && existing.userId !== user.id) {
      throw new ApiError(403, "Forbidden: access denied");
    }

    return prisma.transaction.update({
      where: { id },
      data: {
        ...payload,
        ...(payload.date ? { date: new Date(payload.date) } : {}),
      },
    });
  },

  async softDelete(id: string, user: { id: string; role: Role }) {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.isDeleted) {
      throw new ApiError(404, "Transaction not found");
    }

    if (user.role !== "ADMIN" && existing.userId !== user.id) {
      throw new ApiError(403, "Forbidden: access denied");
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  },
};
