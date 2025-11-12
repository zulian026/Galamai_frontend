import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { artikelService } from "../../../../services/artikelService";
import { useAuth } from "../../../../contexts/AuthContext";
import ArtikelForm from "./ArtikelForm";
import ArtikelTable from "./ArtikelTable";
import ArtikelPreview from "./ArtikelPreview";
import { useConfirm } from "../../../../contexts/ConfirmModalContext";
import { useToast } from "../../../../contexts/ToastContext";

export default function AdminArtikel() {
  const { token } = useAuth();
  const { getAll, delete: remove, update, publish } = artikelService;
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const [artikel, setArtikel] = useState([]);
  const [filteredArtikel, setFilteredArtikel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingArtikel, setEditingArtikel] = useState(null);
  const [previewArtikel, setPreviewArtikel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // ====== Fetch Artikel ======
  const fetchArtikel = async () => {
    setLoading(true);
    try {
      const data = await getAll(token);
      if (data.success) {
        setArtikel(data.data);
        setFilteredArtikel(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchArtikel();
  }, [token]);

  // ====== Filter Articles by Status ======
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredArtikel(artikel);
    } else {
      setFilteredArtikel(
        artikel.filter((item) => item.status === statusFilter)
      );
    }
  }, [artikel, statusFilter]);

  // ====== Handlers ======
  const handleAdd = () => {
    setEditingArtikel(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingArtikel(item);
    setShowForm(true);
  };

  const handlePreview = (item) => {
    setPreviewArtikel(item);
    setShowPreview(true);
  };

  const handleDelete = async (id) => {
    confirm(
      "Konfirmasi Hapus",
      "Yakin ingin menghapus artikel ini?",
      async () => {
        try {
          const data = await remove(id, token);
          if (data.success) {
            fetchArtikel();
            showToast("Artikel berhasil dihapus!", "success");
          } else {
            showToast(data.message || "Gagal menghapus artikel", "error");
          }
        } catch (err) {
          console.error("Delete error:", err);
          showToast("Gagal menghapus artikel", "error");
        }
      }
    );
  };

  // ====== Publish Handler ======
  const handlePublish = async (id) => {
    try {
      const data = await publish(id, token); // 🔹 pake endpoint khusus publish
      if (data.success) {
        fetchArtikel();
        alert("Artikel berhasil dipublish!");
        if (previewArtikel && previewArtikel.id === id) {
          setPreviewArtikel((prev) => ({ ...prev, status: "published" }));
        }
      } else {
        alert(data.message || "Gagal publish artikel");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Gagal publish artikel");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingArtikel(null);
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    setPreviewArtikel(null);
  };

  const handleFormSuccess = () => {
    fetchArtikel();
    handleFormClose();
  };

  // Show form if showForm is true
  if (showForm) {
    return (
      <ArtikelForm
        editingArtikel={editingArtikel}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  // Show preview if showPreview is true
  if (showPreview) {
    return (
      <ArtikelPreview
        artikel={previewArtikel}
        onClose={handlePreviewClose}
        onEdit={() => {
          setShowPreview(false);
          handleEdit(previewArtikel);
        }}
        onPublish={handlePublish}
      />
    );
  }

  // Count articles by status
  const draftCount = artikel.filter((item) => item.status === "draft").length;
  const publishedCount = artikel.filter(
    (item) => item.status === "publish"
  ).length;

  // ====== Main Page Render ======
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
            <p className="text-gray-600 mt-1">
              Kelola artikel dan konten edukasi
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Plus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      {/* Stats & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {artikel.length}
          </div>
          <div className="text-gray-600 text-sm">Total Artikel</div>
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

        {/* Filter Dropdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 border-0 text-sm font-medium focus:ring-0 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Info */}
      {statusFilter !== "all" && (
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              Menampilkan {filteredArtikel.length} artikel dengan status:
              <span className="font-semibold ml-1">
                {statusFilter === "published" ? "Published" : "Draft"}
              </span>
              <button
                onClick={() => setStatusFilter("all")}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Tampilkan semua
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Table Component */}
      <ArtikelTable
        artikel={filteredArtikel}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />
    </div>
  );
}
