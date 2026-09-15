/** Renders one gallery row as a reusable card; it receives data/actions rather than calling the API itself. */
import { Edit3, Trash2 } from "lucide-react";
import { imageSource } from "../../services/galleryApi";
import type { GalleryItem } from "../../types/gallery";
import { formatDate } from "../../utils/formatDate";

interface Props { item: GalleryItem; onEdit: (item: GalleryItem) => void; onDelete: (item: GalleryItem) => void; }

export function GalleryCard({ item, onEdit, onDelete }: Props) {
  return (
    <article className="gallery-card">
      <div className="card-image-wrap">
        <img src={imageSource(item.image_url)} alt={item.title} className="card-image" loading="lazy" />
        <div className="card-actions">
          <button className="icon-button" type="button" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}><Edit3 size={17} /></button>
          <button className="icon-button danger-icon" type="button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item)}><Trash2 size={17} /></button>
        </div>
      </div>
      <div className="card-copy">
        <div className="card-heading"><h2>{item.title}</h2><time dateTime={item.created_at}>{formatDate(item.created_at)}</time></div>
        <p>{item.description || "No description added."}</p>
      </div>
    </article>
  );
}
