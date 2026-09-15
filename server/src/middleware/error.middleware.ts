/**
 * Central error middleware
 *
 * Responsibility: turns errors from any earlier layer into one consistent JSON shape.
 * Architecture: final Express middleware after routes.
 * MongoDB/Mongoose comparison: same centralized error pattern you can use for CastError
 * or ValidationError; here we additionally handle Multer and PostgreSQL failures safely.
 */
import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { AppError } from "../utils/app-error";

export const errorMiddleware: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }

  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 8 MB or smaller"
      : "Could not process uploaded image";
    res.status(400).json({ success: false, message });
    return;
  }

  if (error instanceof Error && error.message.includes("Only JPEG")) {
    res.status(400).json({ success: false, message: error.message });
    return;
  }

  res.status(500).json({ success: false, message: "Internal server error" });
};
