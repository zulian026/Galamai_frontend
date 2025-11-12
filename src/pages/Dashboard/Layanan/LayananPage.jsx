import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  Save,
  Trash2,
  RotateCcw,
  FileText,
  Calendar,
  Loader2,
  Search,
  Edit3,
  AlertCircle,
  X,
} from "lucide-react";

export default function AdminLayananPage() {
  const [layanans, setLayanans] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiBase = "http://127.0.0.1:8000/api/layanans";
  const quillRef = useRef(null);

  // Function to get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("auth_token");
  };

  // Create axios instance with default headers
  const apiClient = axios.create({
    baseURL: apiBase,
  });

  // Add request interceptor to include auth token
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 errors
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      }
      return Promise.reject(error);
    }
  );

  const fetchLayanans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(apiBase);

      console.log("API Response:", res.data); // Debug log

      // Handle Laravel API response format: { success, message, data }
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setLayanans(res.data.data);
      } else if (Array.isArray(res.data)) {
        // Fallback if API returns array directly
        setLayanans(res.data);
      } else {
        console.warn("Unexpected response format:", res.data);
        setLayanans([]);
      }
    } catch (err) {
      console.error("Gagal fetch:", err);
      console.error("Error details:", err.response?.data);

      // More detailed error message
      let errorMessage = "Gagal memuat data layanan.";
      if (err.response) {
        errorMessage += ` Status: ${err.response.status}`;
        if (err.response.data?.message) {
          errorMessage += ` - ${err.response.data.message}`;
        }
      } else if (err.request) {
        errorMessage += " Server tidak merespons. Pastikan backend berjalan.";
      } else {
        errorMessage += ` ${err.message}`;
      }

      setError(errorMessage);
      setLayanans([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLayanan = async (id) => {
    try {
      setError(null);
      const res = await axios.get(`${apiBase}/${id}`);

      console.log("Load Layanan Response:", res.data); // Debug log

      // Handle Laravel API response format
      const layananData = res.data.success ? res.data.data : res.data;

      setActiveId(layananData.id);
      setTitle(layananData.title);
      setDetails(layananData.details || "");
      setLinkUrl(layananData.link_url || "");
    } catch (err) {
      console.error("Gagal load:", err);
      console.error("Error details:", err.response?.data);

      let errorMessage = "Gagal memuat layanan.";
      if (err.response?.data?.message) {
        errorMessage += ` ${err.response.data.message}`;
      }

      setError(errorMessage);
    }
  };

  const clearForm = () => {
    setActiveId(null);
    setTitle("");
    setDetails("");
    setLinkUrl("");
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul layanan harus diisi!");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (activeId) {
        await apiClient.put(`/${activeId}`, {
          title,
          details,
          link_url: linkUrl,
        });
      } else {
        await apiClient.post("", { title, details, link_url: linkUrl });
      }
      await fetchLayanans();
      clearForm();
    } catch (err) {
      console.error("Gagal simpan:", err);
      console.error("Error details:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Tidak terautentikasi. Silakan login kembali.");
      } else {
        let errorMessage = "Gagal menyimpan layanan.";
        if (err.response?.data?.message) {
          errorMessage += ` ${err.response.data.message}`;
        } else if (err.response?.data?.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage += ` ${errors.join(", ")}`;
        }
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeId) return;
    if (!window.confirm("Yakin hapus layanan ini?")) return;

    try {
      setError(null);
      await apiClient.delete(`/${activeId}`);
      await fetchLayanans();
      clearForm();
    } catch (err) {
      console.error("Gagal hapus:", err);
      console.error("Error details:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Tidak terautentikasi. Silakan login kembali.");
      } else {
        let errorMessage = "Gagal menghapus layanan.";
        if (err.response?.data?.message) {
          errorMessage += ` ${err.response.data.message}`;
        }
        setError(errorMessage);
      }
    }
  };

  // Filter layanans based on search - with safety check
  const filteredLayanans = Array.isArray(layanans)
    ? layanans.filter((layanan) =>
        layanan.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    fetchLayanans();
  }, []);

  // Memoized modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: true,
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
    "script",
    "code-block",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Layanan
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola konten layanan perusahaan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Total: {layanans.length} layanan
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-800 flex-1 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Daftar Layanan</h2>
              <button
                onClick={clearForm}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Baru
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : filteredLayanans.length === 0 ? (
              <div className="text-center py-8 px-6">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Tidak ada layanan yang cocok dengan pencarian
                    </p>
                  </>
                ) : (
                  <>
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Belum ada layanan</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Klik tombol "Baru" untuk membuat layanan pertama
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredLayanans.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => loadLayanan(l.id)}
                    className={`block w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                      activeId === l.id
                        ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium truncate text-sm ${
                            activeId === l.id
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {l.title}
                        </div>
                        {l.updated_at && (
                          <div
                            className={`flex items-center gap-1 text-xs mt-2 ${
                              activeId === l.id
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {new Date(l.updated_at).toLocaleDateString("id-ID")}
                          </div>
                        )}
                      </div>
                      {activeId === l.id && (
                        <Edit3 className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeId ? "Edit Layanan" : "Buat Layanan Baru"}
                </h2>
                {activeId && (
                  <p className="text-sm text-gray-500 mt-1">ID: {activeId}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearForm}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving
                    ? "Menyimpan..."
                    : activeId
                    ? "Simpan Perubahan"
                    : "Buat Layanan"}
                </button>

                {activeId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <form
              onSubmit={handleSave}
              className="h-full flex flex-col space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan judul layanan..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://contoh.com"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Konten Layanan
                </label>
                <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <ReactQuill
                    ref={quillRef}
                    value={details}
                    onChange={setDetails}
                    modules={modules}
                    formats={formats}
                    style={{ height: "100%" }}
                    theme="snow"
                    placeholder="Masukkan detail layanan..."
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .ql-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 12px 16px !important;
          background: #f9fafb !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
        }

        .ql-container {
          border: none !important;
          font-size: 14px !important;
          height: calc(100% - 45px) !important;
          overflow-y: auto !important;
        }

        .ql-editor {
          padding: 24px !important;
          line-height: 1.7 !important;
          min-height: 300px !important;
          color: #374151 !important;
        }

        .ql-toolbar button:hover {
          color: #3b82f6 !important;
        }

        .ql-toolbar button.ql-active {
          color: #2563eb !important;
        }

        .ql-editor pre.ql-syntax {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
          border-radius: 8px !important;
          padding: 20px !important;
          margin: 20px 0 !important;
          overflow-x: auto !important;
          font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono",
            "Source Code Pro", monospace !important;
          font-size: 13px !important;
          line-height: 1.5 !important;
          color: #e5e7eb !important;
        }

        .ql-editor blockquote {
          border-left: 4px solid #6b7280 !important;
          padding: 16px 20px !important;
          margin: 20px 0 !important;
          font-style: italic !important;
          color: #4b5563 !important;
          background-color: #f9fafb !important;
          border-radius: 0 8px 8px 0 !important;
          position: relative !important;
        }

        .ql-editor blockquote:before {
          content: '"' !important;
          position: absolute !important;
          left: -8px !important;
          top: -8px !important;
          font-size: 48px !important;
          color: #d1d5db !important;
          font-family: Georgia, serif !important;
        }

        .ql-editor ul,
        .ql-editor ol {
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }

        .ql-editor li {
          margin-bottom: 8px !important;
          line-height: 1.6 !important;
        }

        .ql-editor a {
          color: #3b82f6 !important;
          text-decoration: none !important;
          border-bottom: 1px solid transparent !important;
          transition: border-color 0.2s !important;
        }

        .ql-editor a:hover {
          border-bottom-color: #3b82f6 !important;
        }

        .ql-editor img {
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          margin: 16px 0 !important;
        }

        .ql-editor::-webkit-scrollbar {
          width: 8px;
        }

        .ql-editor::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .ql-editor::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .ql-toolbar .ql-formats {
          margin-right: 8px !important;
        }

        .ql-toolbar .ql-formats:last-child {
          margin-right: 0 !important;
        }
      `}</style>
    </div>
  );
}
