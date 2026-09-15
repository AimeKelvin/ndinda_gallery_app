/**
 * Gallery API service
 *
 * Responsibility: all browser <-> Express communication lives here, not in components.
 * This mirrors the backend separation idea: UI decides what to display; this module knows
 * how to call the API. Think of it as the frontend equivalent of keeping DB calls out of UI.
 */
import type { ApiResponse, GalleryItem } from "../types/gallery";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  const body = await response.json().catch(() => null) as ApiResponse<T> | null;
  if (!response.ok || !body || !body.success) {
    throw new Error(body && !body.success ? body.message : "The server returned an unexpected response.");
  }
  return body.data;
}

export function getGallery(): Promise<GalleryItem[]> {
  return request<GalleryItem[]>("/api/gallery");
}

export function getGalleryItem(id: number): Promise<GalleryItem> {
  return request<GalleryItem>(`/api/gallery/${id}`);
}

export function createGalleryItem(formData: FormData): Promise<GalleryItem> {
  return request<GalleryItem>("/api/gallery", { method: "POST", body: formData });
}

export function updateGalleryItem(id: number, formData: FormData): Promise<GalleryItem> {
  return request<GalleryItem>(`/api/gallery/${id}`, { method: "PUT", body: formData });
}

export async function deleteGalleryItem(id: number): Promise<void> {
  await request<{ id: number }>(`/api/gallery/${id}`, { method: "DELETE" });
}

export function imageSource(imageUrl: string): string {
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE}${imageUrl}`;
}
