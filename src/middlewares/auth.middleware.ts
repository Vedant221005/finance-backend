import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { verifyJwtToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Missing or invalid authorization header"));
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyJwtToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || !user.isActive) {
      throw new ApiError(401, "User is inactive or does not exist");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, "Invalid or expired token"));
  }
};
