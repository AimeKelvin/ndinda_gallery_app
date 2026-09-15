/**
 * Gallery state hook
 *
 * Responsibility: owns async API state and mutations so the page stays presentation-focused.
 * This is intentionally independent from the backend repository: browser code never talks
 * directly to PostgreSQL; it only talks to the Express REST API.
 */
import { useCallback, useEffect, useState } from "react";
import { createGalleryItem, deleteGalleryItem, getGallery, updateGalleryItem } from "../services/galleryApi";
import type { GalleryItem } from "../types/gallery";

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try { setLoading(true); setError(""); setItems(await getGallery()); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not load gallery."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function save(formData: FormData, editing: GalleryItem | null): Promise<boolean> {
    try {
      setSaving(true); setError("");
      const saved = editing ? await updateGalleryItem(editing.id, formData) : await createGalleryItem(formData);
      setItems((current) => editing ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      return true;
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save item."); return false; }
    finally { setSaving(false); }
  }

  async function remove(item: GalleryItem): Promise<boolean> {
    try { setDeleting(true); setError(""); await deleteGalleryItem(item.id); setItems((current) => current.filter((entry) => entry.id !== item.id)); return true; }
    catch (error) { setError(error instanceof Error ? error.message : "Could not delete item."); return false; }
    finally { setDeleting(false); }
  }

  return { items, loading, saving, deleting, error, setError, refresh, save, remove };
}
