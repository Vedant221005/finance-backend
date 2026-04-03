import { Request, Response } from "express";
import { userService } from "./user.service";

export const userController = {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await userService.getAllUsers(page, limit);
    res.status(200).json({ success: true, message: "Users fetched successfully", ...result });
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const result = await userService.getUserById(id);
    res.status(200).json({ success: true, message: "User fetched successfully", data: result });
  },

  async updateRole(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const result = await userService.updateRole(id, req.body.role);
    res.status(200).json({ success: true, message: "User role updated successfully", data: result });
  },

  async updateActiveStatus(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const result = await userService.updateActiveStatus(id, req.body.isActive);
    res.status(200).json({ success: true, message: "User status updated successfully", data: result });
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    await userService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  },
};
