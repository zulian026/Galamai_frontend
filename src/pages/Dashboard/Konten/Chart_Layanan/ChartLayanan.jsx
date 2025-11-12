import { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  BarChart3,
  Calendar,
  Palette,
  List,
} from "lucide-react";

import { useToast } from "../../../../contexts/ToastContext";
import { useConfirm } from "../../../../contexts/ConfirmContext";

// Import services
import {
  getChartLayanan,
  createChartLayanan,
  updateChartLayanan,
  deleteChartLayanan,
} from "../../../../services/chartLayananService";

function ChartLayanan() {
  const [data, setData] = useState([]);
  const [layanans, setLayanans] = useState([]); // Data layanan dari API
  const [form, setForm] = useState({
    label: "",
    value: "",
    color: "bg-blue-500",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { showToast } = useToast();
  const token = localStorage.getItem("token");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [loadingLayanans, setLoadingLayanans] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const { confirm } = useConfirm();

  // Color options
  const colorOptions = [
    { value: "bg-blue-500", label: "Biru", preview: "#3B82F6" },
    { value: "bg-green-500", label: "Hijau", preview: "#10B981" },
    { value: "bg-red-500", label: "Merah", preview: "#EF4444" },
    { value: "bg-yellow-500", label: "Kuning", preview: "#F59E0B" },
    { value: "bg-purple-500", label: "Ungu", preview: "#A855F7" },
    { value: "bg-pink-500", label: "Pink", preview: "#EC4899" },
    { value: "bg-indigo-500", label: "Indigo", preview: "#6366F1" },
    { value: "bg-orange-500", label: "Orange", preview: "#F97316" },
    { value: "bg-teal-500", label: "Teal", preview: "#14B8A6" },
    { value: "bg-cyan-500", label: "Cyan", preview: "#06B6D4" },
  ];

  // Fetch data layanan dari API
  const fetchLayanans = async () => {
    try {
      setLoadingLayanans(true);
      const res = await fetch("http://localhost:8000/api/layanans");
      const result = await res.json();

      // Handle berbagai format response
      if (Array.isArray(result)) {
        setLayanans(result);
      } else if (result.data && Array.isArray(result.data)) {
        setLayanans(result.data);
      } else {
        console.error("Format data tidak valid:", result);
        setLayanans([]);
      }
    } catch (err) {
      console.error("Gagal fetch layanan:", err);
      setError("Gagal memuat data layanan");
      setLayanans([]);
    } finally {
      setLoadingLayanans(false);
    }
  };

  // Fetch chart data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getChartLayanan();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data chart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLayanans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.label || !form.value || !form.date) {
      setError("Semua field harus diisi!");
      showToast("Semua field harus diisi!", "error");
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      if (editingId) {
        await updateChartLayanan(editingId, form, token);
        showToast("Data berhasil diperbarui!", "success");
      } else {
        await createChartLayanan(form, token);
        showToast("Data berhasil ditambahkan!", "success");
      }

      setForm({ label: "", value: "", color: "bg-blue-500", date: "" });
      setEditingId(null);
      setIsFormVisible(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError("Gagal simpan data. Cek role/token.");
      showToast("Gagal menyimpan data!", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      label: item.label || "",
      value: item.value || "",
      color: item.color || "bg-blue-500",
      date: item.date || "",
    });
    setEditingId(item.id);
    setIsFormVisible(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    confirm("Yakin ingin menghapus data ini?", async () => {
      try {
        setError(null);
        await deleteChartLayanan(id, token);
        showToast("Data berhasil dihapus!", "success");
        await fetchData();
      } catch (err) {
        console.error(err);
        setError("Gagal hapus data. Cek role/token.");
        showToast("Gagal menghapus data!", "error");
      }
    });
  };

  const resetForm = () => {
    setForm({
      label: "",
      value: "",
      color: "bg-blue-500",
      date: "",
    });
    setEditingId(null);
    setIsFormVisible(false);
    setError(null);
  };

  const getColorPreview = (colorClass) => {
    const color = colorOptions.find((c) => c.value === colorClass);
    return color ? color.preview : "#3B82F6";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Chart Layanan
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data statistik layanan di satu tempat
            </p>
          </div>
          <BarChart3 className="w-10 h-10 text-blue-600" />
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
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (editingId) {
              resetForm();
            }
          }}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Data Chart
        </button>
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-screen overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Data Chart" : "Tambah Data Chart Baru"}
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
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 140px)" }}
            >
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Label Select - Dropdown dari Layanan */}
                  {/* Label Select - Dropdown dari Layanan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Layanan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-2">
                      <List className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        value={form.label}
                        onChange={(e) =>
                          setForm({ ...form, label: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none overflow-y-auto"
                        disabled={submitLoading || loadingLayanans}
                      >
                        <option value="">
                          {loadingLayanans
                            ? "Memuat layanan..."
                            : "-- Pilih Layanan --"}
                        </option>
                        {layanans.slice(0, 10).map((layanan) => {
                          const isUsed = data.some(
                            (item) =>
                              item.label === layanan.title &&
                              (!editingId || item.id !== editingId)
                          );
                          return (
                            <option
                              key={layanan.id}
                              value={layanan.title}
                              disabled={isUsed}
                            >
                              {layanan.title} {isUsed ? "✓" : ""}
                            </option>
                          );
                        })}
                        {layanans.length > 10 && (
                          <option disabled>
                            ... dan {layanans.length - 10} layanan lainnya
                          </option>
                        )}
                      </select>
                    </div>
                    {layanans.length > 10 && (
                      <p className="text-xs text-amber-600 mb-2">
                        💡 Menampilkan 10 layanan pertama. Gunakan input manual
                        di bawah untuk layanan lain.
                      </p>
                    )}
                    {loadingLayanans && (
                      <p className="text-xs text-gray-500 mb-2 flex items-center">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        Memuat data layanan...
                      </p>
                    )}
                    <input
                      type="text"
                      placeholder="Atau ketik manual / edit nama layanan"
                      value={form.label}
                      onChange={(e) =>
                        setForm({ ...form, label: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={submitLoading}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Pilih dari dropdown atau ketik/edit nama layanan secara
                      manual
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Masukkan nilai"
                      value={form.value}
                      onChange={(e) =>
                        setForm({ ...form, value: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={submitLoading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Warna <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={form.color}
                        onChange={(e) =>
                          setForm({ ...form, color: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                        disabled={submitLoading}
                      >
                        {colorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Color Preview */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Preview:</span>
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{
                          backgroundColor: getColorPreview(form.color),
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={submitLoading}
                        required
                      />
                    </div>
                  </div>
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
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200"
                    disabled={
                      submitLoading || !form.label || !form.value || !form.date
                    }
                  >
                    {submitLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingId ? "Update" : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Data Chart ({data.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Memuat data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada data
            </h3>
            <p className="text-gray-500 mb-4">
              Mulai dengan menambahkan data chart pertama Anda
            </p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Data Chart
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nama Layanan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Warna
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => {
                  const colorOption = colorOptions.find(
                    (c) => c.value === item.color
                  );
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {item.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {item.value}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{
                              backgroundColor:
                                colorOption?.preview || "#3B82F6",
                            }}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {colorOption?.label || item.color}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {item.date}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={submitLoading}
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={submitLoading}
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartLayanan;
