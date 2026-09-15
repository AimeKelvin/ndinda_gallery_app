/**
 * Gallery Controller
 *
 * Responsibility: translate Express HTTP requests into service calls and HTTP responses.
 * Architecture: route -> controller -> service. There is intentionally no SQL here.
 * MongoDB/Mongoose comparison: rather than calling a Mongoose model directly from each
 * route handler, this thin controller delegates business behavior to the service layer.
 */
import type { NextFunction, Request, Response } from "express";
import { galleryService } from "../services/gallery.service";

function idFromRequest(req: Request): number {
  return Number(req.params.id);
}

export async function getGallery(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await galleryService.list();
    res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
}

export async function getGalleryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await galleryService.get(idFromRequest(req));
    res.status(200).json({ success: true, data: item });
  } catch (error) { next(error); }
}

export async function createGalleryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await galleryService.create(req.body, req.file);
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
}

export async function updateGalleryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await galleryService.update(idFromRequest(req), req.body, req.file);
    res.status(200).json({ success: true, data: item });
  } catch (error) { next(error); }
}

export async function deleteGalleryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await galleryService.delete(idFromRequest(req));
    res.status(200).json({ success: true, data: { id: idFromRequest(req) } });
  } catch (error) { next(error); }
}
