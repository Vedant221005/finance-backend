"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_validator_1 = require("../../validators/auth.validator");
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.authRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     security: []
 *     summary: Register a new user
 */
exports.authRouter.post("/register", (0, validate_middleware_1.validate)(auth_validator_1.registerSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.register));
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     security: []
 *     summary: Login with email and password
 */
exports.authRouter.post("/login", (0, validate_middleware_1.validate)(auth_validator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.login));
//# sourceMappingURL=auth.route.js.map