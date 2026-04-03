import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { notFoundMiddleware, errorMiddleware } from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth";
import { userRouter } from "./modules/users";
import { transactionRouter } from "./modules/transactions";
import { dashboardRouter } from "./modules/dashboard";
import { healthRouter } from "./modules/health/health.route";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth requests. Please try again later.",
  },
});

app.use("/api/auth", authRateLimiter, authRouter);
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api", healthRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Finance Backend API",
    customCss:
      ".swagger-ui .models { display: none !important; } .swagger-ui .topbar { display: none !important; }",
  }),
);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
