"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const whereScope = (user) => {
    if (user.role === "ADMIN" || user.role === "ANALYST") {
        return { isDeleted: false };
    }
    return {
        isDeleted: false,
        userId: user.id,
    };
};
exports.dashboardService = {
    async getTotals(user) {
        const where = whereScope(user);
        const [incomeAgg, expenseAgg] = await Promise.all([
            prisma_1.prisma.transaction.aggregate({ where: { ...where, type: "INCOME" }, _sum: { amount: true } }),
            prisma_1.prisma.transaction.aggregate({ where: { ...where, type: "EXPENSE" }, _sum: { amount: true } }),
        ]);
        const totalIncome = incomeAgg._sum.amount ?? 0;
        const totalExpenses = expenseAgg._sum.amount ?? 0;
        return {
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses,
        };
    },
    async getCategoryBreakdown(user) {
        return prisma_1.prisma.transaction.groupBy({
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
    async getRecentTransactions(user) {
        return prisma_1.prisma.transaction.findMany({
            where: whereScope(user),
            orderBy: { date: "desc" },
            take: 5,
        });
    },
    async getOverview(user) {
        const [totals, categoryBreakdown, recentTransactions] = await Promise.all([
            exports.dashboardService.getTotals(user),
            exports.dashboardService.getCategoryBreakdown(user),
            exports.dashboardService.getRecentTransactions(user),
        ]);
        return {
            ...totals,
            categoryBreakdown,
            recentTransactions,
        };
    },
    async getMonthlyTrends(user) {
        const userCondition = user.role === "ADMIN" || user.role === "ANALYST"
            ? client_1.Prisma.empty
            : client_1.Prisma.sql `AND "userId" = ${user.id}`;
        return prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
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
      `);
    },
    async getWeeklySummary(user) {
        const userCondition = user.role === "ADMIN" || user.role === "ANALYST"
            ? client_1.Prisma.empty
            : client_1.Prisma.sql `AND "userId" = ${user.id}`;
        return prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
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
      `);
    },
};
//# sourceMappingURL=dashboard.service.js.map