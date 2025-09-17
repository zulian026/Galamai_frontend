import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Image,
  Search,
  Filter,
  X,
  AlertCircle,
  Loader2,
  Grid,
  List,
  Upload,
  Eye,
  Globe,
  Building2,
  Settings,
} from "lucide-react";
import { aplikasiService } from "../../../../services/aplikasiService";
import { useAuth } from "../../../../contexts/AuthContext";

export default function AplikasiDashboard() {
  const { user, token, loading: authLoading } = useAuth();

  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    nama_app: "",
    url: "",
    kategori: "internal",
    image: null,
    deskripsi: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Ambil data aplikasi menggunakan aplikasiService
  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aplikasiService.getAll();
      setApps(data);
    } catch (err) {
      console.error("Gagal fetch aplikasi", err);
      setError("Gagal memuat data aplikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Tambah / Update aplikasi menggunakan aplikasiService
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Anda harus login untuk melakukan aksi ini!");
      return;
    }

    if (!form.nama_app.trim()) {
      setError("Nama aplikasi wajib diisi!");
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      const formData = {
        nama_app: form.nama_app.trim(),
        url: form.url.trim(),
        kategori: form.kategori,
        deskripsi: form.deskripsi.trim(),
        image: form.image,
      };

      if (editingId) {
        await aplikasiService.update(editingId, formData, token);
        setError(null);
        console.log("Aplikasi berhasil diperbarui!");
      } else {
        await aplikasiService.add(formData, token);
        setError(null);
        console.log("Aplikasi berhasil ditambahkan!");
      }

      resetForm();
      await fetchApps();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        editingId
          ? "Gagal memperbarui aplikasi. Silakan coba lagi."
          : "Gagal menambahkan aplikasi. Silakan coba lagi."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Hapus aplikasi menggunakan aplikasiService
  const handleDelete = async (id) => {
    if (!token) {
      setError("Anda harus login untuk melakukan aksi ini!");
      return;
    }

    const app = apps.find((a) => a.id_aplikasi === id);
    if (!window.confirm(`Yakin hapus aplikasi "${app?.nama_app}"?`)) return;

    try {
      setError(null);
      await aplikasiService.delete(id, token);
      console.log("Aplikasi berhasil dihapus!");
      await fetchApps();
    } catch (err) {
      console.error("Error deleting app:", err);
      setError("Gagal menghapus aplikasi. Silakan coba lagi.");
    }
  };

  // Edit aplikasi → isi form dengan data lama
  const handleEdit = (app) => {
    setForm({
      nama_app: app.nama_app || "",
      url: app.url || "",
      kategori: app.kategori || "internal",
      image: null,
      deskripsi: app.deskripsi || "",
    });
    setEditingId(app.id_aplikasi);
    setIsFormVisible(true);
    setError(null);
  };

  // Reset form dan tutup modal
  const resetForm = () => {
    setForm({
      nama_app: "",
      url: "",
      kategori: "internal",
      image: null,
      deskripsi: "",
    });
    setEditingId(null);
    setIsFormVisible(false);
    setError(null);
  };

  const getCategoryConfig = (kategori) => {
    switch (kategori) {
      case "internal":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: Building2,
          label: "Internal",
        };
      case "eksternal":
        return {
          color: "bg-green-100 text-green-800",
          icon: Globe,
          label: "Eksternal",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Settings,
          label: "Lainnya",
        };
    }
  };

  // Filter applications
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.nama_app?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || app.kategori === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchApps();
  }, []);

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Aplikasi
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola semua aplikasi perusahaan di satu tempat
            </p>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Selamat datang,</p>
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-800 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side - Add Button */}
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              if (editingId) {
                resetForm();
              }
            }}
            disabled={!token}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Aplikasi
          </button>

          {/* Right Side - Search and Filters */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari aplikasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              <option value="internal">Internal</option>
              <option value="eksternal">Eksternal</option>
              <option value="lainnya">Lainnya</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Clear Filters */}
            {(searchTerm || categoryFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm || categoryFilter !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Filter aktif:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {categoryFilter}
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Aplikasi" : "Tambah Aplikasi Baru"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                disabled={submitLoading}
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Aplikasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama aplikasi"
                      value={form.nama_app}
                      onChange={(e) =>
                        setForm({ ...form, nama_app: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={submitLoading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL Aplikasi
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={form.url}
                      onChange={(e) =>
                        setForm({ ...form, url: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={submitLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={form.kategori}
                      onChange={(e) =>
                        setForm({ ...form, kategori: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={submitLoading}
                    >
                      <option value="internal">Internal</option>
                      <option value="eksternal">Eksternal</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon/Gambar
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.files[0] })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={submitLoading}
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    placeholder="Masukkan deskripsi aplikasi (opsional)"
                    value={form.deskripsi}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    disabled={submitLoading}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                    disabled={submitLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200"
                    disabled={submitLoading || !token}
                  >
                    {submitLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingId ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Applications Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Aplikasi ({filteredApps.length})
            </h3>
            <div className="text-sm text-gray-500">
              Total: {apps.length} aplikasi
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Memuat aplikasi...</span>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12">
            {apps.length === 0 ? (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Belum ada aplikasi
                </h3>
                <p className="text-gray-500 mb-4">
                  Mulai dengan menambahkan aplikasi pertama Anda
                </p>
                <button
                  onClick={() => setIsFormVisible(true)}
                  className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  disabled={!token}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Aplikasi
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tidak ada aplikasi yang cocok
                </h3>
                <p className="text-gray-500 mb-4">
                  Coba ubah filter atau kata kunci pencarian
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Reset Filter
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredApps.map((app) => {
                  const categoryConfig = getCategoryConfig(app.kategori);
                  const CategoryIcon = categoryConfig.icon;

                  return (
                    <div
                      key={app.id_aplikasi}
                      className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                    >
                      {/* App Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-shrink-0">
                          {app.image_url ? (
                            <img
                              src={app.image_url}
                              alt={app.nama_app}
                              className="h-12 w-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                            style={{ display: app.image_url ? "none" : "flex" }}
                          >
                            <CategoryIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryConfig.color}`}
                        >
                          {categoryConfig.label}
                        </span>
                      </div>

                      {/* App Info */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {app.nama_app}
                        </h4>
                        {app.deskripsi && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {app.deskripsi}
                          </p>
                        )}
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span className="truncate max-w-[200px]">
                              {app.url}
                            </span>
                          </a>
                        )}
                      </div>

                      {/* Actions */}
                      {token && (
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleEdit(app)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            disabled={submitLoading}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(app.id_aplikasi)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            disabled={submitLoading}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredApps.map((app) => {
                  const categoryConfig = getCategoryConfig(app.kategori);
                  const CategoryIcon = categoryConfig.icon;

                  return (
                    <div
                      key={app.id_aplikasi}
                      className="px-6 py-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            {app.image_url ? (
                              <img
                                src={app.image_url}
                                alt={app.nama_app}
                                className="h-12 w-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                              style={{
                                display: app.image_url ? "none" : "flex",
                              }}
                            >
                              <CategoryIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900 truncate">
                                {app.nama_app}
                              </h4>
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryConfig.color}`}
                              >
                                {categoryConfig.label}
                              </span>
                            </div>

                            {app.deskripsi && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {app.deskripsi}
                              </p>
                            )}

                            {app.url && (
                              <a
                                href={app.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{app.url}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {token && (
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <button
                              onClick={() => handleEdit(app)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              disabled={submitLoading}
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(app.id_aplikasi)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={submitLoading}
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
