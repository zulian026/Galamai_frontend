import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Import table module for ReactQuill
const Table = Quill.import("formats/table");
const TableRow = Quill.import("formats/table-row");
const TableCell = Quill.import("formats/table-cell");
const TableHeader = Quill.import("formats/table-header");

export default function AdminLayananPage() {
  const [layanans, setLayanans] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);

  const apiBase = "http://localhost:8000/api/layanans";
  const quillRef = useRef(null);

  const fetchLayanans = async () => {
    try {
      const res = await axios.get(apiBase);
      setLayanans(res.data);
    } catch (err) {
      console.error("Gagal fetch:", err);
    }
  };

  const loadLayanan = async (id) => {
    try {
      const res = await axios.get(`${apiBase}/${id}`);
      setActiveId(res.data.id);
      setTitle(res.data.title);
      setDetails(res.data.details || "");
    } catch (err) {
      console.error("Gagal load:", err);
    }
  };

  const clearForm = () => {
    setActiveId(null);
    setTitle("");
    setDetails("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeId) {
        await axios.put(`${apiBase}/${activeId}`, { title, details });
      } else {
        await axios.post(apiBase, { title, details });
      }
      await fetchLayanans();
      clearForm();
    } catch (err) {
      console.error("Gagal simpan:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeId) return;
    if (!window.confirm("Yakin hapus layanan ini?")) return;
    try {
      await axios.delete(`${apiBase}/${activeId}`);
      await fetchLayanans();
      clearForm();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  // Custom toolbar handlers
  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (range) {
      const rows = parseInt(prompt("Jumlah baris:", "3") || "3");
      const cols = parseInt(prompt("Jumlah kolom:", "3") || "3");

      // Create table HTML structure
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

      // Insert the HTML
      const clipboard = quill.clipboard;
      clipboard.dangerouslyPasteHTML(range.index, tableHTML);

      // Move cursor after table
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

  useEffect(() => {
    fetchLayanans();
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">Daftar Layanan</h2>
            <button
              onClick={clearForm}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
            >
              + Baru
            </button>
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="p-4 space-y-2">
            {layanans.map((l) => (
              <button
                key={l.id}
                onClick={() => loadLayanan(l.id)}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  activeId === l.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <div className="font-medium truncate">{l.title}</div>
                {l.updated_at && (
                  <div className="text-xs opacity-75 mt-1">
                    Diubah: {new Date(l.updated_at).toLocaleDateString("id-ID")}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col bg-white shadow-lg">
        {/* Header */}
        <div className="border-b px-6 py-4 bg-gray-50 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-800">
            {activeId ? "Edit Layanan" : "Buat Layanan Baru"}
          </h1>
          {activeId && (
            <p className="text-sm text-gray-600 mt-1">ID: {activeId}</p>
          )}
        </div>

        {/* Form */}
        <div className="flex-1 p-6 overflow-hidden">
          <form
            onSubmit={handleSave}
            className="h-full flex flex-col space-y-4"
          >
            {/* Title Input */}
            <div className="flex-shrink-0">
              <label className="block font-medium mb-2 text-gray-700">
                Judul Layanan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan judul layanan..."
                required
              />
            </div>

            {/* Content Editor */}
            <div className="flex-1 flex flex-col min-h-0">
              <label className="block font-medium mb-2 text-gray-700 flex-shrink-0">
                Konten Layanan
              </label>
              <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
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

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  {saving
                    ? "Menyimpan..."
                    : activeId
                    ? "💾 Simpan Perubahan"
                    : "✨ Buat Layanan"}
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  🔄 Reset
                </button>
              </div>

              {activeId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  🗑️ Hapus
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx global>{`
        /* Quill Editor Styling */
        .ql-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 12px !important;
          background: #f9fafb !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
        }

        .ql-container {
          border: none !important;
          font-size: 14px !important;
          height: calc(100% - 43px) !important;
          overflow-y: auto !important;
        }

        .ql-editor {
          padding: 20px !important;
          line-height: 1.6 !important;
          min-height: 200px !important;
        }

        /* Custom Table Styling */
        .ql-editor .custom-table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 15px 0 !important;
          border: 1px solid #d1d5db !important;
        }

        .ql-editor .custom-table td,
        .ql-editor .custom-table th {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          min-width: 100px !important;
          vertical-align: top !important;
        }

        .ql-editor .custom-table th {
          background-color: #f3f4f6 !important;
          font-weight: bold !important;
          text-align: left !important;
        }

        .ql-editor .custom-table tr:nth-child(even) {
          background-color: #f9fafb !important;
        }

        /* Custom Divider */
        .ql-editor .custom-divider {
          margin: 20px 0 !important;
          border: none !important;
          border-top: 2px solid #d1d5db !important;
          height: 0 !important;
        }

        /* Callout Styling */
        .ql-editor .callout {
          padding: 15px !important;
          margin: 15px 0 !important;
          border-radius: 6px !important;
          border-left: 4px solid !important;
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
          background: #f3f4f6 !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          padding: 15px !important;
          margin: 15px 0 !important;
          overflow-x: auto !important;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
        }

        /* Blockquote Styling */
        .ql-editor blockquote {
          border-left: 4px solid #6b7280 !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          font-style: italic !important;
          color: #4b5563 !important;
          background-color: #f9fafb !important;
          padding: 10px 16px !important;
          border-radius: 0 6px 6px 0 !important;
        }

        /* Custom Button Icons */
        .ql-insertTable:before {
          content: "📊" !important;
          font-size: 14px !important;
        }

        .ql-insertDivider:before {
          content: "➖" !important;
          font-size: 14px !important;
        }

        .ql-insertCode:before {
          content: "💻" !important;
          font-size: 14px !important;
        }

        .ql-insertCallout:before {
          content: "💡" !important;
          font-size: 14px !important;
        }

        /* Prevent toolbar from being cut off */
        .ql-toolbar .ql-formats {
          margin-right: 8px !important;
        }

        /* Improve scrolling */
        .ql-editor::-webkit-scrollbar {
          width: 8px;
        }

        .ql-editor::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .ql-editor::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}
