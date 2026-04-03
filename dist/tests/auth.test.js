"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-value-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.DATABASE_URL = "file:./test.db";
const supertest_1 = __importDefault(require("supertest"));
const client_1 = require("@prisma/client");
const node_child_process_1 = require("node:child_process");
const app_1 = require("../src/app");
const prisma = new client_1.PrismaClient();
describe("Auth API", () => {
    beforeAll(async () => {
        (0, node_child_process_1.execSync)("npx prisma db push --skip-generate", {
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
        const response = await (0, supertest_1.default)(app_1.app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "Password@123",
        });
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
    });
    it("POST /api/auth/login should authenticate user", async () => {
        const response = await (0, supertest_1.default)(app_1.app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "Password@123",
        });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
    });
});
//# sourceMappingURL=auth.test.js.map