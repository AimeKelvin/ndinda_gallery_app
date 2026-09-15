import { Edit3, Trash2 } from "lucide-react";
import type { GalleryItem } from "../types/gallery";

interface Props {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

export default function GalleryCard({ item, onEdit, onDelete }: Props) {
  return (
    <article className="gallery-card">
      <div className="card-image-wrap">
        <img src={item.image_url} alt={item.title} className="card-image" />
        <div className="card-actions">
          <button
            type="button"
            className="icon-button"
            aria-label={`Edit ${item.title}`}
            onClick={() => onEdit(item)}
          >
            <Edit3 size={17} />
          </button>
          <button
            type="button"
            className="icon-button danger"
            aria-label={`Delete ${item.title}`}
            onClick={() => onDelete(item)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="card-content">
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
        <time dateTime={item.created_at}>
          {new Date(item.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}