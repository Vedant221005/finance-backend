process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-value-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.DATABASE_URL = "file:./test.db";

import { execSync } from "node:child_process";
import request from "supertest";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { app } from "../src/app";

const prisma = new PrismaClient();

describe("Finance API integration", () => {
  let adminToken = "";
  let analystToken = "";
  let viewerToken = "";

  let analystId = "";
  let viewerId = "";
  let managedUserId = "";

  let transactionId = "";

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

    const passwordHash = await bcrypt.hash("Password@123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@test.local",
        password: passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    const analyst = await prisma.user.create({
      data: {
        name: "Analyst",
        email: "analyst@test.local",
        password: passwordHash,
        role: Role.ANALYST,
        isActive: true,
      },
    });

    const viewer = await prisma.user.create({
      data: {
        name: "Viewer",
        email: "viewer@test.local",
        password: passwordHash,
        role: Role.VIEWER,
        isActive: true,
      },
    });

    const managedUser = await prisma.user.create({
      data: {
        name: "Managed User",
        email: "managed@test.local",
        password: passwordHash,
        role: Role.VIEWER,
        isActive: true,
      },
    });

    analystId = analyst.id;
    viewerId = viewer.id;
    managedUserId = managedUser.id;

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: admin.email,
      password: "Password@123",
    });

    const analystLogin = await request(app).post("/api/auth/login").send({
      email: analyst.email,
      password: "Password@123",
    });

    const viewerLogin = await request(app).post("/api/auth/login").send({
      email: viewer.email,
      password: "Password@123",
    });

    adminToken = adminLogin.body.data.token;
    analystToken = analystLogin.body.data.token;
    viewerToken = viewerLogin.body.data.token;

    await prisma.transaction.createMany({
      data: [
        {
          amount: 1200,
          type: "INCOME",
          category: "Salary",
          date: new Date("2026-04-01T10:00:00.000Z"),
          notes: "April salary",
          userId: analystId,
        },
        {
          amount: 300,
          type: "EXPENSE",
          category: "Groceries",
          date: new Date("2026-04-02T10:00:00.000Z"),
          notes: "Weekly groceries",
          userId: viewerId,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "New User",
      email: "new@test.local",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("rejects invalid login", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@test.local",
      password: "WrongPassword",
    });

    expect(response.status).toBe(401);
  });

  it("allows admin user management endpoints", async () => {
    const listResponse = await request(app)
      .get("/api/users?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.data)).toBe(true);

    const getResponse = await request(app)
      .get(`/api/users/${managedUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getResponse.status).toBe(200);

    const roleResponse = await request(app)
      .patch(`/api/users/${managedUserId}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "ANALYST" });
    expect(roleResponse.status).toBe(200);
    expect(roleResponse.body.data.role).toBe("ANALYST");

    const activeResponse = await request(app)
      .patch(`/api/users/${managedUserId}/active`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ isActive: false });
    expect(activeResponse.status).toBe(200);
    expect(activeResponse.body.data.isActive).toBe(false);

    const deleteResponse = await request(app)
      .delete(`/api/users/${managedUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(deleteResponse.status).toBe(200);
  });

  it("blocks viewer from admin user management endpoints", async () => {
    const response = await request(app)
      .get("/api/users?page=1&limit=10")
      .set("Authorization", `Bearer ${viewerToken}`);

    expect(response.status).toBe(403);
  });

  it("allows analyst transaction CRUD and filtering", async () => {
    const createResponse = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${analystToken}`)
      .send({
        amount: 650,
        type: "INCOME",
        category: "Consulting",
        date: "2026-04-03T10:00:00.000Z",
        notes: "Consulting payment",
      });

    expect(createResponse.status).toBe(201);
    transactionId = createResponse.body.data.id;

    const listResponse = await request(app)
      .get("/api/transactions?type=INCOME&category=Consulting&page=1&limit=10&sortBy=date&sortOrder=desc")
      .set("Authorization", `Bearer ${analystToken}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.data)).toBe(true);

    const getResponse = await request(app)
      .get(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${analystToken}`);
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${analystToken}`)
      .send({ amount: 700, notes: "Updated payment" });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.amount).toBe(700);

    const deleteResponse = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${analystToken}`);
    expect(deleteResponse.status).toBe(200);
  });

  it("blocks viewer from transaction endpoints", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${viewerToken}`);

    expect(response.status).toBe(403);
  });

  it("serves all dashboard endpoints for viewer", async () => {
    const overviewResponse = await request(app)
      .get("/api/dashboard/overview")
      .set("Authorization", `Bearer ${viewerToken}`);
    expect(overviewResponse.status).toBe(200);

    const totalsResponse = await request(app)
      .get("/api/dashboard/totals")
      .set("Authorization", `Bearer ${viewerToken}`);
    expect(totalsResponse.status).toBe(200);

    const categoryResponse = await request(app)
      .get("/api/dashboard/category-breakdown")
      .set("Authorization", `Bearer ${viewerToken}`);
    expect(categoryResponse.status).toBe(200);

    const monthlyResponse = await request(app)
      .get("/api/dashboard/monthly-trends")
      .set("Authorization", `Bearer ${viewerToken}`);
    expect(monthlyResponse.status).toBe(200);

    const weeklyResponse = await request(app)
      .get("/api/dashboard/weekly-summary")
      .set("Authorization", `Bearer ${viewerToken}`);
    expect(weeklyResponse.status).toBe(200);

    const recentResponse = await request(app)
      .get("/api/dashboard/recent-transactions")
      .set("Authorization", `Bearer ${viewerToken}`);
    expect(recentResponse.status).toBe(200);
  });
});
