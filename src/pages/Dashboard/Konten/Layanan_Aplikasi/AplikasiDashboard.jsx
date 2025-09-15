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
} from "lucide-react";
import { aplikasiService } from "../../../../services/aplikasiService";
import { useAuth } from "../../../../contexts/AuthContext";
// service layer

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
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
        // Update menggunakan aplikasiService
        await aplikasiService.update(editingId, formData, token);
        setError(null);
        console.log("Aplikasi berhasil diperbarui!");
      } else {
        // Tambah menggunakan aplikasiService
        await aplikasiService.add(formData, token);
        setError(null);
        console.log("Aplikasi berhasil ditambahkan!");
      }

      // Reset form
      resetForm();

      // Refresh data
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

      // Refresh data
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
      image: null, // Reset image field for security
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

  const getCategoryColor = (kategori) => {
    switch (kategori) {
      case "internal":
        return "bg-blue-100 text-blue-800";
      case "eksternal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Aplikasi
              </h1>
              <p className="text-gray-600">
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
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Button Tambah & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              if (editingId) {
                resetForm();
              }
            }}
            disabled={!token}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Aplikasi
          </button>

          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>

        {/* Filter Section */}
        {isFilterVisible && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Filter Aplikasi
              </h3>
              <button
                onClick={() => setIsFilterVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Aplikasi
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, URL, atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="internal">Internal</option>
                  <option value="eksternal">Eksternal</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Filter Summary & Clear */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Menampilkan {filteredApps.length} dari {apps.length} aplikasi
                {searchTerm && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    "{searchTerm}"
                  </span>
                )}
                {categoryFilter !== "all" && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {categoryFilter}
                  </span>
                )}
              </div>

              {(searchTerm || categoryFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form Modal */}
        {isFormVisible && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Aplikasi" : "Tambah Aplikasi Baru"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
                disabled={submitLoading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Aplikasi *
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama aplikasi"
                    value={form.nama_app}
                    onChange={(e) =>
                      setForm({ ...form, nama_app: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={form.kategori}
                    onChange={(e) =>
                      setForm({ ...form, kategori: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitLoading}
                  >
                    <option value="internal">Internal</option>
                    <option value="eksternal">Eksternal</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar/Icon
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitLoading}
                  />
                </div>
              </div>

              {/* Deskripsi Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Masukkan deskripsi aplikasi (opsional)"
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={submitLoading}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  disabled={submitLoading}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
                  disabled={submitLoading || !token}
                >
                  {submitLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingId ? "Update" : "Tambah"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List Aplikasi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Daftar Aplikasi ({filteredApps.length})
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Memuat aplikasi...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12">
              {apps.length === 0 ? (
                <>
                  <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada aplikasi
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Mulai dengan menambahkan aplikasi pertama Anda
                  </p>
                  <button
                    onClick={() => setIsFormVisible(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    disabled={!token}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Aplikasi
                  </button>
                </>
              ) : (
                <>
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada aplikasi yang cocok
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Coba ubah filter atau kata kunci pencarian
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Reset Filter
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApps.map((app) => (
                <div
                  key={app.id_aplikasi}
                  className="px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Image/Icon */}
                      <div className="flex-shrink-0">
                        {app.image ? (
                          <img
                            src={`http://localhost:8000/storage/${app.image}`}
                            alt={app.nama_app}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center"
                          style={{ display: app.image ? "none" : "flex" }}
                        >
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>

                      {/* App Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-lg font-medium text-gray-900 truncate">
                            {app.nama_app}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              app.kategori
                            )}`}
                          >
                            {app.kategori}
                          </span>
                        </div>

                        {/* Deskripsi */}
                        {app.deskripsi && (
                          <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                            {app.deskripsi}
                          </p>
                        )}

                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {app.url}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {token && (
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(app)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                          disabled={submitLoading}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id_aplikasi)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors duration-200"
                          disabled={submitLoading}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
