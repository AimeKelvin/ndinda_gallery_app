import { X } from "lucide-react";
import { imageSource } from "../../services/galleryApi";
import type { GalleryItem } from "../../types/gallery";
import { formatDate } from "../../utils/formatDate";

interface Props {
  item: GalleryItem | null;
  onClose: () => void;
}

export function GalleryDetailModal({ item, onClose }: Props) {
  if (!item) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        <button
          className="detail-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="detail-layout">
          {/* Image */}
          <div className="detail-image-wrap">
            <img
              src={imageSource(item.image_url)}
              alt={item.title}
              className="detail-image"
            />
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-header">
              <h2 id="detail-modal-title">{item.title}</h2>
              <time dateTime={item.created_at}>
                {formatDate(item.created_at)}
              </time>
            </div>

            <p className="detail-description">
              {item.description || "No description added."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}