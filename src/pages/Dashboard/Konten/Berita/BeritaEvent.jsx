import { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Calendar,
  Eye,
  Image,
} from "lucide-react";
import { beritaEventService } from "../../../../services/beritaEventService";
import { useAuth } from "../../../../contexts/AuthContext";

// Fix ReactQuill bullet warning
Quill.register("formats/bullet", Quill.import("formats/list"));

export default function AdminBeritaEvent() {
  const { token } = useAuth();
  const { getAll, add, update, delete: remove } = beritaEventService;

  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    judul: "",
    isi: "",
    tipe: "berita",
    tanggal: "",
    gambar: "", // preview URL
    gambarFile: null, // File object
  });

  const quillRef = useRef();

  // ====== Fetch Berita ======
  const fetchBerita = async () => {
    setLoading(true);
    try {
      const data = await getAll(token);
      if (data.success) setBerita(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchBerita();
  }, [token]);

  // ====== Form Handling ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      judul: "",
      isi: "",
      tipe: "berita",
      tanggal: "",
      gambar: "",
      gambarFile: null,
    });
    setEditing(null);
  };

  const closeForm = () => {
    resetForm();
    setFormOpen(false);
  };

  // ====== Cover Upload ======
  const handleCoverUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      setForm((prev) => ({
        ...prev,
        gambarFile: file,
        gambar: URL.createObjectURL(file), // untuk preview
      }));
    };
  };

  // ====== ReactQuill Image Upload ======
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/upload-image`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
        const data = await res.json();
        if (data.success) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range ? range.index : 0, "image", data.url);
        } else {
          alert(data.message || "Upload gagal");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Gagal upload gambar");
      }
    };
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: { image: handleImageUpload },
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  // ====== Submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = {
        judul: form.judul,
        isi: form.isi,
        tipe: form.tipe,
        tanggal: form.tanggal,
      };
      if (form.gambarFile) formData.gambar = form.gambarFile;

      const data = editing
        ? await update(editing, formData, token)
        : await add(formData, token);

      if (data.success) {
        await fetchBerita();
        closeForm();
      } else {
        alert(data.message || "Gagal menyimpan berita/event");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Gagal menyimpan berita/event");
    }

    setSaving(false);
  };

  // ====== Delete & Edit ======
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus berita ini?")) return;
    try {
      const data = await remove(id, token);
      if (data.success) fetchBerita();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      judul: item.judul,
      isi: item.isi,
      tipe: item.tipe,
      tanggal: item.tanggal || "",
      gambar: item.gambar || "",
      gambarFile: null,
    });
    setEditing(item.id_berita);
    setFormOpen(true);
  };

  // ====== Render ======
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Berita & Event</h1>
            <p className="text-gray-600 mt-1">Kelola konten berita dan event</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Plus size={18} /> Tambah Konten
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : berita.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 text-lg">Belum ada konten</p>
            <p className="text-gray-400 text-sm mt-1">
              Tambahkan berita atau event pertama Anda
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Judul
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Tipe
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Tanggal
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Views
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {berita.map((item) => (
                  <tr
                    key={item.id_berita}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {item.judul}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.tipe === "berita"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.tipe === "berita" ? "Berita" : "Event"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">{item.tanggal}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye size={16} />
                        <span className="text-sm">{item.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_berita)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? "Edit Konten" : "Tambah Konten Baru"}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Judul Konten
                      </label>
                      <input
                        type="text"
                        name="judul"
                        value={form.judul}
                        onChange={handleChange}
                        placeholder="Masukkan judul berita atau event"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipe Konten
                        </label>
                        <select
                          name="tipe"
                          value={form.tipe}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="berita">Berita</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          name="tanggal"
                          value={form.tanggal || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Cover Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cover Image
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col justify-center items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                      onClick={handleCoverUpload}
                    >
                      {form.gambar ? (
                        <div className="relative w-full h-full">
                          <img
                            src={form.gambar}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium">
                              Ganti Cover
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Image
                            className="mx-auto text-gray-400 mb-2"
                            size={32}
                          />
                          <span className="text-gray-500 text-sm font-medium">
                            Klik untuk upload
                          </span>
                          <span className="text-gray-400 text-xs block mt-1">
                            JPG, PNG (max 5MB)
                          </span>
                        </div>
                      )}
                    </div>
                    {form.gambar && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            gambar: "",
                            gambarFile: null,
                          }))
                        }
                        className="text-red-500 text-sm mt-2 hover:underline"
                      >
                        Hapus Cover
                      </button>
                    )}
                  </div>
                </div>

                {/* Editor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konten
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <ReactQuill
                      ref={quillRef}
                      value={form.isi}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, isi: val }))
                      }
                      modules={quillModules}
                      formats={quillFormats}
                      style={{ height: "320px" }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 mt-16">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    {saving && <Loader2 className="animate-spin" size={18} />}
                    {saving ? "Menyimpan..." : editing ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
