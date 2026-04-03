import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";

const sanitizeUser = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userService = {
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: sanitizeUser,
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: sanitizeUser });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  async updateRole(id: string, role: Role) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return prisma.user.update({
      where: { id },
      data: { role },
      select: sanitizeUser,
    });
  },

  async updateActiveStatus(id: string, isActive: boolean) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: sanitizeUser,
    });
  },

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await prisma.user.delete({ where: { id } });
  },
};
