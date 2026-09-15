/**
 * Not-found middleware
 *
 * Responsibility: handles requests that matched no API/static route.
 * Architecture: runs after routes but before the error middleware.
 * MongoDB/Mongoose comparison: unrelated to the database; this is the same Express 404
 * fallback pattern you may already use in MongoDB-backed APIs.
 */
import type { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};
