import React, { useState, useEffect } from "react";
import { Search, AlertCircle, Plus } from "lucide-react";
import { PertanyaanList, FaqList } from "./List";
import { FaqModal, DetailModal } from "./DetailModal";
import {
  fetchPertanyaan,
  fetchFaqs,
  updateStatus,
  createFaq,
  updateFaq,
  deleteFaq,
  toggleFaqActive,
  deletePertanyaan,
} from "../../../services/Pertanyanfaqapi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pertanyaan");
  const [pertanyaan, setPertanyaan] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [topikFilter, setTopikFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showEditFaqModal, setShowEditFaqModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form data
  const [faqForm, setFaqForm] = useState({
    question_id: null,
    topik: "",
    pertanyaan: "",
    jawaban: "",
    urutan: 0,
    is_active: true,
  });

  const loadPertanyaan = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchPertanyaan({
      statusFilter,
      topikFilter,
      searchQuery,
    });
    if (result.success) {
      setPertanyaan(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const loadFaqs = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchFaqs({ topikFilter });
    if (result.success) {
      setFaqs(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    const result = await updateStatus(id, status);
    if (result.success) {
      loadPertanyaan();
      alert("Status berhasil diperbarui");
    } else {
      alert(result.error);
    }
  };

  const handleCreateFaq = async () => {
    const result = await createFaq(faqForm);
    if (result.success) {
      setShowFaqModal(false);
      loadFaqs();
      loadPertanyaan();
      alert("FAQ berhasil dipublikasikan");
      resetFaqForm();
    } else {
      alert(result.error);
    }
  };

  const handleUpdateFaq = async () => {
    const result = await updateFaq(selectedItem.id, faqForm);
    if (result.success) {
      setShowEditFaqModal(false);
      loadFaqs();
      alert("FAQ berhasil diperbarui");
    } else {
      alert(result.error);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) return;
    const result = await deleteFaq(id);
    if (result.success) {
      loadFaqs();
      alert("FAQ berhasil dihapus");
    } else {
      alert(result.error);
    }
  };

  const handleToggleFaqActive = async (id) => {
    const result = await toggleFaqActive(id);
    if (result.success) {
      loadFaqs();
    } else {
      alert(result.error);
    }
  };

  const handleDeletePertanyaan = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) return;
    const result = await deletePertanyaan(id);
    if (result.success) {
      loadPertanyaan();
      alert("Pertanyaan berhasil dihapus");
    } else {
      alert(result.error);
    }
  };

  const resetFaqForm = () => {
    setFaqForm({
      question_id: null,
      topik: "",
      pertanyaan: "",
      jawaban: "",
      urutan: 0,
      is_active: true,
    });
  };

  const openFaqModal = (pertanyaanItem = null) => {
    if (pertanyaanItem) {
      // Jika dari pertanyaan user
      setSelectedItem(pertanyaanItem);
      setFaqForm({
        question_id: pertanyaanItem.id,
        topik: pertanyaanItem.topik || "",
        pertanyaan: pertanyaanItem.isi_pertanyaan || "",
        jawaban: "",
        urutan: 0,
        is_active: true,
      });
    } else {
      // Jika create baru manual
      setSelectedItem(null);
      setFaqForm({
        question_id: null,
        topik: "",
        pertanyaan: "",
        jawaban: "",
        urutan: 0,
        is_active: true,
      });
    }
    setShowFaqModal(true);
  };

  const openEditFaqModal = (faqItem) => {
    setSelectedItem(faqItem);
    
    // Ambil pertanyaan: prioritaskan dari kolom pertanyaan (string), fallback ke relasi
    let pertanyaanText = "";
    if (faqItem.pertanyaan && typeof faqItem.pertanyaan === "string") {
      pertanyaanText = faqItem.pertanyaan;
    } else if (faqItem.pertanyaanRelation?.isi_pertanyaan) {
      pertanyaanText = faqItem.pertanyaanRelation.isi_pertanyaan;
    }

    setFaqForm({
      topik: faqItem.topik || "",
      pertanyaan: pertanyaanText,
      jawaban: faqItem.jawaban || "",
      urutan: faqItem.urutan || 0,
      is_active: faqItem.is_active,
    });
    setShowEditFaqModal(true);
  };

  useEffect(() => {
    if (activeTab === "pertanyaan") {
      loadPertanyaan();
    } else {
      loadFaqs();
    }
  }, [activeTab, statusFilter, topikFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin FAQ Management
          </h1>
          <p className="text-gray-600">Kelola pertanyaan pengguna dan FAQ</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("pertanyaan")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "pertanyaan"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pertanyaan Pengguna
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "faq"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Daftar FAQ
              </button>
            </nav>
          </div>

          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {activeTab === "pertanyaan" && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Diproses</option>
                  <option value="published">Published</option>
                  <option value="rejected">Ditolak</option>
                </select>
              )}

              <input
                type="text"
                placeholder="Filter Topik"
                value={topikFilter}
                onChange={(e) => setTopikFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {activeTab === "faq" && (
              <div className="mb-4">
                <button
                  onClick={() => openFaqModal(null)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Buat FAQ Baru
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <>
                {activeTab === "pertanyaan" ? (
                  <PertanyaanList
                    pertanyaan={pertanyaan}
                    onViewDetail={(item) => {
                      setSelectedItem(item);
                      setShowDetailModal(true);
                    }}
                    onUpdateStatus={handleUpdateStatus}
                    onCreateFaq={openFaqModal}
                    onDelete={handleDeletePertanyaan}
                  />
                ) : (
                  <FaqList
                    faqs={faqs}
                    onEdit={openEditFaqModal}
                    onToggleActive={handleToggleFaqActive}
                    onDelete={handleDeleteFaq}
                    onCreateNew={() => openFaqModal(null)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showDetailModal && selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showFaqModal && (
        <FaqModal
          title="Buat FAQ"
          faqForm={faqForm}
          setFaqForm={setFaqForm}
          onSubmit={handleCreateFaq}
          onClose={() => {
            setShowFaqModal(false);
            resetFaqForm();
          }}
          submitLabel="Publikasikan FAQ"
        />
      )}

      {showEditFaqModal && selectedItem && (
        <FaqModal
          title="Edit FAQ"
          faqForm={faqForm}
          setFaqForm={setFaqForm}
          onSubmit={handleUpdateFaq}
          onClose={() => {
            setShowEditFaqModal(false);
            resetFaqForm();
          }}
          submitLabel="Simpan Perubahan"
        />
      )}
    </div>
  );
};

export default AdminDashboard;