import { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Globe,
  Smartphone,
} from "lucide-react";

export default function AplikasiDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("all");
  const [form, setForm] = useState({
    nama_app: "",
    url: "",
    image: "",
    kategori: "internal",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const token = localStorage.getItem("token");

  // fetch data
  const fetchApps = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8000/api/aplikasi", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat data: ${res.status}`);
      }

      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApps();
    } else {
      setError("Token tidak ditemukan, silakan login dulu.");
      setLoading(false);
    }
  }, [token]);

  // tambah/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8000/api/aplikasi/${editingId}`
      : "http://localhost:8000/api/aplikasi";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Gagal simpan: ${msg}`);
      }

      setForm({ nama_app: "", url: "", image: "", kategori: "internal" });
      setEditingId(null);
      setIsFormOpen(false);
      fetchApps();
    } catch (err) {
      setError(err.message);
    }
  };

  // hapus
  const handleDelete = async (id, nama) => {
    if (!confirm(`Yakin hapus aplikasi "${nama}"?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/aplikasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Gagal hapus aplikasi");
      }

      fetchApps();
    } catch (err) {
      setError(err.message);
    }
  };

  // edit
  const handleEdit = (app) => {
    setForm({
      nama_app: app.nama_app || "",
      url: app.url || "",
      image: app.image || "",
      kategori: app.kategori || "internal",
    });
    setEditingId(app.id_aplikasi);
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setForm({ nama_app: "", url: "", image: "", kategori: "internal" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Filter aplikasi
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.nama_app?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.url?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesKategori =
      selectedKategori === "all" || app.kategori === selectedKategori;

    return matchesSearch && matchesKategori;
  });

  const getKategoriIcon = (kategori) => {
    switch (kategori) {
      case "internal":
        return <Smartphone className="w-4 h-4" />;
      case "eksternal":
        return <Globe className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getKategoriColor = (kategori) => {
    switch (kategori) {
      case "internal":
        return "bg-green-50 text-green-700 border-green-200";
      case "eksternal":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm text-gray-600">Memuat data aplikasi...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Manajemen Aplikasi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kelola aplikasi dan layanan digital
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Tambah Aplikasi
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-red-500">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Terjadi Kesalahan</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchApps}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingId ? "Edit Aplikasi" : "Tambah Aplikasi Baru"}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Aplikasi
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama aplikasi"
                  value={form.nama_app}
                  onChange={(e) =>
                    setForm({ ...form, nama_app: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Aplikasi
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Path Gambar
                </label>
                <input
                  type="text"
                  placeholder="/path/to/image.png"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="internal">Internal</option>
                  <option value="eksternal">Eksternal</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {editingId ? "Update Aplikasi" : "Tambah Aplikasi"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari aplikasi berdasarkan nama atau URL..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Semua Kategori</option>
              <option value="internal">Internal</option>
              <option value="eksternal">Eksternal</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Daftar Aplikasi ({filteredApps.length})
          </h2>

          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id_aplikasi}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-semibold text-white">
                            {app.nama_app?.charAt(0)?.toUpperCase() || "A"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {app.nama_app || "Nama tidak tersedia"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getKategoriColor(
                                app.kategori
                              )}`}
                            >
                              {getKategoriIcon(app.kategori)}
                              {app.kategori || "Lainnya"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {app.url && (
                        <div className="mb-4">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {app.url.length > 40
                              ? `${app.url.substring(0, 40)}...`
                              : app.url}
                          </a>
                        </div>
                      )}

                      {app.image && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Gambar:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {app.image}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(app)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(app.id_aplikasi, app.nama_app)
                      }
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">
                    {searchTerm || selectedKategori !== "all"
                      ? "Tidak ada aplikasi yang sesuai filter"
                      : "Belum ada aplikasi terdaftar"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {searchTerm || selectedKategori !== "all"
                      ? "Coba ubah kata kunci pencarian atau filter"
                      : "Tambahkan aplikasi baru untuk memulai"}
                  </div>
                </div>
                {(searchTerm || selectedKategori !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedKategori("all");
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      {filteredApps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Menampilkan {filteredApps.length} dari {apps.length} aplikasi
            </span>
            <span>
              {apps.filter((app) => app.kategori === "internal").length}{" "}
              Internal •{" "}
              {apps.filter((app) => app.kategori === "eksternal").length}{" "}
              Eksternal •{" "}
              {apps.filter((app) => app.kategori === "lainnya").length} Lainnya
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
