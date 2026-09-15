/**
 * Express application composition
 *
 * Responsibility: assembles cross-cutting middleware, static uploads, and feature routes.
 * Architecture: this is the HTTP composition root; it does not start the TCP server.
 * MongoDB/Mongoose comparison: app setup is the same, but DB initialization is not hidden
 * here. PostgreSQL schema creation is handled explicitly by migrations.
 */
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { galleryRouter } from "./routes/gallery.routes";
import { uploadsDirectory } from "./utils/file.utils";

export const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDirectory));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});
app.use("/api/gallery", galleryRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
