import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify, { type FastifyInstance } from "fastify";
import { loadEnv, type AppEnv } from "./config/env.js";
import { registerErrorHandler } from "./middleware/error-handler.js";
import { healthRoutes } from "./routes/health.js";

export async function buildApp(env: AppEnv = loadEnv()): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      redact: ["req.headers.authorization", "req.headers.cookie"],
    },
    bodyLimit: 1024 * 1024,
  });

  await app.register(helmet);
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  registerErrorHandler(app);
  await app.register(healthRoutes, { prefix: "/api/v1" });

  return app;
}
