import { Edit3, Trash2 } from "lucide-react";

import { imageSource } from "../../services/galleryApi";
import type { GalleryItem } from "../../types/gallery";
import { formatDate } from "../../utils/formatDate";

/**
 * Props accepted by GalleryCard.
 *
 * The card receives:
 * - item      → the gallery image/data to display
 * - onEdit    → callback provided by the parent when Edit is clicked
 * - onDelete  → callback provided by the parent when Delete is clicked
 *
 * Keeping these as callbacks makes GalleryCard reusable and keeps
 * API/database logic outside of the component.
 */
interface Props {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

/**
 * Displays a single gallery item.
 */
export function GalleryCard({
  item,
  onEdit,
  onDelete,
}: Props) {
  return (
    <article className="gallery-card">
      {/* ============================================================
          IMAGE AREA
          ============================================================

          This wrapper controls the visual area occupied by the image.

          The actual image sizing/cropping behavior is controlled by
          the CSS class "card-image".

          We intentionally keep the image itself separate from the
          card actions so that the buttons can be positioned on top
          of the image without affecting its dimensions.
      */}
      <div className="card-image-wrap">
        <img
          src={imageSource(item.image_url)}
          alt={item.title}
          className="card-image"
          loading="lazy"
        />

        {/* ==========================================================
            CARD ACTIONS

            These buttons sit over the image and allow the user to
            edit or delete the current gallery item.

            The card does not perform those operations itself.

            Instead, it calls the callbacks supplied by GalleryGrid
            / GalleryPage.
        ========================================================== */}
        <div className="card-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={`Edit ${item.title}`}
            onClick={() => onEdit(item)}
          >
            <Edit3 size={17} />
          </button>

          <button
            className="icon-button danger-icon"
            type="button"
            aria-label={`Delete ${item.title}`}
            onClick={() => onDelete(item)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* ============================================================
          CARD INFORMATION
          ============================================================

          Everything below the image contains metadata about the
          gallery item:
          - title
          - creation date
          - description
      ============================================================ */}
      <div className="card-copy">
        {/* ----------------------------------------------------------
            TITLE + DATE
        ---------------------------------------------------------- */}
        <div className="card-heading">
          <h2>{item.title}</h2>

          <time dateTime={item.created_at}>
            {formatDate(item.created_at)}
          </time>
        </div>

        {/* ----------------------------------------------------------
            DESCRIPTION

            If the user did not provide a description, we show a
            small fallback instead of leaving the area empty.
        ---------------------------------------------------------- */}
        <p>
          {item.description || "No description added."}
        </p>
      </div>
    </article>
  );
}
