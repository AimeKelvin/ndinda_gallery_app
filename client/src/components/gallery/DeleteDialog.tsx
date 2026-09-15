/** Accessible delete confirmation UI; destructive API behavior remains outside this presentation component. */
import { AlertTriangle } from "lucide-react";
import type { GalleryItem } from "../../types/gallery";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

interface Props { item: GalleryItem | null; deleting: boolean; onCancel: () => void; onConfirm: () => void; }

export function DeleteDialog({ item, deleting, onCancel, onConfirm }: Props) {
  if (!item) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !deleting) onCancel(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="dialog-icon"><AlertTriangle size={22} /></div>
        <h2 id="delete-title">Delete this image?</h2>
        <p>“{item.title}” and its local image file will be permanently removed.</p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={onCancel} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={deleting}>{deleting && <Spinner />} Delete</Button>
        </div>
      </div>
    </div>
  );
}
