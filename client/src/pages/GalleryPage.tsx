/** Main gallery page: composes UI components and the useGallery state hook without direct database/API details. */
import { Camera, ImagePlus, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DeleteDialog } from "../components/gallery/DeleteDialog";
import { GalleryGrid } from "../components/gallery/GalleryGrid";
import { GalleryModal } from "../components/gallery/GalleryModal";
import { Button } from "../components/ui/Button";
import { useGallery } from "../hooks/useGallery";
import type { GalleryItem } from "../types/gallery";

export function GalleryPage() {
  const gallery = useGallery();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return gallery.items;
    return gallery.items.filter((item) => item.title.toLowerCase().includes(term) || (item.description ?? "").toLowerCase().includes(term));
  }, [gallery.items, search]);

  return (
    <div className="app-shell">
      <header className="topbar"><a className="brand" href="/"><span className="brand-mark"><Camera size={19} /></span><span>Gallery</span></a><Button onClick={() => { setEditingItem(null); setModalOpen(true); }}><ImagePlus size={18} />Add image</Button></header>
      <main>
        <section className="hero"><div><span className="eyebrow">Your visual archive</span><h1>Keep the moments<br /><em>worth remembering.</em></h1><p>A simple space to collect, describe, update and manage your favorite images.</p></div><div className="hero-stat"><strong>{gallery.items.length}</strong><span>{gallery.items.length === 1 ? "image" : "images"} saved</span></div></section>
        <section className="toolbar"><label className="search-box"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or description..." aria-label="Search gallery" /></label><button className="refresh-button" onClick={() => void gallery.refresh()} disabled={gallery.loading}><RefreshCw size={16} className={gallery.loading ? "spin" : ""} />Refresh</button></section>
        {gallery.error && <div className="error-banner" role="alert"><span>{gallery.error}</span><button onClick={() => gallery.setError("")}>Dismiss</button></div>}
        {gallery.loading ? <div className="loading-grid" aria-label="Loading gallery">{Array.from({ length: 6 }).map((_, i) => <div className="skeleton" key={i} />)}</div> : filteredItems.length ? <GalleryGrid items={filteredItems} onEdit={(item) => { setEditingItem(item); setModalOpen(true); }} onDelete={setDeleteItem} /> : <section className="empty-state"><div className="empty-icon"><ImagePlus size={25} /></div><h2>{search ? "No matches found" : "Your gallery is empty"}</h2><p>{search ? "Try a different search term." : "Add your first image and start building your collection."}</p>{!search && <Button onClick={() => setModalOpen(true)}>Add your first image</Button>}</section>}
      </main>
      <footer><span>Gallery App</span><span>React · TypeScript · Node.js · PostgreSQL</span></footer>
      <GalleryModal open={modalOpen} item={editingItem} submitting={gallery.saving} onClose={() => { if (!gallery.saving) { setModalOpen(false); setEditingItem(null); } }} onSubmit={async (formData) => { const ok = await gallery.save(formData, editingItem); if (ok) { setModalOpen(false); setEditingItem(null); } }} />
      <DeleteDialog item={deleteItem} deleting={gallery.deleting} onCancel={() => { if (!gallery.deleting) setDeleteItem(null); }} onConfirm={async () => { if (deleteItem && await gallery.remove(deleteItem)) setDeleteItem(null); }} />
    </div>
  );
}
