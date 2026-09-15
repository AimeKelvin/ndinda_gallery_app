import type { GalleryItem } from "../types/gallery";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Something went wrong.");
  }

  return payload as T;
}

export function getGallery() {
  return request<GalleryItem[]>("/gallery");
}

export function getGalleryItem(id: number) {
  return request<GalleryItem>(`/gallery/${id}`);
}

export function createGalleryItem(data: FormData) {
  return request<GalleryItem>("/gallery", {
    method: "POST",
    body: data,
  });
}

export function updateGalleryItem(id: number, data: FormData) {
  return request<GalleryItem>(`/gallery/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteGalleryItem(id: number) {
  return request<void>(`/gallery/${id}`, {
    method: "DELETE",
  });
}