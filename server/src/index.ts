import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { pool, initializeDatabase } from "./db";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const extensionForMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const extension = extensionForMime[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."));
    }
    cb(null, true);
  },
});

function publicImageUrl(req: Request, filename: string) {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}

function deleteLocalFile(imageUrl: string) {
  try {
    const filename = path.basename(new URL(imageUrl).pathname);
    const filePath = path.join(uploadsDir, filename);
    if (filePath.startsWith(uploadsDir) && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // The database operation should not fail because an old image is already missing.
  }
}

function validateText(title: unknown, description: unknown) {
  const cleanTitle = typeof title === "string" ? title.trim() : "";
  const cleanDescription = typeof description === "string" ? description.trim() : "";

  if (!cleanTitle) {
    return { error: "Title is required." };
  }

  if (cleanTitle.length > 160) {
    return { error: "Title must be 160 characters or fewer." };
  }

  if (cleanDescription.length > 5000) {
    return { error: "Description must be 5000 characters or fewer." };
  }

  return { title: cleanTitle, description: cleanDescription };
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/gallery", async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, image_url, created_at, updated_at
       FROM gallery_items
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/gallery/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID." });
    }

    const result = await pool.query(
      `SELECT id, title, description, image_url, created_at, updated_at
       FROM gallery_items WHERE id = $1`,
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post("/api/gallery", upload.single("image"), async (req, res, next) => {
  try {
    const validation = validateText(req.body.title, req.body.description);

    if ("error" in validation) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: validation.error });
    }

    if (!req.file) {
      return res.status(400).json({ message: "An image is required." });
    }

    const imageUrl = publicImageUrl(req, req.file.filename);

    const result = await pool.query(
      `INSERT INTO gallery_items (title, description, image_url)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, image_url, created_at, updated_at`,
      [validation.title, validation.description, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

app.put("/api/gallery/:id", upload.single("image"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Invalid gallery item ID." });
    }

    const validation = validateText(req.body.title, req.body.description);

    if ("error" in validation) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: validation.error });
    }

    const existing = await pool.query(
      `SELECT image_url FROM gallery_items WHERE id = $1`,
      [id]
    );

    if (!existing.rowCount) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Gallery item not found." });
    }

    const oldImageUrl = existing.rows[0].image_url;
    const imageUrl = req.file ? publicImageUrl(req, req.file.filename) : oldImageUrl;

    const result = await pool.query(
      `UPDATE gallery_items
       SET title = $1, description = $2, image_url = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, title, description, image_url, created_at, updated_at`,
      [validation.title, validation.description, imageUrl, id]
    );

    if (req.file) deleteLocalFile(oldImageUrl);

    res.json(result.rows[0]);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

app.delete("/api/gallery/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID." });
    }

    const result = await pool.query(
      `DELETE FROM gallery_items
       WHERE id = $1
       RETURNING image_url`,
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    deleteLocalFile(result.rows[0].image_url);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 8 MB or smaller." });
  }

  const message = error instanceof Error ? error.message : "Internal server error.";
  res.status(500).json({ message });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Gallery API running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });