import { useEffect, useMemo, useState } from "react";
import { Camera, ImagePlus, RefreshCw, Search } from "lucide-react";
import GalleryCard from "./components/GalleryCard";
import GalleryModal from "./components/GalleryModal";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGallery,
  updateGalleryItem,
} from "./lib/api";
import type { GalleryItem } from "./types/gallery";
import "./styles.css";

export default function App() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  async function loadGallery() {
    try {
      setLoading(true);
      setError("");
      setItems(await getGallery());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load gallery.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGallery();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
  }, [items, search]);

  function openCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditingItem(item);
    setModalOpen(true);
  }

  async function handleSave(formData: FormData) {
    try {
      setSaving(true);
      setError("");

      const saved = editingItem
        ? await updateGalleryItem(editingItem.id, formData)
        : await createGalleryItem(formData);

      setItems((current) =>
        editingItem
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current]
      );

      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This will permanently remove the gallery item.`
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteGalleryItem(item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the item.");
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">
            <Camera size={19} />
          </span>
          <span>Gallery</span>
        </a>

        <button className="button primary" onClick={openCreate}>
          <ImagePlus size={18} />
          Add image
        </button>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">Your visual archive</span>
            <h1>Keep the moments<br /><em>worth remembering.</em></h1>
            <p>
              A simple space to collect, describe, update and manage your favorite images.
            </p>
          </div>

          <div className="hero-stat">
            <strong>{items.length}</strong>
            <span>{items.length === 1 ? "image" : "images"} saved</span>
          </div>
        </section>

        <section className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your gallery..."
              aria-label="Search gallery"
            />
          </div>

          <button className="refresh-button" onClick={() => void loadGallery()} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="loading-grid" aria-label="Loading gallery">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton" key={index} />
            ))}
          </div>
        ) : filteredItems.length ? (
          <section className="gallery-grid">
            {filteredItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <div className="empty-icon"><ImagePlus size={25} /></div>
            <h2>{search ? "No matches found" : "Your gallery is empty"}</h2>
            <p>
              {search
                ? "Try a different search term."
                : "Add your first image and start building your collection."}
            </p>
            {!search && (
              <button className="button primary" onClick={openCreate}>
                Add your first image
              </button>
            )}
          </section>
        )}
      </main>

      <footer>
        <span>Gallery App</span>
        <span>React · TypeScript · Node.js · PostgreSQL</span>
      </footer>

      <GalleryModal
        open={modalOpen}
        item={editingItem}
        submitting={saving}
        onClose={() => {
          if (!saving) setModalOpen(false);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}