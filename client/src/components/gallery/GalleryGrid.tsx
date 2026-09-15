import type { GalleryItem } from "../../types/gallery";
import { GalleryCard } from "./GalleryCard";

interface Props {
  items: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
  onSelect?: (item: GalleryItem) => void;   // ← new
}

export function GalleryGrid({ items, onEdit, onDelete, onSelect }: Props) {
  return (
    <section className="gallery-grid" aria-label="Gallery">
      {items.map((item) => (
        <GalleryCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}