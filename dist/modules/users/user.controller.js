"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
exports.userController = {
    async getAllUsers(req, res) {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const result = await user_service_1.userService.getAllUsers(page, limit);
        res.status(200).json({ success: true, message: "Users fetched successfully", ...result });
    },
    async getUserById(req, res) {
        const id = String(req.params.id);
        const result = await user_service_1.userService.getUserById(id);
        res.status(200).json({ success: true, message: "User fetched successfully", data: result });
    },
    async updateRole(req, res) {
        const id = String(req.params.id);
        const result = await user_service_1.userService.updateRole(id, req.body.role);
        res.status(200).json({ success: true, message: "User role updated successfully", data: result });
    },
    async updateActiveStatus(req, res) {
        const id = String(req.params.id);
        const result = await user_service_1.userService.updateActiveStatus(id, req.body.isActive);
        res.status(200).json({ success: true, message: "User status updated successfully", data: result });
    },
    async deleteUser(req, res) {
        const id = String(req.params.id);
        await user_service_1.userService.deleteUser(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    },
};
//# sourceMappingURL=user.controller.js.map