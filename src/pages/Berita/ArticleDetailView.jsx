import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artikelService } from "../../services/artikelService";
import heroBg from "../../assets/images/hero-bg.png";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Eye,
  Clock,
  Tag,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const estimateReadTime = (content) => {
    if (!content) return "1 menit";
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} menit`;
  };

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

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
        const response = await artikelService.getById(id, token);
        if (response?.success && response?.data) {
          setArticle(response.data);
        } else {
          setError("Artikel tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching artikel:", err);
        setError("Gagal memuat artikel. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const token = getAuthToken();
        const response = await artikelService.getAll(token);
        if (response?.success && Array.isArray(response.data)) {
          const related = response.data
            .filter((item) => item.id.toString() !== id.toString())
            .slice(0, 3);
          setRelatedArticles(related);
        }
      } catch (err) {
        console.error("Error fetching related artikel:", err);
      }
    };
    if (article) {
      fetchRelatedArticles();
    }
  }, [article, id]);

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: article?.description?.substring(0, 100) + "...",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link berhasil disalin!");
      } catch {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link berhasil disalin!");
      }
    }
  };

  const getImageUrl = (article) => {
    return (
      article?.image_url ||
      (article?.image
        ? `${import.meta.env.VITE_API_URL}/storage/${article.image}`
        : heroBg)
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-700 font-medium">Memuat artikel...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Artikel tidak ditemukan
          </h2>
          <button
            onClick={() => navigate("/artikel")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Kembali ke Artikel
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen ">
      {/* HERO HEADER */}
      <section>
        <div
          className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/90 to-indigo-900/95"></div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/berita/artikel")}
            className="absolute top-6 left-6 z-20 flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm bg-green-600/30 text-green-100 border border-green-400/50">
                <Tag className="w-4 h-4 mr-2" />
                Artikel
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-4xl mx-auto">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {formatDate(article.tanggal || article.created_at)}
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {article.author || "Tim BPOM Padang"}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {estimateReadTime(article.description)}
              </div>
              {article.views && (
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  {article.views.toLocaleString()} views
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Beranda</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="hover:text-blue-600 cursor-pointer">Artikel</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-800 font-medium truncate max-w-md">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Action Buttons */}
        <div className="flex items-center justify-start mb-12">
          <button
            onClick={handleShare}
            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Bagikan
          </button>
        </div>

        {/* Main Image */}
        <div className="mb-12 group">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={getImageUrl(article)}
              alt={article.title}
              className="w-full h-64 md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = heroBg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl mb-12 border border-gray-100">
          <div className="prose prose-lg prose-blue max-w-none">
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
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                Artikel Terkait
              </h3>
              <ExternalLink className="w-6 h-6 text-gray-400" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <a
                  key={related.id}
                  href={`/artikel/${related.id}`}
                  className="group block"
                >
                  <article className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(related)}
                        alt={related.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = heroBg;
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
                          Artikel
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(related.tanggal || related.created_at)}
                      </p>
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                        {related.title}
                      </h4>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">
                          Baca selengkapnya
                        </span>
                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 z-50"
        >
          <ArrowLeft className="w-6 h-6 transform rotate-90" />
        </button>
      )}

      <style jsx>{`
        .prose {
          color: #374151;
          line-height: 1.75;
        }
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4 {
          color: #1f2937;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h1 {
          font-size: 2rem;
        }
        .prose h2 {
          font-size: 1.75rem;
        }
        .prose h3 {
          font-size: 1.5rem;
        }
        .prose h4 {
          font-size: 1.25rem;
        }
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        .prose ul,
        .prose ol {
          margin: 1.5rem 0;
          padding-left: 1.75rem;
        }
        .prose li {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
        .prose strong {
          font-weight: 600;
          color: #1f2937;
        }
        .prose a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        .prose a:hover {
          text-decoration: underline;
        }
        .prose blockquote {
          border-left: 4px solid #3b82f6;
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-radius: 0 0.5rem 0.5rem 0;
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
