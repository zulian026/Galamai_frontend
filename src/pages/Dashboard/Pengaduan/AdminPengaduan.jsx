import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Forward,
  Eye,
  X,
  Download,
  Trash2,
  FileText,
} from "lucide-react";

// Import your actual auth context
// Adjust the import path according to your project structure
// import { useAuth } from '../context/AuthContext';

const useAuth = () => {
  // This is a placeholder - replace with actual import
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return { token, user };
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AdminPengaduanPage = () => {
  const { token, user } = useAuth();
  const [pengaduanList, setPengaduanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tanggapan, setTanggapan] = useState("");
  const [actionType, setActionType] = useState(""); // 'jawab' atau 'teruskan'
  const [submitting, setSubmitting] = useState(false);

  // Fetch semua pengaduan
  const fetchPengaduan = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/pengaduan`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data pengaduan");

      const data = await res.json();
      setPengaduanList(data.data || []);
    } catch (error) {
      console.error("Error fetching pengaduan:", error);
      alert("Gagal memuat data pengaduan");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail pengaduan
  const fetchDetailPengaduan = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/pengaduan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil detail pengaduan");

      const data = await res.json();
      setSelectedPengaduan(data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching detail:", error);
      alert("Gagal memuat detail pengaduan");
    }
  };

  // Update status pengaduan
  const updateStatus = async (status, tanggapanText = "") => {
    try {
      setSubmitting(true);
      const res = await fetch(
        `${API_URL}/api/admin/pengaduan/${selectedPengaduan.id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: status,
            tanggapan: tanggapanText,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengupdate status");

      const data = await res.json();

      alert(
        data.message || "Status berhasil diperbarui dan email telah dikirim"
      );
      setShowModal(false);
      setTanggapan("");
      setActionType("");
      fetchPengaduan(); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengupdate status");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle jawab langsung
  const handleJawabLangsung = () => {
    if (!tanggapan.trim()) {
      alert("Mohon isi tanggapan terlebih dahulu");
      return;
    }
    updateStatus("selesai", tanggapan);
  };

  // Handle teruskan ke Admin Fungsi
  const handleTeruskan = () => {
    const forwardMessage = `[DITERUSKAN KE ADMIN FUNGSI]\n\n${
      tanggapan ||
      "Pengaduan ini memerlukan penanganan lebih lanjut oleh Admin Fungsi."
    }`;
    updateStatus("diproses", forwardMessage);
  };

  // Handle hapus pengaduan
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus pengaduan ini?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/pengaduan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus pengaduan");

      alert("Pengaduan berhasil dihapus");
      fetchPengaduan();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus pengaduan");
    }
  };

  useEffect(() => {
    if (token) {
      fetchPengaduan();
    }
  }, [token]);

  const getStatusBadge = (status) => {
    const styles = {
      baru: "bg-blue-100 text-blue-800",
      diproses: "bg-yellow-100 text-yellow-800",
      selesai: "bg-green-100 text-green-800",
    };

    const icons = {
      baru: <AlertCircle className="w-4 h-4" />,
      diproses: <Clock className="w-4 h-4" />,
      selesai: <CheckCircle className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pengaduan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Manajemen Pengaduan
          </h1>
          <p className="text-gray-600">
            Kelola dan tanggapi pengaduan dari masyarakat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pengaduan Baru</p>
                <p className="text-3xl font-bold text-blue-600">
                  {pengaduanList.filter((p) => p.status === "baru").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sedang Diproses</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pengaduanList.filter((p) => p.status === "diproses").length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-3xl font-bold text-green-600">
                  {pengaduanList.filter((p) => p.status === "selesai").length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabel Pengaduan */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pelapor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Pengaduan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pengaduanList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Tidak ada pengaduan
                    </td>
                  </tr>
                ) : (
                  pengaduanList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.nama_lengkap}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.jenis_pengaduan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => fetchDetailPengaduan(item.id)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Detail & Tanggapan */}
      {showModal && selectedPengaduan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Detail Pengaduan #{selectedPengaduan.id}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTanggapan("");
                  setActionType("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedPengaduan.status)}
                <span className="text-sm text-gray-500">
                  {new Date(selectedPengaduan.created_at).toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>

              {/* Informasi Pelapor */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Informasi Pelapor
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-medium">
                      {selectedPengaduan.nama_lengkap}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">
                      {selectedPengaduan.email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No. Telepon</p>
                    <p className="font-medium">
                      {selectedPengaduan.no_telepon || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Umur</p>
                    <p className="font-medium">
                      {selectedPengaduan.umur || "-"} tahun
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Pengaduan */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Detail Pengaduan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Jenis Pengaduan</p>
                    <p className="font-medium">
                      {selectedPengaduan.jenis_pengaduan || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Produk</p>
                    <p className="font-medium">
                      {selectedPengaduan.nama_produk || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Perusahaan</p>
                    <p className="font-medium">
                      {selectedPengaduan.nama_perusahaan || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Produk</p>
                    <p className="font-medium">
                      {selectedPengaduan.jenis_produk || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pertanyaan/Keluhan */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Pertanyaan/Keluhan
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedPengaduan.pertanyaan || "Tidak ada pertanyaan"}
                </p>
              </div>

              {/* Lampiran */}
              {selectedPengaduan.attachments &&
                selectedPengaduan.attachments.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Lampiran
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedPengaduan.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:bg-gray-50"
                        >
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-sm truncate">
                            Lampiran {idx + 1}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Tanggapan Sebelumnya (jika ada) */}
              {selectedPengaduan.tanggapan && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Tanggapan Sebelumnya
                  </h3>
                  <p className="text-blue-900 whitespace-pre-wrap mb-2">
                    {selectedPengaduan.tanggapan}
                  </p>
                  {selectedPengaduan.admin && (
                    <p className="text-sm text-blue-700">
                      Ditanggapi oleh: {selectedPengaduan.admin.nama} pada{" "}
                      {new Date(
                        selectedPengaduan.tanggal_tanggapan
                      ).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              )}

              {/* Form Tanggapan (hanya jika belum selesai) */}
              {selectedPengaduan.status !== "selesai" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggapan Anda
                    </label>
                    <textarea
                      value={tanggapan}
                      onChange={(e) => setTanggapan(e.target.value)}
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tulis tanggapan Anda di sini..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleJawabLangsung}
                      disabled={submitting || !tanggapan.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      {submitting ? "Mengirim..." : "Jawab Langsung (Selesai)"}
                    </button>

                    <button
                      onClick={handleTeruskan}
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Forward className="w-5 h-5" />
                      {submitting
                        ? "Meneruskan..."
                        : "Teruskan ke Admin Fungsi"}
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      ℹ️ Informasi Alur Pengaduan
                    </h4>
                    <ul className="text-sm text-blue-900 space-y-1">
                      <li>
                        • <strong>Jawab Langsung:</strong> Jika Anda bisa
                        menyelesaikan pengaduan ini, jawaban akan dikirim via
                        email dan status menjadi "Selesai"
                      </li>
                      <li>
                        • <strong>Teruskan:</strong> Jika memerlukan penanganan
                        Admin Fungsi, pengaduan akan diteruskan dan status
                        menjadi "Diproses"
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedPengaduan.status === "selesai" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-semibold">
                    Pengaduan ini sudah selesai ditangani
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPengaduanPage;
