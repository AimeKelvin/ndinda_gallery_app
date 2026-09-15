import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import type { GalleryItem } from "../types/gallery";

interface Props {
  item: GalleryItem | null;
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function GalleryModal({
  item,
  open,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTitle(item?.title || "");
    setDescription(item?.description || "");
    setFile(null);
    setPreview(item?.image_url || null);
  }, [open, item]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!open) return null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    if (file) {
      formData.append("image", file);
    }

    await onSubmit(formData);
  }

  const isEditing = Boolean(item);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">{isEditing ? "Edit item" : "New item"}</span>
            <h2 id="gallery-modal-title">
              {isEditing ? "Update your image" : "Add to the gallery"}
            </h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={160}
                placeholder="e.g. Kigali sunset"
                required
              />
            </label>

            <label>
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={5000}
                rows={4}
                placeholder="Tell people a little about this image..."
              />
            </label>

            <div>
              <span className="field-label">Image {isEditing && <small>Optional when editing</small>}</span>
              <input
                ref={fileInputRef}
                className="hidden-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
              />

              <button
                type="button"
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="Selected preview" className="upload-preview" />
                ) : (
                  <>
                    <ImagePlus size={28} />
                    <strong>Choose an image</strong>
                    <small>JPG, PNG, WEBP or GIF · max 8 MB</small>
                  </>
                )}
              </button>

              {file && <p className="selected-file">{file.name}</p>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="button secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={submitting}>
              {submitting ? "Saving..." : isEditing ? "Save changes" : "Add image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}