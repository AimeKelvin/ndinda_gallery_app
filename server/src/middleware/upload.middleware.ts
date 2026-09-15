/**
 * Image upload middleware
 *
 * Responsibility: accepts one multipart image, validates type/size, and stores it locally.
 * Architecture: route -> Multer middleware -> controller.
 * MongoDB/Mongoose comparison: this is ordinary Express middleware just like in a Mongo
 * app; only the resulting image path is later persisted in PostgreSQL.
 */
import crypto from "node:crypto";
import path from "node:path";
import multer from "multer";
import { uploadsDirectory } from "../utils/file.utils";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDirectory),
  filename: (_req, file, callback) => {
    const extension = extensions[file.mimetype] ?? path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
      return;
    }
    callback(null, true);
  },
}).single("image");
