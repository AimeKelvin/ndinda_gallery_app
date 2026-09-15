/** UI/domain shape returned by the Gallery REST API. */
export interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ApiSuccess<T> { success: true; data: T }
export interface ApiFailure { success: false; message: string }
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
