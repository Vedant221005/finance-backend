import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/rbac.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { dashboardController } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize("VIEWER", "ANALYST", "ADMIN"));

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dashboard totals, category breakdown, and recent transactions
 */
dashboardRouter.get("/overview", asyncHandler(dashboardController.overview));
dashboardRouter.get("/totals", asyncHandler(dashboardController.totals));
dashboardRouter.get("/category-breakdown", asyncHandler(dashboardController.categoryBreakdown));
dashboardRouter.get("/recent-transactions", asyncHandler(dashboardController.recentTransactions));
dashboardRouter.get("/monthly-trends", asyncHandler(dashboardController.monthlyTrends));
dashboardRouter.get("/weekly-summary", asyncHandler(dashboardController.weeklySummary));
