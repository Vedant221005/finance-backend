process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-value-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.DATABASE_URL = "file:./test.db";

import request from "supertest";
import { app } from "../src/app";

describe("Health API", () => {
  it("GET /api/health should return healthy response", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
