import { ArrowLeft, Edit3, Calendar, Eye, Share2, Loader2, Globe, FileText, Newspaper, CalendarCheck } from "lucide-react";
import { useState } from "react";

export default function BeritaPreview({ berita, onClose, onEdit, onPublish }) {
  const [publishing, setPublishing] = useState(false);

  if (!berita) return null;

  // Check if content is new (created within last 7 days)
  const isNew = () => {
    if (!berita.created_at) return false;
    const createdDate = new Date(berita.created_at);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long", 
        day: "numeric"
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Format relative time (e.g., "2 hari yang lalu")
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      
      if (diffInHours < 1) return "Baru saja";
      if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
      if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
      return formatDate(dateString);
    } catch (error) {
      return formatDate(dateString);
    }
  };

  // Clean HTML content for preview
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Handle publish action
  const handlePublish = async () => {
    if (!onPublish) return;
    
    setPublishing(true);
    try {
      await onPublish(berita.id);
    } catch (error) {
      console.error("Error publishing:", error);
    }
    setPublishing(false);
  };

  const isDraft = berita.status === 'draft';
  const isPublished = berita.status === 'publish';
  const isEvent = berita.type === 'event';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Preview {isEvent ? 'Event' : 'Berita'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Lihat bagaimana {isEvent ? 'event' : 'berita'} akan tampil untuk pembaca
                </p>
              </div>
              {/* Status Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isPublished ? '🟢 Published' : '🟡 Draft'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              <Edit3 size={16} />
              Edit {isEvent ? 'Event' : 'Berita'}
            </button>

            {/* Conditional buttons based on status */}
            {isDraft ? (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe size={16} />
                    Publish {isEvent ? 'Event' : 'Berita'}
                  </>
                )}
              </button>
            ) : (
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                <Share2 size={16} />
                Bagikan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Draft Notice */}
      {isDraft && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Draft Mode:</strong> {isEvent ? 'Event' : 'Berita'} ini belum dipublish dan hanya bisa dilihat oleh admin. 
                Klik <strong>"Publish {isEvent ? 'Event' : 'Berita'}"</strong> untuk mempublikasikan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Content Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              {/* Type Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isEvent 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isEvent ? (
                  <>
                    <CalendarCheck size={14} className="mr-1" />
                    Event
                  </>
                ) : (
                  <>
                    <Newspaper size={14} className="mr-1" />
                    Berita
                  </>
                )}
              </span>

              {isNew() && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✨ New {isEvent ? 'Event' : 'Article'}
                </span>
              )}

              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(berita.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{berita.views || 0} views</span>
                </div>
                <div className="text-gray-400">
                  • {formatRelativeTime(berita.created_at)}
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              {berita.title}
            </h1>
            
            {/* Cover Image */}
            {berita.image_url && (
              <div className="mt-6">
                <img
                  src={berita.image_url}
                  alt={berita.title}
                  className="w-full max-h-96 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
                  }}
                />
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={createMarkup(berita.description)}
              style={{
                lineHeight: '1.8',
                color: '#374151'
              }}
            />
          </div>

          {/* Content Footer */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isEvent ? 'Event' : 'Berita'} ini telah dilihat {berita.views || 0} kali
              </div>
              {isPublished && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Bagikan:</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Info Box */}
        <div className={`mt-6 rounded-lg p-4 ${
          isDraft 
            ? 'bg-yellow-50 border border-yellow-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
              isDraft ? 'bg-yellow-500' : 'bg-blue-500'
            }`}></div>
            <div>
              <p className={`font-medium ${
                isDraft ? 'text-yellow-800' : 'text-blue-800'
              }`}>
                {isDraft ? 'Draft Mode' : 'Preview Mode'}
              </p>
              <p className={`text-sm mt-1 ${
                isDraft ? 'text-yellow-700' : 'text-blue-700'
              }`}>
                {isDraft 
                  ? `${isEvent ? 'Event' : 'Berita'} ini masih dalam mode draft. Klik "Publish ${isEvent ? 'Event' : 'Berita'}" untuk mempublikasikan ke semua pembaca.`
                  : `Ini adalah tampilan preview ${isEvent ? 'event' : 'berita'} Anda. Pembaca akan melihat ${isEvent ? 'event' : 'berita'} dengan layout yang sama seperti ini.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}