import { useState, useEffect } from "react";
import { Edit3, RotateCcw } from "lucide-react";

export default function FormEditAplikasi({
  isOpen,
  onClose,
  onSubmit,
  appData,
  error = "",
  loading = false,
}) {
  const [form, setForm] = useState({
    nama_app: "",
    url: "",
    image: "",
    kategori: "internal",
  });

  const [originalData, setOriginalData] = useState({});

  // Update form saat appData berubah
  useEffect(() => {
    if (appData && isOpen) {
      const formData = {
        nama_app: appData.nama_app || "",
        url: appData.url || "",
        image: appData.image || "",
        kategori: appData.kategori || "internal",
      };
      setForm(formData);
      setOriginalData(formData);
    }
  }, [appData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, appData.id_aplikasi);
  };

  const handleClose = () => {
    setForm({
      nama_app: "",
      url: "",
      image: "",
      kategori: "internal",
    });
    setOriginalData({});
    onClose();
  };

  const resetToOriginal = () => {
    setForm(originalData);
  };

  const hasChanges = () => {
    return JSON.stringify(form) !== JSON.stringify(originalData);
  };

  if (!isOpen || !appData) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-orange-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">Edit Aplikasi</h2>
            <p className="text-sm text-gray-500">ID: {appData.id_aplikasi}</p>
          </div>
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
                Gagal Update Aplikasi
              </h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {hasChanges() && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-amber-600">📝</div>
            <p className="text-amber-800 text-sm">
              Ada perubahan yang belum disimpan
            </p>
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

        {/* Info perubahan */}
        {hasChanges() && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Perubahan:
            </h4>
            <div className="space-y-1 text-xs">
              {form.nama_app !== originalData.nama_app && (
                <div className="flex">
                  <span className="w-20 text-gray-500">Nama:</span>
                  <span className="text-red-600 line-through">
                    {originalData.nama_app}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="text-green-600">{form.nama_app}</span>
                </div>
              )}
              {form.url !== originalData.url && (
                <div className="flex">
                  <span className="w-20 text-gray-500">URL:</span>
                  <span className="text-red-600 line-through">
                    {originalData.url || "kosong"}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="text-green-600">{form.url || "kosong"}</span>
                </div>
              )}
              {form.image !== originalData.image && (
                <div className="flex">
                  <span className="w-20 text-gray-500">Gambar:</span>
                  <span className="text-red-600 line-through">
                    {originalData.image || "kosong"}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="text-green-600">
                    {form.image || "kosong"}
                  </span>
                </div>
              )}
              {form.kategori !== originalData.kategori && (
                <div className="flex">
                  <span className="w-20 text-gray-500">Kategori:</span>
                  <span className="text-red-600 line-through">
                    {originalData.kategori}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="text-green-600">{form.kategori}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !hasChanges()}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Update Aplikasi
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetToOriginal}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            disabled={loading || !hasChanges()}
          >
            <RotateCcw className="w-4 h-4" />
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
