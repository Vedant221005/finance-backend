import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/rbac.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate.middleware";
import {
  listUsersQuerySchema,
  updateActiveStatusSchema,
  updateRoleSchema,
  userIdParamSchema,
} from "../../validators/user.validator";
import { userController } from "./user.controller";

export const userRouter = Router();

userRouter.use(authenticate, authorize("ADMIN"));

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (ADMIN)
 */
userRouter.get("/", validate(listUsersQuerySchema), asyncHandler(userController.getAllUsers));
userRouter.get("/:id", validate(userIdParamSchema), asyncHandler(userController.getUserById));
userRouter.patch("/:id/role", validate(updateRoleSchema), asyncHandler(userController.updateRole));
userRouter.patch(
  "/:id/active",
  validate(updateActiveStatusSchema),
  asyncHandler(userController.updateActiveStatus),
);
userRouter.delete("/:id", validate(userIdParamSchema), asyncHandler(userController.deleteUser));
