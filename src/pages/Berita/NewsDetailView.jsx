import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { beritaEventService } from "../../services/beritaEventService";
import heroBg from "../../assets/images/hero-bg.png";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Eye,
  Clock,
  Tag,
  MapPin,
  AlertCircle,
} from "lucide-react";

export default function NewsDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format tanggal ke format Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    };

    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  // Estimasi waktu baca berdasarkan panjang konten
  const estimateReadTime = (content) => {
    if (!content) return "1 menit";

    // Hapus HTML tags untuk menghitung kata
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    const wordsPerMinute = 200; // Rata-rata orang dewasa membaca 200 kata per menit
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return `${minutes} menit`;
  };

  // Fungsi untuk mendapatkan token (sesuaikan dengan sistem auth Anda)
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("ID artikel tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = getAuthToken();
        const response = await beritaEventService.getById(id, token);

        if (response?.data) {
          setArticle(response.data);
        } else {
          setError("Data artikel tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Gagal memuat artikel. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Fetch related articles
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const token = getAuthToken();
        const response = await beritaEventService.getAll(token);

        if (response?.data && Array.isArray(response.data)) {
          // Filter artikel terkait: sama tipe, bukan artikel yang sedang dilihat
          const related = response.data
            .filter(
              (item) =>
                item.type === type && item.id.toString() !== id.toString()
            )
            .slice(0, 3); // Ambil maksimal 3 artikel terkait

          setRelatedArticles(related);
        }
      } catch (err) {
        console.error("Error fetching related articles:", err);
        // Tidak perlu set error untuk related articles
      }
    };

    if (article) {
      fetchRelatedArticles();
    }
  }, [article, id, type]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.description?.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      // Fallback untuk browser yang tidak support Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Link berhasil disalin!");
        })
        .catch(() => {
          // Fallback jika clipboard API juga tidak didukung
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Link berhasil disalin!");
        });
    }
  };

  const getImageUrl = (article) => {
    // Prioritas: image_url dari backend, lalu image, lalu fallback
    return (
      article?.image_url ||
      (article?.image
        ? `${import.meta.env.VITE_API_URL}/storage/${article.image}`
        : heroBg)
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/berita/berita-event")}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kembali ke Berita & Event
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Artikel tidak ditemukan
          </h2>
          <button
            onClick={() => navigate("/berita/berita-event")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Berita
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO HEADER */}
      <section>
        <div
          className="relative h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-header/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
            {/* Category Tag */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  article.type === "berita"
                    ? "bg-blue-600/20 text-blue-100 border border-blue-400/30"
                    : "bg-green-600/20 text-green-100 border border-green-400/30"
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                {article.type === "berita" ? "Berita" : "Event"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.created_at)}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Tim BPOM
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {estimateReadTime(article.description)}
              </div>
              {article.views && (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {article.views.toLocaleString()} views
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="text-sm text-gray-600">
            <span>Beranda</span> → <span>Berita & Event</span> →
            <span className="text-gray-800 font-medium"> {article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Share Button */}
        <div className="mb-8">
          <button
            onClick={handleShare}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Bagikan Artikel
          </button>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={getImageUrl(article)}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.target.src = heroBg; // Fallback image jika gagal load
            }}
          />
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  article.description ||
                  "<p>Konten artikel tidak tersedia.</p>",
              }}
            />
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Artikel Terkait</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <a
                  key={related.id}
                  href={`/berita/${related.type}/${related.id}`}
                  className="group block"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <img
                      src={getImageUrl(related)}
                      alt={related.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = heroBg;
                      }}
                    />
                    <div className="p-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {related.type === "berita" ? "Berita" : "Event"}
                      </span>
                      <h4 className="font-semibold mt-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(related.created_at)}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Custom Styles */}
      <style jsx>{`
        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .prose h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
          color: #4b5563;
        }

        .prose ul {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .prose strong {
          font-weight: 600;
          color: #1f2937;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
