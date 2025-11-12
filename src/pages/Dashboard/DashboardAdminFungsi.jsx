import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Eye,
  X,
  FileText,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

const useAuth = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return { token, user };
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AdminFungsiPage = () => {
  const { token, user } = useAuth();
  const [pengaduanList, setPengaduanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tanggapan, setTanggapan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("diproses"); // default tampilkan yang diproses

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

      if (!res.ok) {
        if (res.status === 403) {
          alert(
            'Akses ditolak! Pastikan role Anda adalah "Admin Fungsi" atau "Admin Pengaduan".'
          );
          throw new Error("Forbidden: Role tidak memiliki akses");
        }
        throw new Error(`HTTP ${res.status}: Gagal mengambil data pengaduan`);
      }

      const data = await res.json();
      setPengaduanList(data.data || []);
    } catch (error) {
      console.error("Error fetching pengaduan:", error);
      // Jangan alert jika sudah di-handle sebelumnya
      if (!error.message.includes("Forbidden")) {
        alert("Gagal memuat data pengaduan: " + error.message);
      }
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

  // Kirim jawaban final (selesaikan pengaduan)
  const handleKirimJawaban = async () => {
    if (!tanggapan.trim()) {
      alert("Mohon isi tanggapan terlebih dahulu");
      return;
    }

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
            status: "selesai",
            tanggapan: tanggapan,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengirim jawaban");

      const data = await res.json();

      // Tampilkan pesan berdasarkan status email
      if (data.email_sent) {
        alert(
          "✅ " + (data.message || "Jawaban berhasil dikirim ke email pelapor")
        );
      } else if (data.email_error) {
        alert(
          "⚠️ Status diupdate tapi email gagal dikirim.\nError: " +
            data.email_error
        );
      } else {
        alert(data.message || "Status berhasil diperbarui");
      }

      setShowModal(false);
      setTanggapan("");
      fetchPengaduan(); // Refresh list
    } catch (error) {
      console.error("Error sending answer:", error);
      alert("Gagal mengirim jawaban");
    } finally {
      setSubmitting(false);
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

  // Filter pengaduan berdasarkan status
  const filteredPengaduan = pengaduanList.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  // Hitung pengaduan yang diteruskan (diproses) dan belum selesai
  const pengaduanDiteruskan = pengaduanList.filter(
    (p) =>
      p.status === "diproses" &&
      p.tanggapan &&
      p.tanggapan.includes("[DITERUSKAN KE ADMIN FUNGSI]")
  );

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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Admin Fungsi - Penanganan Pengaduan
          </h1>
          <p className="opacity-90">
            Menangani pengaduan yang diteruskan dari Admin Pengaduan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Ditangani</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pengaduanDiteruskan.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Diteruskan dari Admin Pengaduan
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Diproses</p>
                <p className="text-3xl font-bold text-blue-600">
                  {pengaduanList.filter((p) => p.status === "diproses").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Sedang dalam penanganan
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai Ditangani</p>
                <p className="text-3xl font-bold text-green-600">
                  {pengaduanList.filter((p) => p.status === "selesai").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Sudah selesai</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("diproses")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "diproses"
                  ? "bg-yellow-100 text-yellow-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Perlu Ditangani ({pengaduanDiteruskan.length})
            </button>
            <button
              onClick={() => setFilter("selesai")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "selesai"
                  ? "bg-green-100 text-green-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Sudah Selesai (
              {pengaduanList.filter((p) => p.status === "selesai").length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Semua Pengaduan ({pengaduanList.length})
            </button>
          </div>
        </div>

        {/* Info Banner untuk Pengaduan Diteruskan */}
        {filter === "diproses" && pengaduanDiteruskan.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Ada {pengaduanDiteruskan.length} pengaduan yang perlu
                  ditangani
                </h3>
                <p className="text-sm text-yellow-700">
                  Pengaduan ini telah diteruskan oleh Admin Pengaduan karena
                  memerlukan penanganan lebih lanjut dari Admin Fungsi.
                </p>
              </div>
            </div>
          </div>
        )}

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
                    Diteruskan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPengaduan.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {filter === "diproses"
                        ? "Tidak ada pengaduan yang perlu ditangani"
                        : "Tidak ada pengaduan"}
                    </td>
                  </tr>
                ) : (
                  filteredPengaduan.map((item) => {
                    const isDiteruskan =
                      item.tanggapan &&
                      item.tanggapan.includes("[DITERUSKAN KE ADMIN FUNGSI]");
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 ${
                          isDiteruskan && item.status === "diproses"
                            ? "bg-yellow-50"
                            : ""
                        }`}
                      >
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isDiteruskan ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              <ArrowLeft className="w-3 h-3" />
                              Ya
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => fetchDetailPengaduan(item.id)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                            {item.status === "diproses" && isDiteruskan
                              ? "Tangani"
                              : "Lihat Detail"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Detail Pengaduan #{selectedPengaduan.id}
                </h2>
                {selectedPengaduan.tanggapan &&
                  selectedPengaduan.tanggapan.includes(
                    "[DITERUSKAN KE ADMIN FUNGSI]"
                  ) && (
                    <span className="inline-flex items-center gap-1 mt-1 text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                      <ArrowLeft className="w-3 h-3" />
                      Diteruskan dari Admin Pengaduan
                    </span>
                  )}
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTanggapan("");
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
                  👤 Informasi Pelapor
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-medium">
                      {selectedPengaduan.nama_lengkap || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Umur</p>
                    <p className="font-medium">
                      {selectedPengaduan.umur
                        ? `${selectedPengaduan.umur} tahun`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-blue-600">
                      {selectedPengaduan.email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No. Telepon</p>
                    <p className="font-medium">
                      {selectedPengaduan.no_telepon || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="font-medium">
                      {selectedPengaduan.alamat || "-"}
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
                    <p className="text-sm text-gray-600">Tanggal Kejadian</p>
                    <p className="font-medium">
                      {selectedPengaduan.tanggal
                        ? new Date(
                            selectedPengaduan.tanggal
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jam Kejadian</p>
                    <p className="font-medium">
                      {selectedPengaduan.jam || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alamat Kejadian</p>
                    <p className="font-medium">
                      {selectedPengaduan.alamat || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informasi Perusahaan */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Informasi Perusahaan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Perusahaan</p>
                    <p className="font-medium">
                      {selectedPengaduan.nama_perusahaan || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Perusahaan</p>
                    <p className="font-medium">
                      {selectedPengaduan.jenis_perusahaan || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Identitas Produk */}
              <div
                style={{ backgroundColor: "#eff6ff", borderColor: "#93c5fd" }}
                className="rounded-lg p-4 border-2"
              >
                <h3 className="font-semibold mb-3" style={{ color: "#1e40af" }}>
                  🏷️ Identitas Produk
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      Nama Produk
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.nama_produk || "-"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      Jenis Produk
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.jenis_produk || "-"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      No. Registrasi
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.no_registrasi || "-"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      Nomor Batch
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.batch || "-"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      Tanggal Kadaluarsa
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.kadaluarsa
                        ? new Date(
                            selectedPengaduan.kadaluarsa
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      Nama Pabrik
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.nama_pabrik || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2563eb" }}
                    >
                      Alamat Pabrik
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedPengaduan.alamat_pabrik || "-"}
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

              {/* Catatan dari Admin Pengaduan */}
              {selectedPengaduan.tanggapan && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Catatan dari Admin Pengaduan
                  </h3>
                  <p className="text-yellow-900 whitespace-pre-wrap mb-2">
                    {selectedPengaduan.tanggapan}
                  </p>
                  {selectedPengaduan.admin && (
                    <p className="text-sm text-yellow-700">
                      Oleh: {selectedPengaduan.admin.nama} pada{" "}
                      {new Date(
                        selectedPengaduan.tanggal_tanggapan
                      ).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              )}

              {/* Form Tanggapan Final (hanya jika status diproses) */}
              {selectedPengaduan.status === "diproses" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      📋 Instruksi Penanganan
                    </h4>
                    <p className="text-sm text-purple-900">
                      Sebagai Admin Fungsi, berikan jawaban final untuk
                      pengaduan ini. Jawaban Anda akan dikirim langsung ke email
                      pelapor dan status pengaduan akan berubah menjadi
                      "Selesai".
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jawaban Final untuk Pelapor
                    </label>
                    <textarea
                      value={tanggapan}
                      onChange={(e) => setTanggapan(e.target.value)}
                      rows="6"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tulis jawaban lengkap yang akan dikirim ke email pelapor..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email pelapor:{" "}
                      <span className="font-medium">
                        {selectedPengaduan.email}
                      </span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleKirimJawaban}
                    disabled={submitting || !tanggapan.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    {submitting
                      ? "Mengirim Jawaban..."
                      : "Kirim Jawaban Final & Selesaikan Pengaduan"}
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      ℹ️ Yang Akan Terjadi:
                    </h4>
                    <ul className="text-sm text-blue-900 space-y-1">
                      <li>
                        ✅ Jawaban Anda akan dikirim ke email:{" "}
                        <strong>{selectedPengaduan.email}</strong>
                      </li>
                      <li>
                        ✅ Status pengaduan akan berubah menjadi{" "}
                        <strong>"Selesai"</strong>
                      </li>
                      <li>
                        ✅ Pelapor akan mendapat notifikasi email otomatis
                      </li>
                      <li>
                        ✅ Pengaduan tidak dapat diubah lagi setelah selesai
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Jika sudah selesai */}
              {selectedPengaduan.status === "selesai" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-semibold mb-1">
                    Pengaduan Sudah Selesai Ditangani
                  </p>
                  <p className="text-sm text-green-700">
                    Jawaban telah dikirim ke email pelapor
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

export default AdminFungsiPage;
