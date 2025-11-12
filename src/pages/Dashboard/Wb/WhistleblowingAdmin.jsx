import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext"; // <- sesuaikan path
import {
  Eye,
  Send,
  Trash2,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Loader2,
} from "lucide-react";

export default function WhistleblowingAdmin() {
  const { token, logout } = useAuth();

  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = "http://localhost:8000/api";

  // helper: buat header termasuk Authorization bila token ada
  const authHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // fetch semua laporan
  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/whistleblowing`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (response.status === 401) {
        // token invalid/expired -> logout
        logout();
        setError("Sesi berakhir. Silakan login ulang.");
        return;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Gagal mengambil data (${response.status}) ${text}`);
      }

      const result = await response.json();
      setLaporan(result.data || []);
    } catch (err) {
      console.error("Error fetchLaporan:", err);
      setError("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // jika endpoint memerlukan token, tunggu token tersedia
    // jika endpoint publik, bisa panggil walau token null (sesuaikan kebutuhan)
    if (token) {
      fetchLaporan();
    } else {
      // kalau tidak ada token, tetap coba ambil (opsional) atau set loading false
      // di sini saya set loading false dan tampilkan instruksi login
      setLoading(false);
      setLaporan([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleViewDetail = async (id) => {
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (response.status === 401) {
        logout();
        setError("Sesi berakhir. Silakan login ulang.");
        return;
      }

      if (!response.ok) throw new Error(`Gagal mengambil detail (${response.status})`);

      const result = await response.json();
      setSelectedLaporan(result.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Error handleViewDetail:", err);
      setError("Gagal memuat detail laporan");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401) {
        logout();
        setError("Sesi berakhir. Silakan login ulang.");
        return;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Gagal update status (${response.status}) ${text}`);
      }

      setSuccess("Status laporan berhasil diperbarui");
      setTimeout(() => setSuccess(""), 3000);
      await fetchLaporan();
      setShowDetailModal(false);
    } catch (err) {
      console.error("Error handleUpdateStatus:", err);
      setError("Gagal memperbarui status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendToKepala = async (id) => {
    if (!window.confirm("Yakin ingin mengirim laporan ini ke Kepala Balai?")) return;

    try {
      setUpdating(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          status: "proses",
          dikirim_ke_kepala: true,
        }),
      });

      if (response.status === 401) {
        logout();
        setError("Sesi berakhir. Silakan login ulang.");
        return;
      }

      if (!response.ok) throw new Error(`Gagal mengirim (${response.status})`);

      setSuccess("Laporan berhasil dikirim ke Kepala Balai");
      setTimeout(() => setSuccess(""), 3000);
      await fetchLaporan();
      setShowDetailModal(false);
    } catch (err) {
      console.error("Error handleSendToKepala:", err);
      setError("Gagal mengirim laporan");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini? Tindakan ini tidak bisa dibatalkan!")) return;

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (response.status === 401) {
        logout();
        setError("Sesi berakhir. Silakan login ulang.");
        return;
      }

      if (!response.ok) throw new Error(`Gagal menghapus (${response.status})`);

      setSuccess("Laporan berhasil dihapus");
      setTimeout(() => setSuccess(""), 3000);
      await fetchLaporan();
      setShowDetailModal(false);
    } catch (err) {
      console.error("Error handleDelete:", err);
      setError("Gagal menghapus laporan");
    }
  };

  const filteredLaporan = laporan.filter((item) => {
    const matchSearch =
      item.nama_lengkap_user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indikasi_pelanggaran?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "baru":
        return (
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-fit">
            <AlertCircle size={14} /> Baru
          </span>
        );
      case "proses":
        return (
          <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1 w-fit">
            <Clock size={14} /> Proses
          </span>
        );
      case "selesai":
        return (
          <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full flex items-center gap-1 w-fit">
            <CheckCircle size={14} /> Selesai
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusStats = () => ({
    baru: laporan.filter((l) => l.status === "baru").length,
    proses: laporan.filter((l) => l.status === "proses").length,
    selesai: laporan.filter((l) => l.status === "selesai").length,
    total: laporan.length,
  });

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada token, tampilkan pesan agar login
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-700 mb-4">Anda belum login.</p>
          <p className="text-gray-500">Silakan login untuk melihat halaman admin whistleblowing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 m-6 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Whistleblowing</h1>
        <p className="text-gray-600 mt-1">Kelola laporan pelanggaran dan kirim ke Kepala Balai</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-800 flex-1">{error}</p>
            <button onClick={() => setError("")} className="ml-3 text-red-600 hover:text-red-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mx-6 mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <p className="text-green-800 flex-1">{success}</p>
            <button onClick={() => setSuccess("")} className="ml-3 text-green-600 hover:text-green-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Total Laporan</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Baru</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.baru}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Proses</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.proses}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Selesai</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.selesai}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, email, atau jenis pelanggaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Semua Status</option>
              <option value="baru">Baru</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        {filteredLaporan.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">Tidak ada laporan yang ditemukan</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Pelapor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Indikasi Pelanggaran</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporan.map((item, idx) => (
                    <tr key={item.id_whistle} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.nama_lengkap_user}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{item.indikasi_pelanggaran}</td>
                      <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleViewDetail(item.id_whistle)} className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm font-medium transition-colors">
                          <Eye size={16} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal (sama seperti sebelumnya) */}
      {showDetailModal && selectedLaporan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-gray-900">Detail Laporan Whistleblowing</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Status Saat Ini</p>
                    <p className="mt-2">{getStatusBadge(selectedLaporan.status)}</p>
                  </div>
                  {selectedLaporan.dikirim_ke_kepala && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 font-medium">Dikirim ke Kepala</p>
                      <p className="text-green-600 font-semibold mt-1">✓ Sudah Dikirim</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Pelapor</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Nama Lengkap</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedLaporan.nama_lengkap_user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedLaporan.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Kontak</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedLaporan.kontak}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Profesi</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedLaporan.profesi || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tanggal Lahir</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedLaporan.tgl_lahir ? new Date(selectedLaporan.tgl_lahir).toLocaleDateString("id-ID") : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Alamat</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedLaporan.alamat || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Pelanggaran</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Indikasi Pelanggaran</p>
                    <p className="text-gray-900 mt-1">{selectedLaporan.indikasi_pelanggaran}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Lokasi Pelanggaran</p>
                    <p className="text-gray-900 mt-1">{selectedLaporan.lokasi_pelanggaran || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Oknum Pelanggaran</p>
                    <p className="text-gray-900 mt-1">{selectedLaporan.oknum_pelanggaran || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Kronologi</p>
                    <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">{selectedLaporan.kronologi || "-"}</p>
                  </div>
                </div>
              </div>

              {selectedLaporan.data_pendukung && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">File Pendukung</h3>
                  <a
                    href={`/storage/${selectedLaporan.data_pendukung}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
                  >
                    <Download size={16} />
                    Download {selectedLaporan.data_pendukung.split("/").pop()}
                  </a>
                </div>
              )}

              <div className="border-t pt-6 space-y-3">
                {selectedLaporan.status === "baru" && (
                  <button onClick={() => handleUpdateStatus(selectedLaporan.id_whistle, "proses")} disabled={updating} className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                    {updating ? <Loader2 size={18} className="animate-spin" /> : <Clock size={18} />}
                    Ubah Status ke Proses
                  </button>
                )}

                {selectedLaporan.status === "proses" && !selectedLaporan.dikirim_ke_kepala && (
                  <button onClick={() => handleSendToKepala(selectedLaporan.id_whistle)} disabled={updating} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                    {updating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Kirim ke Kepala Balai
                  </button>
                )}

                {selectedLaporan.status !== "selesai" && (
                  <button onClick={() => handleUpdateStatus(selectedLaporan.id_whistle, "selesai")} disabled={updating} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                    {updating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    Tandai Selesai
                  </button>
                )}

                <button onClick={() => handleDelete(selectedLaporan.id_whistle)} disabled={updating} className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                  {updating ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Hapus Laporan
                </button>

                <button onClick={() => setShowDetailModal(false)} disabled={updating} className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
