import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { beritaEventService } from "../../../../services/beritaEventService";
import { useAuth } from "../../../../contexts/AuthContext";
import BeritaForm from "./BeritaForm";
import BeritaTable from "./BeritaTable";
import BeritaPreview from "./BeritaPreview";

export default function AdminBeritaEvent() {
  const { token } = useAuth();
  const { getAll, delete: remove, update, publish } = beritaEventService;

  const [berita, setBerita] = useState([]);
  const [filteredBerita, setFilteredBerita] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingBerita, setEditingBerita] = useState(null);
  const [previewBerita, setPreviewBerita] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // ====== Fetch Berita ======
  const fetchBerita = async () => {
    setLoading(true);
    try {
      const data = await getAll(token);
      if (data.success) {
        setBerita(data.data);
        setFilteredBerita(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchBerita();
  }, [token]);

  // ====== Filter by Status and Type ======
  useEffect(() => {
    let filtered = [...berita];

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    setFilteredBerita(filtered);
  }, [berita, statusFilter, typeFilter]);

  // ====== Handlers ======
  const handleAdd = () => {
    setEditingBerita(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingBerita(item);
    setShowForm(true);
  };

  const handlePreview = (item) => {
    setPreviewBerita(item);
    setShowPreview(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus berita/event ini?")) return;
    try {
      const data = await remove(id, token);
      if (data.success) {
        fetchBerita();
        alert("Berita/Event berhasil dihapus!");
      } else {
        alert(data.message || "Gagal menghapus berita/event");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus berita/event");
    }
  };

  // ====== Publish Handler ======
  const handlePublish = async (id) => {
    try {
      const data = await publish(id, token);
      if (data.success) {
        fetchBerita();
        alert("Berita/Event berhasil dipublish!");
        if (previewBerita && previewBerita.id === id) {
          setPreviewBerita((prev) => ({ ...prev, status: "publish" }));
        }
      } else {
        alert(data.message || "Gagal publish berita/event");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Gagal publish berita/event");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBerita(null);
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    setPreviewBerita(null);
  };

  const handleFormSuccess = () => {
    fetchBerita();
    handleFormClose();
  };

  // Show form if showForm is true
  if (showForm) {
    return (
      <BeritaForm
        editingBerita={editingBerita}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  // Show preview if showPreview is true
  if (showPreview) {
    return (
      <BeritaPreview
        berita={previewBerita}
        onClose={handlePreviewClose}
        onEdit={() => {
          setShowPreview(false);
          handleEdit(previewBerita);
        }}
        onPublish={handlePublish}
      />
    );
  }

  // Count by status and type
  const draftCount = berita.filter((item) => item.status === "draft").length;
  const publishedCount = berita.filter(
    (item) => item.status === "publish"
  ).length;
  const beritaCount = berita.filter((item) => item.type === "berita").length;
  const eventCount = berita.filter((item) => item.type === "event").length;

  // ====== Main Page Render ======
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Berita & Event</h1>
            <p className="text-gray-600 mt-1">Kelola konten berita dan event</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Plus size={18} /> Tambah Konten
          </button>
        </div>
      </div>

      {/* Stats & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {berita.length}
          </div>
          <div className="text-gray-600 text-sm">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {publishedCount}
          </div>
          <div className="text-gray-600 text-sm">Published</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          <div className="text-gray-600 text-sm">Draft</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{beritaCount}</div>
          <div className="text-gray-600 text-sm">Berita</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{eventCount}</div>
          <div className="text-gray-600 text-sm">Event</div>
        </div>

        {/* Filter Dropdowns */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 border-0 text-xs font-medium focus:ring-0 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="publish">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border-0 text-xs font-medium focus:ring-0 focus:outline-none"
            >
              <option value="all">Semua Tipe</option>
              <option value="berita">Berita</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Info */}
      {(statusFilter !== "all" || typeFilter !== "all") && (
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              Menampilkan {filteredBerita.length} konten
              {statusFilter !== "all" && (
                <span className="font-semibold ml-1">
                  {statusFilter === "publish" ? "Published" : "Draft"}
                </span>
              )}
              {typeFilter !== "all" && (
                <span className="font-semibold ml-1">
                  {typeFilter === "berita" ? "Berita" : "Event"}
                </span>
              )}
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Tampilkan semua
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Table Component */}
      <BeritaTable
        berita={filteredBerita}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />
    </div>
  );
}
