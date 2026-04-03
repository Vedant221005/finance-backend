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
const app_1 = require("../src/app");
describe("Health API", () => {
    it("GET /api/health should return healthy response", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/health");
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
//# sourceMappingURL=health.test.js.map