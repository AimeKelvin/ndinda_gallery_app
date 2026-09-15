/**
 * Gallery Repository
 *
 * Responsibility: contains every direct PostgreSQL operation for gallery items.
 * Architecture: service -> repository -> PostgreSQL.
 * MongoDB/Mongoose comparison: this is roughly where Gallery.find(),
 * Gallery.findById(), Gallery.create(), findByIdAndUpdate(), and findByIdAndDelete()
 * would live. PostgreSQL has no Mongoose model methods, so we write explicit SQL.
 *
 * `$1`, `$2`, ... are parameter placeholders. The pg driver sends values separately
 * from SQL syntax, which prevents user input from becoming executable SQL.
 */
import { pool } from "../database/connection";
import type { CreateGalleryItemInput, GalleryItem, UpdateGalleryItemInput } from "../types/gallery.types";

const columns = "id, title, description, image_url, created_at, updated_at";

export async function findAll(): Promise<GalleryItem[]> {
  const result = await pool.query<GalleryItem>(
    `SELECT ${columns} FROM gallery_items ORDER BY created_at DESC, id DESC`,
  );
  return result.rows;
}

export async function findById(id: number): Promise<GalleryItem | null> {
  // Mongoose equivalent: Gallery.findById(id)
  const result = await pool.query<GalleryItem>(
    `SELECT ${columns} FROM gallery_items WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function create(input: CreateGalleryItemInput): Promise<GalleryItem> {
  // Mongoose equivalent: Gallery.create({...}). RETURNING asks PostgreSQL for the new row.
  const result = await pool.query<GalleryItem>(
    `INSERT INTO gallery_items (title, description, image_url)
     VALUES ($1, $2, $3)
     RETURNING ${columns}`,
    [input.title, input.description, input.image_url],
  );
  const created = result.rows[0];
  if (!created) throw new Error("PostgreSQL INSERT did not return a row");
  return created;
}

export async function update(id: number, input: UpdateGalleryItemInput): Promise<GalleryItem | null> {
  // Mongoose equivalent: Gallery.findByIdAndUpdate(id, update, { new: true })
  const result = await pool.query<GalleryItem>(
    `UPDATE gallery_items
     SET title = $1, description = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING ${columns}`,
    [input.title, input.description, input.image_url, id],
  );
  return result.rows[0] ?? null;
}

export async function remove(id: number): Promise<GalleryItem | null> {
  // Mongoose equivalent: Gallery.findByIdAndDelete(id)
  const result = await pool.query<GalleryItem>(
    `DELETE FROM gallery_items WHERE id = $1 RETURNING ${columns}`,
    [id],
  );
  return result.rows[0] ?? null;
}
