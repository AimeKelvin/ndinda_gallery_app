/**
 * Main gallery page.
 *
 * Responsibilities:
 * - Compose the gallery UI
 * - Manage page-level UI state such as search, modal visibility,
 *   selected item, and delete confirmation
 * - Delegate gallery CRUD operations to useGallery
 *
 * This component intentionally contains no direct API/database logic.
 */

import { Camera, ImagePlus, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { DeleteDialog } from "../components/gallery/DeleteDialog";
import { GalleryGrid } from "../components/gallery/GalleryGrid";
import { GalleryModal } from "../components/gallery/GalleryModal";
import { Button } from "../components/ui/Button";
import { useGallery } from "../hooks/useGallery";
import type { GalleryItem } from "../types/gallery";

export function GalleryPage() {
  /**
   * All gallery data and CRUD operations are handled by the custom hook.
   *
   * This keeps the page independent from:
   * - fetch()
   * - API URLs
   * - database logic
   * - loading/error implementation
   */
  const gallery = useGallery();

  /**
   * Local UI state.
   *
   * These values only control what is happening on this page.
   */
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<GalleryItem | null>(null);

  /**
   * Filter gallery items based on the search input.
   *
   * We use useMemo so the filtering only runs when either:
   * - gallery.items changes
   * - search changes
   */
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return gallery.items;
    }

    return gallery.items.filter((item) => {
      const title = item.title.toLowerCase();
      const description = (item.description ?? "").toLowerCase();

      return title.includes(term) || description.includes(term);
    });
  }, [gallery.items, search]);

  /**
   * Opens the modal in "create" mode.
   *
   * Clearing editingItem is important because the same modal
   * is also used for editing existing images.
   */
  const handleAddImage = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  /**
   * Opens the modal in "edit" mode.
   */
  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  /**
   * Safely closes the gallery modal.
   *
   * We don't allow the modal to close while a save operation
   * is still in progress.
   */
  const handleCloseModal = () => {
    if (gallery.saving) {
      return;
    }

    setModalOpen(false);
    setEditingItem(null);
  };

  /**
   * Handles create/update submission from GalleryModal.
   *
   * useGallery decides whether this is a create or update
   * based on whether editingItem exists.
   */
  const handleSubmit = async (formData: FormData) => {
    const success = await gallery.save(formData, editingItem);

    if (success) {
      setModalOpen(false);
      setEditingItem(null);
    }
  };

  /**
   * Handles deletion of the currently selected gallery item.
   */
  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    const success = await gallery.remove(deleteItem);

    if (success) {
      setDeleteItem(null);
    }
  };

  /**
   * Close the delete dialog unless deletion is currently running.
   */
  const handleCancelDelete = () => {
    if (gallery.deleting) {
      return;
    }

    setDeleteItem(null);
  };

  return (
    <div className="app-shell">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">
            <Camera size={19} />
          </span>

          <span>Gallery</span>
        </a>

        <Button onClick={handleAddImage}>
          <ImagePlus size={18} />
          Add image
        </Button>
      </header>

      <main>
        {/* ==========================================================
            HERO
            ========================================================== */}
        <section className="hero">
          <div>

            <h1>
              Keep the moments
              <br />
              <em>worth remembering.</em>
            </h1>

            <p>
              A simple space to collect, describe, update and manage your
              favorite images.
            </p>
          </div>

          <div className="hero-stat">
            <strong>{gallery.items.length}</strong>

            <span>
              {gallery.items.length === 1 ? "piece" : "pieces"} saved
            </span>
          </div>
        </section>

        {/* ==========================================================
            TOOLBAR
            ========================================================== */}
        <section className="toolbar">
          <label className="search-box">
            <Search size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or description..."
              aria-label="Search gallery"
            />
          </label>

          <button
            className="refresh-button"
            onClick={() => void gallery.refresh()}
            disabled={gallery.loading}
          >
            <RefreshCw
              size={16}
              className={gallery.loading ? "spin" : ""}
            />

            Refresh
          </button>
        </section>

        {/* ==========================================================
            ERROR MESSAGE
            ========================================================== */}
        {gallery.error && (
          <div className="error-banner" role="alert">
            <span>{gallery.error}</span>

            <button onClick={() => gallery.setError("")}>
              Dismiss
            </button>
          </div>
        )}

        {/* ==========================================================
            GALLERY CONTENT
            ========================================================== */}

        {gallery.loading ? (
          /*
           * Loading state.
           *
           * We render placeholder cards instead of showing a blank
           * screen while the API request is running.
           */
          <div className="loading-grid" aria-label="Loading gallery">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton" key={index} />
            ))}
          </div>
        ) : filteredItems.length ? (
          /*
           * Gallery has images.
           */
          <GalleryGrid
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={setDeleteItem}
          />
        ) : (
          /*
           * Empty state.
           *
           * This is used for both:
           * - an actually empty gallery
           * - a search that returned no results
           */
          <section className="empty-state">
            <div className="empty-icon">
              <ImagePlus size={25} />
            </div>

            <h2>
              {search ? "No matches found" : "Your gallery is empty"}
            </h2>

            <p>
              {search
                ? "Try a different search term."
                : "Add your first image and start building your collection."}
            </p>

            {!search && (
              <Button onClick={handleAddImage}>
                Add your first image
              </Button>
            )}
          </section>
        )}
      </main>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer>
        <span>Gallery App</span>

        <span>
          React · TypeScript · Node.js · PostgreSQL
        </span>
      </footer>

      {/* ============================================================
          CREATE / EDIT MODAL
          ============================================================ */}
      <GalleryModal
        open={modalOpen}
        item={editingItem}
        submitting={gallery.saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      {/* ============================================================
          DELETE CONFIRMATION
          ============================================================ */}
      <DeleteDialog
        item={deleteItem}
        deleting={gallery.deleting}
        onCancel={handleCancelDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}