/**
 * Gallery domain types
 *
 * Responsibility: TypeScript contracts shared by repository/service/controller code.
 * Architecture: domain types describe data moving between layers.
 * MongoDB/Mongoose comparison: interfaces resemble the shape you might infer from a
 * Mongoose schema, while PostgreSQL itself enforces the real table schema at runtime.
 */
export interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGalleryItemInput {
  title: string;
  description: string | null;
  image_url: string;
}

export interface UpdateGalleryItemInput {
  title: string;
  description: string | null;
  image_url: string;
}

export interface GalleryTextInput {
  title: unknown;
  description: unknown;
}
