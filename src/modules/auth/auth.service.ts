import { User } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { comparePassword, hashPassword } from "../../utils/password";
import { signJwtToken } from "../../utils/jwt";

const sanitizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const authService = {
  async register(payload: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ApiError(409, "Email is already registered");
    }

    const hashedPassword = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
      },
    });

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: sanitizeUser(user),
      token,
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    };
  },

  async login(payload: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(403, "User account is deactivated");
    }

    const passwordMatched = await comparePassword(payload.password, user.password);
    if (!passwordMatched) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: sanitizeUser(user),
      token,
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    };
  },
};
