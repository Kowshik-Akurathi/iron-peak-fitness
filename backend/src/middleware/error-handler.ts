import type { FastifyError, FastifyInstance } from "fastify";
import { AppError } from "../errors/app-error.js";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError | AppError, request, reply) => {
    const validation = "validation" in error ? error.validation : undefined;

    if (validation) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: validation,
        },
        requestId: request.id,
      });
    }

    const appError = error instanceof AppError ? error : null;
    const statusCode = appError?.statusCode ?? 500;

    if (statusCode >= 500) {
      request.log.error({ err: error }, "Unhandled request error");
    }

    return reply.status(statusCode).send({
      error: {
        code: appError?.code ?? "INTERNAL_SERVER_ERROR",
        message: statusCode >= 500 ? "Internal server error" : error.message,
        ...(appError?.details === undefined ? {} : { details: appError.details }),
      },
      requestId: request.id,
    });
  });
}
