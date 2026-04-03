"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const apiError_1 = require("../../utils/apiError");
const dashboard_service_1 = require("./dashboard.service");
const getAuthUser = (req) => {
    if (!req.user) {
        throw new apiError_1.ApiError(401, "Unauthorized");
    }
    return req.user;
};
exports.dashboardController = {
    async totals(req, res) {
        const data = await dashboard_service_1.dashboardService.getTotals(getAuthUser(req));
        res.status(200).json({ success: true, message: "Dashboard totals fetched", data });
    },
    async categoryBreakdown(req, res) {
        const data = await dashboard_service_1.dashboardService.getCategoryBreakdown(getAuthUser(req));
        res.status(200).json({ success: true, message: "Category breakdown fetched", data });
    },
    async recentTransactions(req, res) {
        const data = await dashboard_service_1.dashboardService.getRecentTransactions(getAuthUser(req));
        res.status(200).json({ success: true, message: "Recent transactions fetched", data });
    },
    async overview(req, res) {
        const data = await dashboard_service_1.dashboardService.getOverview(getAuthUser(req));
        res.status(200).json({ success: true, message: "Dashboard overview fetched", data });
    },
    async monthlyTrends(req, res) {
        const data = await dashboard_service_1.dashboardService.getMonthlyTrends(getAuthUser(req));
        res.status(200).json({ success: true, message: "Monthly trends fetched", data });
    },
    async weeklySummary(req, res) {
        const data = await dashboard_service_1.dashboardService.getWeeklySummary(getAuthUser(req));
        res.status(200).json({ success: true, message: "Weekly summary fetched", data });
    },
};
//# sourceMappingURL=dashboard.controller.js.map