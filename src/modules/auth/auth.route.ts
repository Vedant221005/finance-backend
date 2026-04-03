import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../../validators/auth.validator";
import { asyncHandler } from "../../utils/asyncHandler";

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     security: []
 *     summary: Register a new user
 */
authRouter.post("/register", validate(registerSchema), asyncHandler(authController.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     security: []
 *     summary: Login with email and password
 */
authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
