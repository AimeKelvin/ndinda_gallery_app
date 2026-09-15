/**
 * Gallery routes
 *
 * Responsibility: map endpoint + HTTP method to middleware/controller functions.
 * Architecture: request -> Router -> upload middleware (when needed) -> controller.
 * MongoDB/Mongoose comparison: Express Router works exactly the same with MongoDB; it
 * keeps URL wiring separate from business/database code as the app grows.
 */
import { Router } from "express";
import { createGalleryItem, deleteGalleryItem, getGallery, getGalleryItem, updateGalleryItem } from "../controllers/gallery.controller";
import { uploadImage } from "../middleware/upload.middleware";

export const galleryRouter = Router();

galleryRouter.get("/", getGallery);
galleryRouter.get("/:id", getGalleryItem);
galleryRouter.post("/", uploadImage, createGalleryItem);
galleryRouter.put("/:id", uploadImage, updateGalleryItem);
galleryRouter.delete("/:id", deleteGalleryItem);
