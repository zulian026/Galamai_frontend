import { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ArrowLeft, Loader2, Image, Save, X, FileText } from "lucide-react";
import { artikelService } from "../../../../services/artikelService";
import { useAuth } from "../../../../contexts/AuthContext";
import { useToast } from "../../../../contexts/ToastContext";

// Fix ReactQuill bullet warning
Quill.register("formats/bullet", Quill.import("formats/list"));

export default function ArtikelForm({ editingArtikel, onClose, onSuccess }) {
  const { token } = useAuth();
  const { add, update, uploadImage } = artikelService;
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    created_at: "",
    image: "",
    imageFile: null,
    status: "draft", // Default status is draft
  });

  const quillRef = useRef();

  // Initialize form data when editing
  useEffect(() => {
    if (editingArtikel) {
      // Format date for input field (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setForm({
        title: editingArtikel.title || "",
        description: editingArtikel.description || "",
        created_at: formatDateForInput(editingArtikel.created_at),
        image: editingArtikel.image_url || editingArtikel.image || "",
        imageFile: null,
        status: editingArtikel.status || "draft",
      });
    }
  }, [editingArtikel]);

  // ====== Form Handling ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        image: URL.createObjectURL(file),
      }));
    };
  };

  // ====== ReactQuill Image Upload ======
  // ReactQuill Image Upload
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
          showToast("Gambar berhasil diupload!", "success"); // ✅ pakai toast
        } else {
          showToast(data.message || "Upload gagal", "error"); // ✅ pakai toast
        }
      } catch (err) {
        console.error("Upload error:", err);
        showToast("Gagal upload gambar", "error"); // ✅ pakai toast
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
  const handleSubmit = async (e, submitStatus = form.status) => {
  e.preventDefault();
  setSaving(true);

  try {
    const formData = {
      title: form.title,
      description: form.description,
      created_at: form.created_at,
      status: submitStatus,
    };
    if (form.imageFile) formData.image = form.imageFile;

    const data = editingArtikel
      ? await update(editingArtikel.id, formData, token)
      : await add(formData, token);

    if (data.success) {
      showToast(
        editingArtikel
          ? "Artikel berhasil diperbarui!"
          : "Artikel berhasil disimpan!",
        "success"
      ); // ✅ toast success
      onSuccess();
    } else {
      showToast(data.message || "Gagal menyimpan artikel", "error"); // ✅ toast error
    }
  } catch (err) {
    console.error("Submit error:", err);
    showToast("Gagal menyimpan artikel", "error"); // ✅ toast error
  }

  setSaving(false);
};


  // Handle save as draft
  const handleSaveAsDraft = (e) => {
    handleSubmit(e, "draft");
  };

  // Handle save and publish
  const handleSaveAndPublish = (e) => {
    handleSubmit(e, "publish");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {editingArtikel ? "Edit Artikel" : "Tambah Artikel Baru"}
              </h1>
              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  form.status === "publish"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {form.status === "publish" ? "🟢 Publish" : "🟡 Draft"}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              {editingArtikel
                ? "Perbarui informasi artikel"
                : "Buat artikel baru untuk dipublikasikan"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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

                <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Published</option>
                    </select>
                  </div>
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
                      <Image className="mx-auto text-gray-400 mb-2" size={32} />
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
            <div className="mb-8">
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
                  style={{ height: "400px" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-12">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <X size={16} />
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={saving}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Simpan sebagai Draft
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveAndPublish}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors duration-200"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingArtikel ? "Update & Publish" : "Simpan & Publish"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
