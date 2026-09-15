/** Pure layout component that maps gallery data into cards and keeps grid markup out of the page. */
import type { GalleryItem } from "../../types/gallery";
import { GalleryCard } from "./GalleryCard";

interface Props { items: GalleryItem[]; onEdit: (item: GalleryItem) => void; onDelete: (item: GalleryItem) => void; }

export function GalleryGrid({ items, onEdit, onDelete }: Props) {
  return <section className="gallery-grid" aria-label="Gallery">{items.map((item) => <GalleryCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />)}</section>;
}
