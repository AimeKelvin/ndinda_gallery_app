/**
 * Gallery Service
 *
 * Responsibility: business rules, validation, not-found behavior, and image lifecycle.
 * Architecture: controller -> service -> repository.
 * MongoDB/Mongoose comparison: many small apps put this logic beside Mongoose calls in
 * controllers. Keeping it here makes the business behavior independent of HTTP and SQL.
 */
import * as repository from "../repositories/gallery.repository";
import type { GalleryItem, GalleryTextInput } from "../types/gallery.types";
import { AppError } from "../utils/app-error";
import { filePathFromImageUrl, safeDeleteFile, toPublicImagePath } from "../utils/file.utils";

function validateId(id: number): number {
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, "Invalid gallery item ID");
  return id;
}

function validateText(input: GalleryTextInput): { title: string; description: string | null } {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";

  if (!title) throw new AppError(400, "Title is required");
  if (title.length > 255) throw new AppError(400, "Title must be 255 characters or fewer");
  if (description.length > 5000) throw new AppError(400, "Description must be 5000 characters or fewer");

  return { title, description: description || null };
}

export const galleryService = {
  async list(): Promise<GalleryItem[]> {
    return repository.findAll();
  },

  async get(id: number): Promise<GalleryItem> {
    const item = await repository.findById(validateId(id));
    if (!item) throw new AppError(404, "Gallery item not found");
    return item;
  },

  async create(input: GalleryTextInput, file: Express.Multer.File | undefined): Promise<GalleryItem> {
    if (!file) throw new AppError(400, "An image is required");

    try {
      const text = validateText(input);
      return await repository.create({
        ...text,
        image_url: toPublicImagePath(file.filename),
      });
    } catch (error) {
      // Multer already wrote the file. If validation/INSERT fails, remove it to avoid an orphan.
      await safeDeleteFile(file.path);
      throw error;
    }
  },

  async update(id: number, input: GalleryTextInput, file: Express.Multer.File | undefined): Promise<GalleryItem> {
    try {
      const validId = validateId(id);
      const text = validateText(input);
      const current = await repository.findById(validId);
      if (!current) throw new AppError(404, "Gallery item not found");

      const updated = await repository.update(validId, {
        ...text,
        image_url: file ? toPublicImagePath(file.filename) : current.image_url,
      });
      if (!updated) throw new AppError(404, "Gallery item not found");

      // Delete the old image only after the database successfully points to the new one.
      if (file) await safeDeleteFile(filePathFromImageUrl(current.image_url));
      return updated;
    } catch (error) {
      // If update fails, the newly uploaded replacement is no longer needed.
      if (file) await safeDeleteFile(file.path);
      throw error;
    }
  },

  async delete(id: number): Promise<GalleryItem> {
    const deleted = await repository.remove(validateId(id));
    if (!deleted) throw new AppError(404, "Gallery item not found");

    // The row is already gone, so a missing local file should not make the API deletion fail.
    await safeDeleteFile(filePathFromImageUrl(deleted.image_url));
    return deleted;
  },
};
