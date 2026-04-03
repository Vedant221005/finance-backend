import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";

type DashboardUser = {
  id: string;
  role: Role;
};

const whereScope = (user: DashboardUser): Prisma.TransactionWhereInput => {
  if (user.role === "ADMIN" || user.role === "ANALYST") {
    return { isDeleted: false };
  }

  return {
    isDeleted: false,
    userId: user.id,
  };
};

export const dashboardService = {
  async getTotals(user: DashboardUser) {
    const where = whereScope(user);

    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({ where: { ...where, type: "INCOME" }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { ...where, type: "EXPENSE" }, _sum: { amount: true } }),
    ]);

    const totalIncome = incomeAgg._sum.amount ?? 0;
    const totalExpenses = expenseAgg._sum.amount ?? 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  },

  async getCategoryBreakdown(user: DashboardUser) {
    return prisma.transaction.groupBy({
      by: ["category", "type"],
      where: whereScope(user),
      _sum: { amount: true },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });
  },

  async getRecentTransactions(user: DashboardUser) {
    return prisma.transaction.findMany({
      where: whereScope(user),
      orderBy: { date: "desc" },
      take: 5,
    });
  },

  async getOverview(user: DashboardUser) {
    const [totals, categoryBreakdown, recentTransactions] = await Promise.all([
      dashboardService.getTotals(user),
      dashboardService.getCategoryBreakdown(user),
      dashboardService.getRecentTransactions(user),
    ]);

    return {
      ...totals,
      categoryBreakdown,
      recentTransactions,
    };
  },

  async getMonthlyTrends(user: DashboardUser) {
    const userCondition =
      user.role === "ADMIN" || user.role === "ANALYST"
        ? Prisma.empty
        : Prisma.sql`AND "userId" = ${user.id}`;

    return prisma.$queryRaw<
      Array<{
        month: string;
        income: number;
        expense: number;
      }>
    >(
      Prisma.sql`
        SELECT
          strftime('%Y-%m', date) as month,
          CAST(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS REAL) as income,
          CAST(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS REAL) as expense
        FROM "Transaction"
        WHERE isDeleted = 0
        ${userCondition}
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      `,
    );
  },

  async getWeeklySummary(user: DashboardUser) {
    const userCondition =
      user.role === "ADMIN" || user.role === "ANALYST"
        ? Prisma.empty
        : Prisma.sql`AND "userId" = ${user.id}`;

    return prisma.$queryRaw<
      Array<{
        day: string;
        income: number;
        expense: number;
      }>
    >(
      Prisma.sql`
        SELECT
          strftime('%Y-%m-%d', date) as day,
          CAST(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS REAL) as income,
          CAST(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS REAL) as expense
        FROM "Transaction"
        WHERE isDeleted = 0
          AND date >= datetime('now', '-7 days')
          ${userCondition}
        GROUP BY day
        ORDER BY day DESC
      `,
    );
  },
};
