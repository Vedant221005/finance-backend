"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const dashboard_controller_1 = require("./dashboard.controller");
exports.dashboardRouter = (0, express_1.Router)();
exports.dashboardRouter.use(auth_middleware_1.authenticate, (0, rbac_middleware_1.authorize)("VIEWER", "ANALYST", "ADMIN"));
/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dashboard totals, category breakdown, and recent transactions
 */
exports.dashboardRouter.get("/overview", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.overview));
exports.dashboardRouter.get("/totals", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.totals));
exports.dashboardRouter.get("/category-breakdown", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.categoryBreakdown));
exports.dashboardRouter.get("/recent-transactions", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.recentTransactions));
exports.dashboardRouter.get("/monthly-trends", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.monthlyTrends));
exports.dashboardRouter.get("/weekly-summary", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.weeklySummary));
//# sourceMappingURL=dashboard.route.js.map