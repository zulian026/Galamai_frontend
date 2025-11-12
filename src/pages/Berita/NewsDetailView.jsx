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
  ChevronRight,
  TrendingUp,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
} from "lucide-react";

export default function NewsDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [otherNews, setOtherNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setReadProgress(progress);
      setShowScrollTop(scrollTop > 400);
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

  const formatDateShort = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
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
        setError("ID berita tidak ditemukan");
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
          setError("Berita tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching berita:", err);
        setError("Gagal memuat berita. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const token = getAuthToken();
        const response = await beritaEventService.getAll(token);
        if (response?.data && Array.isArray(response.data)) {
          // Related articles (same type)
          const related = response.data
            .filter(
              (item) =>
                item.type === type && item.id.toString() !== id.toString()
            )
            .slice(0, 3);
          setRelatedArticles(related);

          // Other news (different or mixed, excluding current)
          const others = response.data
            .filter((item) => item.id.toString() !== id.toString())
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
          setOtherNews(others);
        }
      } catch (err) {
        console.error("Error fetching related berita:", err);
      }
    };
    if (article) {
      fetchAllArticles();
    }
  }, [article, id, type]);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = article?.title || "";
    const text = article?.description?.substring(0, 100) + "..." || "";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({ title, text, url });
          } catch (err) {
            console.log("Share cancelled");
          }
        }
    }
    setShowShareMenu(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-700 font-medium text-lg">Memuat berita...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Berita Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Maaf, berita yang Anda cari tidak tersedia
          </p>
          <button
            onClick={() => navigate("/berita/berita-event")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
          >
            Kembali ke Berita
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        ></div>
      </div>

      {/* HERO HEADER - More Compact */}
      <section>
        <div
          className="relative h-[400px] md:h-[450px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-header/95"></div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/berita/berita-event")}
            className="absolute top-6 left-6 z-20 flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
            <div className="mb-5">
              <span
                className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                  article.type === "berita"
                    ? "bg-blue-600/40 text-blue-100 border border-blue-400/50"
                    : "bg-green-600/40 text-green-100 border border-green-400/50"
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                {article.type === "berita" ? "Berita" : "Event"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight px-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-3xl mx-auto">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.created_at)}
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <span
              onClick={() => navigate("/")}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Beranda
            </span>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span
              onClick={() => navigate("/berita/berita-event")}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Berita & Event
            </span>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-800 font-medium truncate max-w-md">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={getImageUrl(article)}
                alt={article.title}
                className="w-full h-64 md:h-[480px] object-cover"
                onError={(e) => {
                  e.target.src = heroBg;
                }}
              />
            </div>

            {/* Share Buttons - Sticky on Desktop */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Bagikan
                  </button>

                  {showShareMenu && (
                    <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-20 min-w-[200px]">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 font-medium"
                      >
                        <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 font-medium"
                      >
                        <Twitter className="w-5 h-5 mr-3 text-sky-500" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 font-medium"
                      >
                        <Linkedin className="w-5 h-5 mr-3 text-blue-700" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center w-full px-4 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 font-medium"
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5 mr-3 text-green-600" />
                            <span className="text-green-600">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-5 h-5 mr-3 text-gray-600" />
                            Salin Link
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200">
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      article.description ||
                      "<p>Konten berita tidak tersedia.</p>",
                  }}
                />
              </div>
            </div>

            {/* Related Articles - Mobile/Tablet */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                  Berita Terkait
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <a
                      key={related.id}
                      href={`/berita/${related.type}/${related.id}`}
                      className="group block"
                    >
                      <article className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                        <div className="relative overflow-hidden">
                          <img
                            src={getImageUrl(related)}
                            alt={related.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = heroBg;
                            }}
                          />
                          <div className="absolute top-2 left-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                related.type === "berita"
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                              }`}
                            >
                              {related.type === "berita" ? "Berita" : "Event"}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-2">
                            {formatDateShort(related.created_at)}
                          </p>
                          <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-tight">
                            {related.title}
                          </h4>
                        </div>
                      </article>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - Berita Lainnya */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Berita Lainnya */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Berita Lainnya
                </h3>

                <div className="space-y-5">
                  {otherNews.map((news, index) => (
                    <a
                      key={news.id}
                      href={`/berita/${news.type}/${news.id}`}
                      className="group block"
                    >
                      <article className="flex gap-4 hover:bg-gray-50 p-3 rounded-xl transition-all duration-200 -mx-3">
                        <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(news)}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = heroBg;
                            }}
                          />
                          <div className="absolute top-1 left-1">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${
                                news.type === "berita"
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                              }`}
                            >
                              {news.type === "berita" ? "Berita" : "Event"}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {formatDateShort(news.created_at)}
                          </p>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-3 text-sm leading-tight mb-1">
                            {news.title}
                          </h4>
                          {news.views && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Eye className="w-3 h-3 mr-1" />
                              {news.views.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </article>
                    </a>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/berita/berita-event")}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                >
                  Lihat Semua Berita
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 z-40"
          aria-label="Scroll to top"
        >
          <ArrowLeft className="w-6 h-6 transform rotate-90" />
        </button>
      )}

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowShareMenu(false)}
        ></div>
      )}

      <style jsx>{`
        .prose {
          color: #374151;
          line-height: 1.8;
          font-size: 1.0625rem;
        }
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4 {
          color: #1f2937;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }
        .prose h1 {
          font-size: 2.25rem;
        }
        .prose h2 {
          font-size: 1.875rem;
        }
        .prose h3 {
          font-size: 1.5rem;
        }
        .prose h4 {
          font-size: 1.25rem;
        }
        .prose p {
          margin-bottom: 1.75rem;
          line-height: 1.85;
        }
        .prose ul,
        .prose ol {
          margin: 1.75rem 0;
          padding-left: 2rem;
        }
        .prose li {
          margin-bottom: 0.875rem;
          line-height: 1.75;
        }
        .prose strong {
          font-weight: 600;
          color: #1f2937;
        }
        .prose a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .prose a:hover {
          border-bottom-color: #2563eb;
        }
        .prose blockquote {
          border-left: 4px solid #3b82f6;
          margin: 2rem 0;
          padding: 1.25rem 1.75rem;
          background: #f8fafc;
          border-radius: 0 0.75rem 0.75rem 0;
          font-style: italic;
          color: #475569;
        }
        .prose img {
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .prose code {
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.9em;
          color: #e11d48;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
