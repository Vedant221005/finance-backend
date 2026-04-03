import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { dashboardService } from "./dashboard.service";

const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return req.user;
};

export const dashboardController = {
  async totals(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getTotals(getAuthUser(req));
    res.status(200).json({ success: true, message: "Dashboard totals fetched", data });
  },

  async categoryBreakdown(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getCategoryBreakdown(getAuthUser(req));
    res.status(200).json({ success: true, message: "Category breakdown fetched", data });
  },

  async recentTransactions(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getRecentTransactions(getAuthUser(req));
    res.status(200).json({ success: true, message: "Recent transactions fetched", data });
  },

  async overview(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getOverview(getAuthUser(req));
    res.status(200).json({ success: true, message: "Dashboard overview fetched", data });
  },

  async monthlyTrends(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getMonthlyTrends(getAuthUser(req));
    res.status(200).json({ success: true, message: "Monthly trends fetched", data });
  },

  async weeklySummary(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getWeeklySummary(getAuthUser(req));
    res.status(200).json({ success: true, message: "Weekly summary fetched", data });
  },
};
