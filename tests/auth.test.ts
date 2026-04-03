process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-value-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.DATABASE_URL = "file:./test.db";

import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { app } from "../src/app";

const prisma = new PrismaClient();

describe("Auth API", () => {
  beforeAll(async () => {
    execSync("npx prisma db push --skip-generate", {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      stdio: "pipe",
    });

    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /api/auth/register should create user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it("POST /api/auth/login should authenticate user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
