import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  Save,
  Trash2,
  RotateCcw,
  FileText,
  Calendar,
  Loader2,
  Table,
  Minus,
  Code,
  Lightbulb,
  Search,
  Edit3,
  AlertCircle,
  X,
  Upload,
  Image as ImageIcon,
  User,
} from "lucide-react";

import { useToast } from "../../../../contexts/ToastContext";
import { useConfirm } from "../../../../contexts/ConfirmContext";


export default function AdminProfilPage() {
  const [profils, setProfils] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
const { confirm } = useConfirm();

  const apiBase = "http://localhost:8000/api/profil";
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
        // Token might be expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        // Redirect to login or show appropriate message
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      }
      return Promise.reject(error);
    }
  );

  const fetchProfils = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use regular axios for public endpoints (index, show)
      const res = await axios.get(apiBase);
      setProfils(res.data);
    } catch (err) {
      console.error("Gagal fetch:", err);
      setError("Gagal memuat data profil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const loadProfil = async (id) => {
    try {
      setError(null);
      // Use regular axios for public endpoints (index, show)
      const res = await axios.get(`${apiBase}/${id}`);
      setActiveId(res.data.id);
      setTitle(res.data.title);
      setDetails(res.data.details || "");
    } catch (err) {
      console.error("Gagal load:", err);
      setError("Gagal memuat profil. Silakan coba lagi.");
    }
  };

  const clearForm = () => {
    setActiveId(null);
    setTitle("");
    setDetails("");
    setError(null);
  };

  const handleSave = async (e) => {
  e.preventDefault();
  if (!title.trim()) {
    showToast("Judul profil harus diisi!", "error");
    return;
  }

  setSaving(true);
  try {
    if (activeId) {
      await apiClient.put(`/${activeId}`, { title, details });
      showToast("Profil berhasil diperbarui!", "success");
    } else {
      await apiClient.post("", { title, details });
      showToast("Profil baru berhasil dibuat!", "success");
    }
    await fetchProfils();
    clearForm();
  } catch (err) {
    console.error("Gagal simpan:", err);
    if (err.response?.status === 401) {
      showToast("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    } else if (err.response?.data?.errors) {
      const errorMessages = Object.values(err.response.data.errors).flat();
      showToast(errorMessages.join(", "), "error");
    } else {
      showToast("Gagal menyimpan profil. Silakan coba lagi.", "error");
    }
  } finally {
    setSaving(false);
  }
};


  const handleDelete = () => {
  if (!activeId) return;

  confirm("Yakin ingin menghapus profil ini?", async () => {
    try {
      await apiClient.delete(`/${activeId}`);
      await fetchProfils();
      clearForm();
      showToast("Profil berhasil dihapus!", "success");
    } catch (err) {
      console.error("Gagal hapus:", err);
      if (err.response?.status === 401) {
        showToast("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      } else {
        showToast("Gagal menghapus profil. Silakan coba lagi.", "error");
      }
    }
  });
};


  // Custom toolbar handlers
  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (range) {
      const rows = parseInt(prompt("Jumlah baris:", "3") || "3");
      const cols = parseInt(prompt("Jumlah kolom:", "3") || "3");

      let tableHTML = '<table class="custom-table"><tbody>';
      for (let i = 0; i < rows; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < cols; j++) {
          if (i === 0) {
            tableHTML += "<th>Header " + (j + 1) + "</th>";
          } else {
            tableHTML += "<td>Cell " + i + "-" + (j + 1) + "</td>";
          }
        }
        tableHTML += "</tr>";
      }
      tableHTML += "</tbody></table><p><br></p>";

      const clipboard = quill.clipboard;
      clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      quill.setSelection(range.index + tableHTML.length);
    }
  };

  const insertDivider = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (range) {
      const dividerHTML = '<hr class="custom-divider"><p><br></p>';
      quill.clipboard.dangerouslyPasteHTML(range.index, dividerHTML);
      quill.setSelection(range.index + dividerHTML.length);
    }
  };

  const insertCodeBlock = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (range) {
      quill.format("code-block", true);
      quill.insertText(
        range.index,
        "// Masukkan kode di sini\n",
        "code-block",
        true
      );
    }
  };

  const insertCallout = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (range) {
      const types = ["info", "warning", "success", "error"];
      const type = prompt(`Pilih tipe callout (${types.join("/")}):`);

      if (types.includes(type)) {
        const calloutHTML = `<div class="callout callout-${type}"><p><strong>${type.toUpperCase()}:</strong> Masukkan pesan di sini</p></div><p><br></p>`;
        quill.clipboard.dangerouslyPasteHTML(range.index, calloutHTML);
        quill.setSelection(range.index + calloutHTML.length);
      }
    }
  };

  // Filter profils based on search
  const filteredProfils = profils.filter((profil) =>
    profil.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProfils();
  }, []);

  // Memoized modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          // Basic formatting
          ["bold", "italic", "underline", "strike"],
          [{ script: "sub" }, { script: "super" }],

          // Headers and font
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],

          // Colors
          [{ color: [] }, { background: [] }],

          // Alignment
          [{ align: [] }],

          // Lists and indentation
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],

          // Blockquote and code
          ["blockquote", "code-block"],

          // Links and media
          ["link", "image", "video"],

          // Custom buttons
          ["insertTable", "insertDivider", "insertCode", "insertCallout"],

          // Clear formatting
          ["clean"],
        ],
        handlers: {
          insertTable,
          insertDivider,
          insertCode: insertCodeBlock,
          insertCallout,
        },
      },
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
    "bullet",
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
              Manajemen Profil
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola konten profil perusahaan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Total: {profils.length} profil
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
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

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Daftar Profil</h2>
              <button
                onClick={clearForm}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Baru
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari profil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : filteredProfils.length === 0 ? (
              <div className="text-center py-8 px-6">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Tidak ada profil yang cocok dengan pencarian
                    </p>
                  </>
                ) : (
                  <>
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Belum ada profil</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Klik tombol "Baru" untuk membuat profil pertama
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredProfils.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadProfil(p.id)}
                    className={`block w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                      activeId === p.id
                        ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium truncate text-sm ${
                            activeId === p.id
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {p.title}
                        </div>
                        {p.updated_at && (
                          <div
                            className={`flex items-center gap-1 text-xs mt-2 ${
                              activeId === p.id
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {new Date(p.updated_at).toLocaleDateString("id-ID")}
                          </div>
                        )}
                      </div>
                      {activeId === p.id && (
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
          {/* Editor Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeId ? "Edit Profil" : "Buat Profil Baru"}
                </h2>
                {activeId && (
                  <p className="text-sm text-gray-500 mt-1">ID: {activeId}</p>
                )}
              </div>

              {/* Action Buttons */}
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
                    : "Buat Profil"}
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

          {/* Editor Content */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <form
              onSubmit={handleSave}
              className="h-full flex flex-col space-y-5"
            >
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Profil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan judul profil..."
                  required
                />
              </div>

              {/* Content Editor */}
              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Konten Profil
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
                    placeholder="Masukkan detail profil..."
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx global>
        {`
          /* Quill Editor Styling */
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

          /* Custom Toolbar Button Icons */
          .ql-insertTable .ql-stroke {
            stroke: none !important;
          }
          .ql-insertTable:before {
            content: "⊞" !important;
            font-size: 16px !important;
            color: #6b7280 !important;
          }

          .ql-insertDivider .ql-stroke {
            stroke: none !important;
          }
          .ql-insertDivider:before {
            content: "⚊" !important;
            font-size: 16px !important;
            color: #6b7280 !important;
          }

          .ql-insertCode .ql-stroke {
            stroke: none !important;
          }
          .ql-insertCode:before {
            content: "</>" !important;
            font-size: 12px !important;
            color: #6b7280 !important;
            font-weight: bold !important;
          }

          .ql-insertCallout .ql-stroke {
            stroke: none !important;
          }
          .ql-insertCallout:before {
            content: "💡" !important;
            font-size: 14px !important;
          }

          /* Custom Table Styling */
          .ql-editor .custom-table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 20px 0 !important;
            border: 1px solid #d1d5db !important;
            border-radius: 8px !important;
            overflow: hidden !important;
          }

          .ql-editor .custom-table td,
          .ql-editor .custom-table th {
            border: 1px solid #d1d5db !important;
            padding: 12px 16px !important;
            min-width: 120px !important;
            vertical-align: top !important;
          }

          .ql-editor .custom-table th {
            background-color: #f3f4f6 !important;
            font-weight: 600 !important;
            text-align: left !important;
            color: #374151 !important;
          }

          .ql-editor .custom-table tr:nth-child(even) {
            background-color: #f9fafb !important;
          }

          .ql-editor .custom-table tr:hover {
            background-color: #f3f4f6 !important;
          }

          /* Custom Divider */
          .ql-editor .custom-divider {
            margin: 24px 0 !important;
            border: none !important;
            border-top: 2px solid #e5e7eb !important;
            height: 0 !important;
          }

          /* Callout Styling */
          .ql-editor .callout {
            padding: 16px !important;
            margin: 20px 0 !important;
            border-radius: 8px !important;
            border-left: 4px solid !important;
            font-size: 14px !important;
          }

          .ql-editor .callout-info {
            background-color: #eff6ff !important;
            border-left-color: #3b82f6 !important;
            color: #1e40af !important;
          }

          .ql-editor .callout-warning {
            background-color: #fffbeb !important;
            border-left-color: #f59e0b !important;
            color: #92400e !important;
          }

          .ql-editor .callout-success {
            background-color: #f0fdf4 !important;
            border-left-color: #10b981 !important;
            color: #065f46 !important;
          }

          .ql-editor .callout-error {
            background-color: #fef2f2 !important;
            border-left-color: #ef4444 !important;
            color: #991b1b !important;
          }

          /* Code Block Styling */
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

          /* Blockquote Styling */
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

          /* Improve list styling */
          .ql-editor ul,
          .ql-editor ol {
            margin: 16px 0 !important;
            padding-left: 24px !important;
          }

          .ql-editor li {
            margin-bottom: 8px !important;
            line-height: 1.6 !important;
          }

          /* Link styling */
          .ql-editor a {
            color: #3b82f6 !important;
            text-decoration: none !important;
            border-bottom: 1px solid transparent !important;
            transition: border-color 0.2s !important;
          }

          .ql-editor a:hover {
            border-bottom-color: #3b82f6 !important;
          }

          /* Image styling */
          .ql-editor img {
            border-radius: 8px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            margin: 16px 0 !important;
          }

          /* Improve scrolling */
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

          /* Prevent toolbar overflow */
          .ql-toolbar .ql-formats {
            margin-right: 8px !important;
          }

          .ql-toolbar .ql-formats:last-child {
            margin-right: 0 !important;
          }
        `}
      </style>
    </div>
  );
}
