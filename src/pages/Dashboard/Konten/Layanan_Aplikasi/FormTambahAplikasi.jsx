import { useState } from "react";
import { Plus } from "lucide-react";

export default function FormTambahAplikasi({
  isOpen,
  onClose,
  onSubmit,
  error = "",
  loading = false,
}) {
  const [form, setForm] = useState({
    nama_app: "",
    url: "",
    image: "",
    kategori: "internal",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({
      nama_app: "",
      url: "",
      image: "",
      kategori: "internal",
    });
    onClose();
  };

  const resetForm = () => {
    setForm({
      nama_app: "",
      url: "",
      image: "",
      kategori: "internal",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">
            Tambah Aplikasi Baru
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-red-500">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">
                Gagal Menambah Aplikasi
              </h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Aplikasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama aplikasi"
              value={form.nama_app}
              onChange={(e) => setForm({ ...form, nama_app: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Aplikasi
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={loading}
            >
              <option value="internal">Internal</option>
              <option value="eksternal">Eksternal</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Tambah Aplikasi
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
