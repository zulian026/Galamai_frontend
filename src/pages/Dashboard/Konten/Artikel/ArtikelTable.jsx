import {
  Edit3,
  Trash2,
  Loader2,
  Calendar,
  Eye,
  Image,
  ExternalLink,
  FileText,
  Globe,
} from "lucide-react";

export default function ArtikelTable({
  artikel,
  loading,
  onEdit,
  onDelete,
  onPreview,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  if (artikel.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 text-lg">Belum ada artikel</p>
          <p className="text-gray-400 text-sm mt-1">
            Tambahkan artikel pertama Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                Status
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
              <TableRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onPreview={onPreview}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Separate component for table row to improve readability
function TableRow({ item, onEdit, onDelete, onPreview }) {
  // Check if article is new (created within last 7 days)
  const isNew = () => {
    if (!item.created_at) return false;
    const createdDate = new Date(item.created_at);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  // Format date for display in table
  const formatTableDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDraft = item.status === "draft";
  const isPublished = item.status === "publish";

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="font-medium text-gray-900 line-clamp-2">
              {item.title}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isNew() && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  New
                </span>
              )}
            </div>
          </div>
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
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isPublished
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isPublished ? (
            <>
              <Globe size={14} className="mr-1" />
              Published
            </>
          ) : (
            <>
              <FileText size={14} className="mr-1" />
              Draft
            </>
          )}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="text-sm">{formatTableDate(item.created_at)}</span>
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
            onClick={() => onPreview(item)}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Preview"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
