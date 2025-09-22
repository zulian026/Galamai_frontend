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
import { artikelService } from "../../../../services/artikelService";
import { useAuth } from "../../../../contexts/AuthContext";

// Fix ReactQuill bullet warning
Quill.register("formats/bullet", Quill.import("formats/list"));

export default function AdminArtikel() {
  const { token } = useAuth();
  const { getAll, add, update, delete: remove, uploadImage } = artikelService;

  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    created_at: "",
    image: "", // preview URL
    imageFile: null, // File object
  });

  const quillRef = useRef();

  // ====== Fetch Artikel ======
  const fetchArtikel = async () => {
    setLoading(true);
    try {
      const data = await getAll(token);
      if (data.success) setArtikel(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchArtikel();
  }, [token]);

  // ====== Form Handling ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      created_at: "",
      image: "",
      imageFile: null,
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
        imageFile: file,
        image: URL.createObjectURL(file), // untuk preview
      }));
    };
  };

  // ====== ReactQuill Image Upload ======
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const data = await uploadImage(file, token);
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
        title: form.title,
        description: form.description,
        created_at: form.created_at,
      };
      if (form.imageFile) formData.image = form.imageFile;

      const data = editing
        ? await update(editing, formData, token)
        : await add(formData, token);

      if (data.success) {
        await fetchArtikel();
        closeForm();
      } else {
        alert(data.message || "Gagal menyimpan artikel");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Gagal menyimpan artikel");
    }

    setSaving(false);
  };

  // ====== Delete & Edit ======
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus artikel ini?")) return;
    try {
      const data = await remove(id, token);
      if (data.success) fetchArtikel();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      created_at: item.created_at || "",
      image: item.image_url || item.image || "",
      imageFile: null,
    });
    setEditing(item.id);
    setFormOpen(true);
  };

  // ====== Render ======
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
            <p className="text-gray-600 mt-1">
              Kelola artikel dan konten edukasi
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Plus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : artikel.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 text-lg">Belum ada artikel</p>
            <p className="text-gray-400 text-sm mt-1">
              Tambahkan artikel pertama Anda
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
                    Gambar
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
                {artikel.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="text-gray-400" size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">{item.created_at}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye size={16} />
                        <span className="text-sm">{item.views || 0}</span>
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
                          onClick={() => handleDelete(item.id)}
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
                {editing ? "Edit Artikel" : "Tambah Artikel Baru"}
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
                        Judul Artikel
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Masukkan judul artikel"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tanggal Publikasi
                      </label>
                      <input
                        type="date"
                        name="created_at"
                        value={form.created_at || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Right Column - Cover Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gambar Artikel
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col justify-center items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                      onClick={handleCoverUpload}
                    >
                      {form.image ? (
                        <div className="relative w-full h-full">
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium">
                              Ganti Gambar
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
                    {form.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            image: "",
                            imageFile: null,
                          }))
                        }
                        className="text-red-500 text-sm mt-2 hover:underline"
                      >
                        Hapus Gambar
                      </button>
                    )}
                  </div>
                </div>

                {/* Editor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Isi Artikel
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <ReactQuill
                      ref={quillRef}
                      value={form.description}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, description: val }))
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
