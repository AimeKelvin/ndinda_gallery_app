/** Create/edit form modal; it validates browser input and delegates persistence to its parent hook. */
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { imageSource } from "../../services/galleryApi";
import type { GalleryItem } from "../../types/gallery";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { Textarea } from "../ui/Textarea";

interface Props { open: boolean; item: GalleryItem | null; submitting: boolean; onClose: () => void; onSubmit: (formData: FormData) => Promise<void>; }

export function GalleryModal({ open, item, submitting, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(item?.title ?? ""); setDescription(item?.description ?? ""); setFile(null); setFormError("");
    setPreview(item ? imageSource(item.image_url) : null);
  }, [open, item]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!open) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) { setFormError("Title is required."); return; }
    if (cleanTitle.length > 255) { setFormError("Title must be 255 characters or fewer."); return; }
    if (description.trim().length > 5000) { setFormError("Description must be 5000 characters or fewer."); return; }
    if (!item && !file) { setFormError("Choose an image to upload."); return; }

    const formData = new FormData();
    formData.set("title", cleanTitle); formData.set("description", description.trim());
    if (file) formData.set("image", file);
    await onSubmit(formData);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
        <div className="modal-header"><div><span className="eyebrow">{item ? "Update entry" : "New entry"}</span><h2 id="gallery-modal-title">{item ? "Edit gallery item" : "Add to gallery"}</h2></div><button className="close-button" type="button" onClick={onClose} disabled={submitting} aria-label="Close"><X size={20} /></button></div>
        <form onSubmit={(e) => void submit(e)}>
          <label className="upload-zone">
            {preview ? <img src={preview} alt="Selected image preview" /> : <span><ImagePlus size={28} /><strong>Choose an image</strong><small>JPEG, PNG, WEBP or GIF · max 8 MB</small></span>}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { const next = e.target.files?.[0] ?? null; if (next && next.size > 8 * 1024 * 1024) { setFormError("Image must be 8 MB or smaller."); e.target.value = ""; return; } setFile(next); setFormError(""); }} />
          </label>
          {item && <p className="field-hint">Choose a new file only if you want to replace the current image.</p>}
          <label className="field"><span>Title</span><Input value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Evening in Kigali" required /></label>
          <label className="field"><span>Description <small>optional</small></span><Textarea value={description} maxLength={5000} rows={4} onChange={(e) => setDescription(e.target.value)} placeholder="What makes this image memorable?" /></label>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="modal-actions"><Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button><Button type="submit" disabled={submitting}>{submitting && <Spinner />}{item ? "Save changes" : "Upload image"}</Button></div>
        </form>
      </div>
    </div>
  );
}
