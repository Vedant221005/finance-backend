"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const user_validator_1 = require("../../validators/user.validator");
const user_controller_1 = require("./user.controller");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use(auth_middleware_1.authenticate, (0, rbac_middleware_1.authorize)("ADMIN"));
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (ADMIN)
 */
exports.userRouter.get("/", (0, validate_middleware_1.validate)(user_validator_1.listUsersQuerySchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getAllUsers));
exports.userRouter.get("/:id", (0, validate_middleware_1.validate)(user_validator_1.userIdParamSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getUserById));
exports.userRouter.patch("/:id/role", (0, validate_middleware_1.validate)(user_validator_1.updateRoleSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.updateRole));
exports.userRouter.patch("/:id/active", (0, validate_middleware_1.validate)(user_validator_1.updateActiveStatusSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.updateActiveStatus));
exports.userRouter.delete("/:id", (0, validate_middleware_1.validate)(user_validator_1.userIdParamSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.deleteUser));
//# sourceMappingURL=user.route.js.map