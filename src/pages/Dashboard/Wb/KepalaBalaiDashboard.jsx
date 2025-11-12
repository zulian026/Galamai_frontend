import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Loader,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";

export default function KepalaBalaiDashboard() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/whistleblowing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Tambahkan Authorization header jika diperlukan
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();

      // Debug: lihat nilai sebenarnya
      if (result.data && result.data.length > 0) {
        console.log("Data pertama:", result.data[0]);
        console.log(
          "dikirim_ke_kepala:",
          result.data[0].dikirim_ke_kepala,
          "Type:",
          typeof result.data[0].dikirim_ke_kepala
        );
        console.log(
          "status:",
          result.data[0].status,
          "Type:",
          typeof result.data[0].status
        );
      }

      // Tampilkan semua laporan (tanpa filter dulu untuk debug)
      const allData = result.data || [];
      console.log("Semua laporan:", allData);
      setLaporan(allData);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil detail");

      const result = await response.json();
      setSelectedLaporan(result.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memuat detail laporan");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Gagal update status");

      alert("Status laporan berhasil diperbarui");
      fetchLaporan();
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memperbarui status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus laporan ini? Tindakan ini tidak bisa dibatalkan!"
      )
    )
      return;

    try {
      const response = await fetch(`${API_BASE_URL}/whistleblowing/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus");

      alert("Laporan berhasil dihapus");
      fetchLaporan();
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus laporan");
    }
  };

  const filteredLaporan = laporan.filter((item) => {
    const matchSearch =
      item.nama_lengkap_user
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indikasi_pelanggaran
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
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

  const getStatusStats = () => {
    return {
      proses: laporan.filter((l) => l.status === "proses").length,
      selesai: laporan.filter((l) => l.status === "selesai").length,
      total: laporan.length,
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader
            size={48}
            className="animate-spin mx-auto mb-4 text-blue-600"
          />
          <p className="text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <FileText size={32} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Kepala Balai</h1>
            <p className="text-red-100">
              Kelola dan tindaklanjuti laporan whistleblowing
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">
                Total Laporan Diterima
              </div>
              <div className="text-3xl font-bold text-red-600 mt-1">
                {stats.total}
              </div>
            </div>
            <TrendingUp size={48} className="text-red-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">
                Sedang Diproses
              </div>
              <div className="text-3xl font-bold text-yellow-600 mt-1">
                {stats.proses}
              </div>
            </div>
            <Clock size={48} className="text-yellow-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">
                Selesai Ditindaklanjuti
              </div>
              <div className="text-3xl font-bold text-green-600 mt-1">
                {stats.selesai}
              </div>
            </div>
            <CheckCircle size={48} className="text-green-100" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama pelapor, email, atau jenis pelanggaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
            </select>
            <button
              onClick={fetchLaporan}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        {filteredLaporan.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Tidak ada laporan yang ditemukan
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Laporan yang dikirim dari admin akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama Pelapor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Indikasi Pelanggaran
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Oknum
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Tanggal Terima
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporan.map((item, idx) => (
                    <tr
                      key={item.id_whistle}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.nama_lengkap_user}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                        {item.indikasi_pelanggaran}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                        {item.oknum_pelanggaran || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetail(item.id_whistle)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 text-sm font-medium"
                        >
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

      {/* Detail Modal */}
      {showDetailModal && selectedLaporan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold">
                Detail Laporan Whistleblowing
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status & Timeline */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Status Saat Ini
                  </p>
                  <p className="mt-2">
                    {getStatusBadge(selectedLaporan.status)}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Tanggal Diterima
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {new Date(selectedLaporan.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Data Pelapor */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={20} /> Data Pelapor
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Nama</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedLaporan.nama_lengkap_user}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedLaporan.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      No. Telepon
                    </p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedLaporan.kontak}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Profesi</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedLaporan.profesi || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Tanggal Lahir
                    </p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedLaporan.tgl_lahir
                        ? new Date(
                            selectedLaporan.tgl_lahir
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Alamat</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedLaporan.alamat || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Pelanggaran */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} /> Detail Pelanggaran
                </h3>
                <div className="space-y-4 bg-red-50 p-4 rounded-lg border border-red-200">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Indikasi Pelanggaran
                    </p>
                    <p className="text-gray-900 mt-1 font-semibold text-lg">
                      {selectedLaporan.indikasi_pelanggaran}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Lokasi Pelanggaran
                      </p>
                      <p className="text-gray-900 mt-1">
                        {selectedLaporan.lokasi_pelanggaran || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Oknum yang Melakukan
                      </p>
                      <p className="text-gray-900 mt-1">
                        {selectedLaporan.oknum_pelanggaran || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Kronologi Pelanggaran
                    </p>
                    <p className="text-gray-900 mt-2 p-3 bg-white rounded border border-gray-200 whitespace-pre-wrap">
                      {selectedLaporan.kronologi || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* File Pendukung */}
              {selectedLaporan.data_pendukung && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    File Pendukung
                  </h3>
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

              {/* Action Buttons */}
              <div className="border-t pt-4 space-y-3">
                {selectedLaporan.status === "proses" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedLaporan.id_whistle, "selesai")
                    }
                    disabled={updating}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                    Tandai Sebagai Selesai Ditindaklanjuti
                  </button>
                )}

                {selectedLaporan.status === "selesai" && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                    <CheckCircle
                      size={24}
                      className="mx-auto text-green-600 mb-2"
                    />
                    <p className="text-green-700 font-semibold">
                      Laporan telah selesai ditindaklanjuti
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(selectedLaporan.id_whistle)}
                  disabled={updating}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Hapus Laporan
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  disabled={updating}
                  className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition"
                >
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
