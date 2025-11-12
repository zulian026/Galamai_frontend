import React from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending",
    },
    processed: {
      color: "bg-blue-100 text-blue-800",
      icon: FileText,
      label: "Diproses",
    },
    published: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Published",
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      label: "Ditolak",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export const PertanyaanList = ({
  pertanyaan,
  onViewDetail,
  onUpdateStatus,
  onCreateFaq,
  onDelete,
}) => {
  if (!Array.isArray(pertanyaan) || pertanyaan.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Tidak ada pertanyaan ditemukan
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pertanyaan.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {item.nama_lengkap || "N/A"}
                </h3>
                {getStatusBadge(item.status)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {item.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">No HP:</span>{" "}
                  {item.no_hp || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Topik:</span>{" "}
                  {item.topik || "N/A"}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString("id-ID")
                : "N/A"}
            </span>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              {item.isi_pertanyaan || "Tidak ada pertanyaan"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onViewDetail(item)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Detail
            </button>

            {item.status === "pending" && (
              <>
                <button
                  onClick={() => onUpdateStatus(item.id, "processed")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Proses
                </button>
                <button
                  onClick={() => onUpdateStatus(item.id, "rejected")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak
                </button>
              </>
            )}

            {(item.status === "pending" || item.status === "processed") && (
              <button
                onClick={() => onCreateFaq(item)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Jadikan FAQ
              </button>
            )}

            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function untuk mengambil text pertanyaan
const getPertanyaanText = (faqItem) => {
  // Prioritas 1: Ambil dari kolom pertanyaan (string) - untuk FAQ manual
  if (faqItem.pertanyaan && typeof faqItem.pertanyaan === "string") {
    return faqItem.pertanyaan;
  }

  // Prioritas 2: Ambil dari relasi pertanyaanRelation - untuk FAQ dari pertanyaan user
  if (faqItem.pertanyaanRelation && faqItem.pertanyaanRelation.isi_pertanyaan) {
    return faqItem.pertanyaanRelation.isi_pertanyaan;
  }

  // Default jika tidak ada
  return "Tidak ada pertanyaan";
};

export const FaqList = ({ faqs, onEdit, onToggleActive, onDelete }) => {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Tidak ada FAQ ditemukan
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {getPertanyaanText(item)}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Topik:</span>{" "}
                {item.topik || "N/A"} |
                <span className="font-medium ml-2">Urutan:</span>{" "}
                {item.urutan || 0} |
                <span className="font-medium ml-2">Views:</span>{" "}
                {item.view_count || 0}
                {item.publisher && (
                  <>
                    {" | "}
                    <span className="font-medium ml-2">Publisher:</span>{" "}
                    {item.publisher.nama || "N/A"}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              {item.jawaban || "Tidak ada jawaban"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => onToggleActive(item.id)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                item.is_active
                  ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {item.is_active ? (
                <XCircle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {item.is_active ? "Nonaktifkan" : "Aktifkan"}
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PertanyaanList;
